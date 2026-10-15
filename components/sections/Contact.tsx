'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { profile } from '@/data/profile';
import { ContactSchema, ContactInput } from '@/lib/schemas/contact';
import { Mail, Check, Copy, Clock, MapPin, Send, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      website: '',
    },
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const onSubmit = async (data: ContactInput) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi gửi tin nhắn');
      }

      setSubmitStatus('success');
      reset();
    } catch (err: unknown) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[var(--bg-elevated)]/30">
      <Container>
        <Reveal>
          <SectionTitle
            index="06"
            eyebrow="CONTACT"
            title="Cùng xây dựng điều gì đó tuyệt vời?"
            description="Tôi luôn cởi mở trao đổi về các cơ hội Staff/Senior Engineering, tư vấn kiến trúc hoặc hợp tác kỹ thuật."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột trái: Kênh liên hệ trực tiếp */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal variant="fadeUp" delay={0.1}>
              <Card className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)]">
                    Direct Reach
                  </h4>
                  <p className="mt-1 text-sm text-[var(--fg-muted)]">
                    Bạn có thể gửi email trực tiếp hoặc kết nối qua mạng xã hội:
                  </p>
                </div>

                {/* Email Copy Card */}
                <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail className="w-5 h-5 text-[var(--primary)] shrink-0" />
                    <span className="text-sm font-mono text-[var(--fg)] truncate">
                      {profile.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyEmail}
                    className="shrink-0 gap-1.5"
                    aria-label="Copy email address"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-500 font-medium">Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Info List */}
                <div className="space-y-4 pt-2 text-sm text-[var(--fg-muted)]">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <span>Thời gian phản hồi dự kiến: &lt; 24 giờ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-[var(--border)] flex gap-3">
                  {profile.socials.github && (
                    <Button asChild variant="outline" size="sm">
                      <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {profile.socials.linkedin && (
                    <Button asChild variant="outline" size="sm">
                      <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkedinIcon className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            </Reveal>
          </div>

          {/* Cột phải: Contact Form */}
          <div className="lg:col-span-7">
            <Reveal variant="fadeUp" delay={0.15}>
              <Card className="p-6 sm:p-8">
                {submitStatus === 'success' ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--fg)]">Tin nhắn đã được gửi!</h3>
                    <p className="text-sm text-[var(--fg-muted)] max-w-md mx-auto">
                      Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi qua email của bạn trong thời gian sớm nhất.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitStatus('idle')}
                      className="mt-4"
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Honeypot hidden input */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                      {...register('website')}
                    />

                    {submitStatus === 'error' && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-xs font-mono uppercase text-[var(--fg)] mb-2">
                        Tên của bạn *
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg)] border text-sm text-[var(--fg)] placeholder-[var(--fg-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${
                          errors.name ? 'border-rose-500' : 'border-[var(--border)]'
                        }`}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono uppercase text-[var(--fg)] mb-2">
                        Địa chỉ Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg)] border text-sm text-[var(--fg)] placeholder-[var(--fg-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${
                          errors.email ? 'border-rose-500' : 'border-[var(--border)]'
                        }`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-mono uppercase text-[var(--fg)] mb-2">
                        Nội dung tin nhắn *
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Chia sẻ về dự án, vai trò hoặc ý tưởng bạn muốn trao đổi..."
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg)] border text-sm text-[var(--fg)] placeholder-[var(--fg-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${
                          errors.message ? 'border-rose-500' : 'border-[var(--border)]'
                        }`}
                        {...register('message')}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-rose-500">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full gap-2 py-3"
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? (
                        <span>Đang gửi tin nhắn...</span>
                      ) : (
                        <>
                          <span>Gửi tin nhắn</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Contact;
