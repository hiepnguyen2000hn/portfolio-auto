import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';
import { contactRateLimiter } from '@/lib/rate-limit';

function createPostRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('Contact API Route (POST /api/contact)', () => {
  beforeEach(() => {
    // Reset rate limiter state before each test
    contactRateLimiter.reset();
    vi.restoreAllMocks();
  });

  it('returns 200 and success message when valid payload is submitted', async () => {
    const validPayload = {
      name: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      message: 'Xin chào, tôi muốn thảo luận về dự án hợp tác.',
      website: '',
    };

    const req = createPostRequest(validPayload, { 'x-forwarded-for': '192.168.1.100' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.message).toBe('Message sent successfully');
  });

  it('returns 400 with validation errors when fields are missing or invalid', async () => {
    const invalidPayload = {
      name: 'A', // too short (< 2)
      email: 'not-an-email',
      message: 'Short', // too short (< 10)
    };

    const req = createPostRequest(invalidPayload, { 'x-forwarded-for': '192.168.1.101' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.fields).toBeDefined();
    expect(data.fields.name).toBeDefined();
    expect(data.fields.email).toBeDefined();
    expect(data.fields.message).toBeDefined();
  });

  it('returns 400 when request body contains malformed JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.102',
      },
      body: '{ malformed json',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error).toBe('INVALID_JSON');
  });

  it('returns fake 200 success without sending email when honeypot website field is filled (bot spam)', async () => {
    const spamPayload = {
      name: 'Spam Bot',
      email: 'spammer@bot.org',
      message: 'Hello, buy cryptocurrency now to get rich quickly!',
      website: 'https://spam-bot.site',
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const req = createPostRequest(spamPayload, { 'x-forwarded-for': '192.168.1.103' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    // Verified that Resend API fetch is never called when honeypot triggers
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('enforces in-memory rate limiting (max 5 requests per 10 minutes)', async () => {
    const testIp = '10.0.0.99';
    const validPayload = {
      name: 'Legit User',
      email: 'user@example.com',
      message: 'Testing rate limiter functionality on contact endpoint.',
    };

    // First 5 requests should succeed (200)
    for (let i = 1; i <= 5; i++) {
      const req = createPostRequest(validPayload, { 'x-forwarded-for': testIp });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 6th request from the same IP must be rate limited (429)
    const blockedReq = createPostRequest(validPayload, { 'x-forwarded-for': testIp });
    const blockedRes = await POST(blockedReq);
    const blockedData = await blockedRes.json();

    expect(blockedRes.status).toBe(429);
    expect(blockedData.error).toBe('RATE_LIMIT_EXCEEDED');
    expect(blockedRes.headers.get('Retry-After')).toBeDefined();

    // A different IP address should still succeed
    const differentIpReq = createPostRequest(validPayload, { 'x-forwarded-for': '10.0.0.100' });
    const differentIpRes = await POST(differentIpReq);
    expect(differentIpRes.status).toBe(200);
  });
});
