'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconBuilding,
  IconBrain,
  IconMessage,
  IconFileAnalytics,
  IconClock,
  IconBooks,
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

const features = [
  {
    icon: IconBuilding,
    title: 'Multi-Agent Isolation',
    description: 'Each agent gets its own workspace, memory, model, and tools. Session-key based isolation ensures zero data leakage between agents.',
  },
  {
    icon: IconBrain,
    title: 'LLM Model Pool',
    description: 'Configure multiple LLM providers — OpenAI, Anthropic, DeepSeek, Ollama, OpenRouter — with intelligent failover and per-agent routing.',
  },
  {
    icon: IconMessage,
    title: 'Multi-Channel Integration',
    description: 'Every agent gets its own channel bindings. Chat with agents in DMs or @mention in groups across Telegram, Discord, Feishu, Slack, and more.',
  },
  {
    icon: IconFileAnalytics,
    title: 'Audit & Observability',
    description: 'Complete operation tracking for compliance. Every agent action is logged with timestamps, session keys, and tool invocations.',
  },
  {
    icon: IconClock,
    title: 'Scheduled Tasks & Heartbeat',
    description: 'Cron-based recurring work for agents. Daily reports, weekly analyses, periodic monitoring — fully automated via HEARTBEAT.md.',
  },
  {
    icon: IconBooks,
    title: 'Per-Agent Knowledge Base',
    description: 'Each agent maintains its own memory — session history, compacted notes, and SQLite hybrid search. No shared state, no conflicts.',
  },
];

export function HighclawComparison({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Built for Organizations That Demand More
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
              Enterprise-grade agent infrastructure. Multi-agent isolation, intelligent model routing, and full audit trail — in a single Go binary.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feat, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="hc-glass hc-glass-hover p-6 h-full rounded-xl">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 border border-[#3b82f6]/20">
                  <feat.icon size={24} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">{feat.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{feat.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
