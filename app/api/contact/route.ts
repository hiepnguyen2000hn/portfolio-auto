import { NextRequest, NextResponse } from 'next/server';
import { ContactSchema } from '@/lib/schemas/contact';
import { contactRateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // 1. In-memory Rate Limiting by client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? (forwarded.split(',')[0] ?? '127.0.0.1').trim() : '127.0.0.1';

  const rateLimit = contactRateLimiter.check(ip);
  if (!rateLimit.success) {
    const retryAfter = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
    return NextResponse.json(
      {
        ok: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 10 phút.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  // 2. Parse & Validate Request Body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_JSON',
        message: 'Dữ liệu không đúng định dạng JSON.',
      },
      { status: 400 }
    );
  }

  const result = ContactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'VALIDATION_ERROR',
        message: 'Dữ liệu biểu mẫu không hợp lệ.',
        fields: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, message, website } = result.data;

  // 3. Honeypot Check (Spam bot detection)
  if (website && website.trim().length > 0) {
    // Return fake success silently without sending email
    return NextResponse.json(
      {
        ok: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  }

  // 4. Send Email via Resend (or simulate in development/test)
  const apiKey = process.env.RESEND_API_KEY;
  const isRealApiKey = apiKey && !apiKey.includes('placeholder') && apiKey.startsWith('re_');

  if (isRealApiKey) {
    try {
      const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
      const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@example.com';

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          subject: `[Portfolio Contact] Tin nhắn mới từ ${name}`,
          reply_to: email,
          html: `
            <h2>Tin nhắn liên hệ mới từ Portfolio</h2>
            <p><strong>Người gửi:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Nội dung:</strong></p>
            <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #3b82f6;white-space:pre-wrap;">${message}</blockquote>
          `,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to send email via Resend API:', errorText);
      }
    } catch (err) {
      console.error('Error invoking Resend API:', err);
    }
  } else {
    // Dev/mock mode simulation
    console.log(
      `[Contact API - Dev Mode] Email simulated:\n- From: ${name} <${email}>\n- Message: ${message}`
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: 'Message sent successfully',
    },
    { status: 200 }
  );
}
