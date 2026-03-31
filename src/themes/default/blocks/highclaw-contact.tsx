'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconMail,
  IconBrandGithub,
  IconBrandDiscord,
  IconBrandX,
  IconSend,
  IconCheck,
} from '@tabler/icons-react';
import { Section } from '@/shared/types/blocks/landing';

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transitionDelay: `${delay}ms`,
      transitionDuration: '600ms',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }}>{children}</div>
  );
}

const contactLinks = [
  {
    icon: IconMail,
    title: 'Email',
    value: 'z903174293@gmail.com',
    href: 'mailto:z903174293@gmail.com',
  },
  {
    icon: IconBrandGithub,
    title: 'GitHub',
    value: 'github.com/HighClawHub/highclaw',
    href: 'https://github.com/HighClawHub/highclaw',
    external: true,
  },
  {
    icon: IconBrandDiscord,
    title: 'Discord',
    value: 'Join our community',
    href: 'https://discord.gg/89C8zWz4H',
    external: true,
  },
  {
    icon: IconBrandX,
    title: 'Twitter / X',
    value: '@W19EcJkZ1Z29433',
    href: 'https://x.com/W19EcJkZ1Z29433',
    external: true,
  },
];

const subjectOptions = [
  'General Inquiry',
  'Partnership',
  'Bug Report',
  'Feature Request',
  'Enterprise',
];

export function HighclawContact({ section }: { section: Section }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    honeypot: '', // anti-spam
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Honeypot check
    if (formState.honeypot) return;

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/email/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'z903174293@gmail.com',
          subject: `[Contact Form] ${formState.subject}: ${formState.name}`,
          text: `Name: ${formState.name}\nEmail: ${formState.email}\nSubject: ${formState.subject}\n\nMessage:\n${formState.message}`,
        }),
      });
      if (!resp.ok) throw new Error('Failed to send');
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: 'General Inquiry', message: '', honeypot: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Contact Us
            </h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
              Have a question, partnership inquiry, or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact form */}
          <ScrollReveal delay={100}>
            <div className="hc-glass p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                    <IconCheck size={32} className="text-[#22c55e]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[#94a3b8]">
                    We&apos;ll get back to you within 48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-[#3b82f6] hover:text-[#06b6d4] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot - hidden */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formState.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">
                      Name <span className="text-[#ef4444]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#f8fafc] text-sm placeholder-[#64748b] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 transition-colors outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">
                      Email <span className="text-[#ef4444]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#f8fafc] text-sm placeholder-[#64748b] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 transition-colors outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#f8fafc] text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 transition-colors outline-none"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">
                      Message <span className="text-[#ef4444]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#f8fafc] text-sm placeholder-[#64748b] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 transition-colors outline-none resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-[#ef4444]">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="hc-btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <IconSend size={18} />
                    )}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">Get in Touch</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Whether you&apos;re interested in a partnership, have a bug to report, or just
                  want to say hi — we&apos;re here for you.
                </p>
              </div>

              <div className="space-y-4">
                {contactLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target={link.external ? '_blank' : '_self'}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="hc-glass hc-glass-hover p-4 flex items-center gap-4 block"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 border border-[#3b82f6]/20 flex-shrink-0">
                      <link.icon size={20} className="text-[#3b82f6]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f8fafc]">{link.title}</p>
                      <p className="text-xs text-[#64748b]">{link.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
