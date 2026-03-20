'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconArrowsExchange,
  IconGitBranch,
  IconRoute,
  IconBolt,
  IconUsers,
  IconBrain,
  IconHeartbeat,
  IconRobot,
  IconShield,
  IconSettings,
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

const capabilities = [
  {
    icon: IconRobot,
    title: 'Create Digital Employees',
    description: 'Define identity, personality, skills, and permissions for each agent through SOUL.md and YAML config. Not chatbots — autonomous digital workers with their own workspace and memory.',
    features: ['SOUL.md personality definition', 'Per-agent model & provider', 'Independent workspace & memory', 'Custom tool allowlists'],
  },
  {
    icon: IconArrowsExchange,
    title: 'Delegate & Collaborate',
    description: 'Agents work as a team. The main agent dispatches sub-tasks via agent_spawn, consults specialists via agent_send, and coordinates results — hub-spoke orchestration at scale.',
    features: ['agent_spawn async delegation', 'agent_send sync consultation', 'Hub-spoke communication model', 'Automatic result reporting'],
  },
  {
    icon: IconRoute,
    title: 'Smart Message Routing',
    description: '8-level priority binding routes every incoming message to the right agent. Match by channel, account, peer, and group — or fall back to the default agent automatically.',
    features: ['8-level priority matching', 'Channel + peer + group routing', 'Multi-channel gateway', 'Automatic default fallback'],
  },
  {
    icon: IconHeartbeat,
    title: 'Monitor & Self-Patrol',
    description: 'Heartbeat auto-patrol checks task boards on schedule, reassigns stalled work, and sends status reports. Full audit trail with session-isolated memory for every agent.',
    features: ['Heartbeat periodic patrol', 'Task board auto-check', 'Session-isolated memory', 'Complete audit trail'],
  },
];

const stats = [
  { value: '100+', label: 'Agents per instance' },
  { value: '8', label: 'Routing levels' },
  { value: '3', label: 'Memory layers' },
  { value: '0', label: 'External deps' },
];

export function HighclawMultiagent({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Digital Workforce, Not Chatbots
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              Create, delegate, route, and monitor — a complete multi-agent system in a single Go binary.
              Each agent has its own identity, workspace, model, and memory.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats strip */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl md:text-3xl font-bold hc-gradient-text-blue">{stat.value}</p>
                <p className="text-sm text-[#64748b] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 2x2 capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {capabilities.map((cap, idx) => (
            <ScrollReveal key={idx} delay={200 + idx * 100}>
              <div className="hc-glass hc-glass-hover p-6 md:p-8 h-full rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 border border-[#3b82f6]/20">
                    <cap.icon size={24} className="text-[#3b82f6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#f8fafc] mb-1">{cap.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#94a3b8] leading-relaxed mb-5">{cap.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {cap.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#06b6d4]/50 flex-shrink-0" />
                      <span className="text-xs text-[#64748b]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Terminal demo */}
        <ScrollReveal delay={600}>
          <div className="max-w-3xl mx-auto">
            <div className="hc-code-block text-left">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#1e1e2e]">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
                <span className="text-xs text-[#64748b] ml-2">terminal — multi-agent setup</span>
              </div>
              <code className="text-sm leading-relaxed">
                <span className="text-[#6b7280]"># Create your AI workforce in minutes</span>{'\n'}
                <span className="text-[#c4b5fd]">$</span> <span className="text-[#f8fafc]">highclaw agents add</span>{'\n'}
                <span className="text-[#64748b]">  Agent name → architect</span>{'\n'}
                <span className="text-[#64748b]">  Model → claude-sonnet-4</span>{'\n'}
                <span className="text-[#64748b]">  Skills → [shell, file, search]</span>{'\n'}
                <span className="text-[#22c55e]">  ✓ Agent "architect" ready.</span>{'\n\n'}
                <span className="text-[#c4b5fd]">$</span> <span className="text-[#f8fafc]">highclaw agents list</span>{'\n'}
                <span className="text-[#64748b]">  • main (default) 🦀 — claude-sonnet-4</span>{'\n'}
                <span className="text-[#64748b]">  • architect       🏗️ — claude-sonnet-4</span>{'\n'}
                <span className="text-[#64748b]">  • writer           ✍️ — gemini-2.5-flash</span>{'\n'}
                <span className="text-[#64748b]">  • devops           🔧 — claude-sonnet-4</span>{'\n\n'}
                <span className="text-[#c4b5fd]">$</span> <span className="text-[#f8fafc]">highclaw gateway</span>{'\n'}
                <span className="text-[#22c55e]">  🟢 4 agents running on port 8080</span>
              </code>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
