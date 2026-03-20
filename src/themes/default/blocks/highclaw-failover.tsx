'use client';

import { useEffect, useRef, useState } from 'react';
import { IconLink, IconUser, IconClockHour4 } from '@tabler/icons-react';
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

const failoverSteps = [
  { provider: 'Primary Model (OpenAI)', status: 'error', statusText: '✗ timeout/error', color: '#ef4444' },
  { provider: 'Fallback 1 (Anthropic)', status: 'error', statusText: '✗ unavailable', color: '#f59e0b' },
  { provider: 'Fallback 2 (DeepSeek)', status: 'success', statusText: '✓ Response delivered', color: '#22c55e' },
];

const highlights = [
  {
    icon: IconLink,
    title: 'Provider Chain Config',
    description: 'Define failover priority per agent: OpenAI → Anthropic → Ollama → DeepSeek',
  },
  {
    icon: IconUser,
    title: 'Per-Agent Model Routing',
    description: 'Each agent can use a different primary model with its own fallback chain',
  },
  {
    icon: IconClockHour4,
    title: '24/7 Uptime Guarantee',
    description: 'Automatic retry with exponential backoff, health checks, and graceful degradation',
  },
];

export function HighclawFailover({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Always-On AI — Model Failover Built In
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              When your primary model goes down, HighClaw automatically switches to the next
              provider. Zero downtime, zero manual intervention.
            </p>
          </div>
        </ScrollReveal>

        {/* Failover flow diagram */}
        <ScrollReveal delay={200}>
          <div className="max-w-2xl mx-auto mb-16">
            <div className="hc-glass p-8">
              {/* User message */}
              <div className="text-center mb-6">
                <span className="px-4 py-2 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-sm font-mono text-[#7dd3fc]">
                  User Message
                </span>
              </div>

              {/* Failover chain */}
              <div className="space-y-4">
                {failoverSteps.map((step, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex items-center justify-between px-4 py-3 rounded-lg"
                        style={{
                          backgroundColor: `${step.color}08`,
                          border: `1px solid ${step.color}20`,
                        }}
                      >
                        <span className="text-sm font-mono text-[#f8fafc]">{step.provider}</span>
                        <span className="text-sm font-mono" style={{ color: step.color }}>
                          {step.statusText}
                        </span>
                      </div>
                    </div>
                    {idx < failoverSteps.length - 1 && (
                      <div className="flex items-center justify-center my-2">
                        <span className="text-xs font-mono text-[#64748b]">↓ auto-failover</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Sub-highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {highlights.map((item, idx) => (
            <ScrollReveal key={idx} delay={400 + idx * 100}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 border border-[#3b82f6]/20">
                  <item.icon size={22} className="text-[#3b82f6]" />
                </div>
                <h4 className="text-sm font-semibold text-[#f8fafc] mb-1">{item.title}</h4>
                <p className="text-sm text-[#64748b]">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
