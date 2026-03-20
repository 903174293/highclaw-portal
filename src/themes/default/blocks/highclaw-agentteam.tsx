'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconUserPlus,
  IconUsersGroup,
  IconTopologyStarRing3,
  IconHeartbeat,
  IconTerminal2,
  IconBrain,
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
    step: '01',
    icon: IconUserPlus,
    title: 'Create Digital Personas',
    subtitle: 'Build unique AI identities with SOUL.md',
    description: 'Define each agent\'s personality, expertise, and work style through simple Markdown files. Give them names, emojis, specialized skills, and distinct behavioral patterns — just like hiring a real team member.',
    color: '#3b82f6',
    features: ['SOUL.md personality definition', 'Per-agent model & provider', 'Custom skill allowlists', 'Isolated workspace per agent'],
    code: `# ~/.highclaw/workspace-naruto/SOUL.md
# 🍥 Naruto — Code Expert

## Who you are
You are Naruto, a code execution expert.
Hot-blooded, tenacious, never gives up.

## Skills: [shell, file, memory]
## Model: minimax/MiniMax-M2.5`,
  },
  {
    step: '02',
    icon: IconUsersGroup,
    title: 'Assemble Agent Teams',
    subtitle: 'Interactive CLI to build your AI workforce',
    description: 'Use the interactive wizard to add agents, configure models, assign skills, and set up communication protocols. Build a complete AI team in minutes, not hours.',
    color: '#06b6d4',
    features: ['highclaw agents add wizard', 'YAML config (human-friendly)', 'Agent-to-Agent communication', 'Sub-agent spawn & delegation'],
    code: `# Add a new agent interactively
$ highclaw agents add
┌  Add HighClaw agent
◇ Agent name → naruto
◇ Workspace  → ~/.highclaw/workspace-naruto
◇ Model      → minimax/MiniMax-M2.5
◇ Skills     → shell, file, memory
└ Agent "naruto" ready.

$ highclaw agents set-identity naruto \\
    --name "Naruto" --emoji "🍥"`,
  },
  {
    step: '03',
    icon: IconTopologyStarRing3,
    title: 'Orchestrate & Manage',
    subtitle: 'Intelligent task dispatch with hub-spoke model',
    description: 'The main agent acts as a central hub — dispatching tasks via agent_spawn, coordinating via agent_send, and monitoring through Heartbeat. Sub-agents report back exclusively through the main agent, ensuring clean communication flow.',
    color: '#8b5cf6',
    features: ['agent_spawn async delegation', 'agent_send sync messaging', 'Heartbeat auto-patrol', '8-level priority routing'],
    code: `# config.yaml — Team Orchestration
agents:
  list:
    - id: main        # Team Lead (hub)
      subagents:
        allowAgents: [naruto, sasuke, sakura]
        maxConcurrent: 3
    - id: naruto       # Code Expert
      skills: [shell, file, memory]
    - id: sasuke       # Deep Thinker
      skills: [search, memory]
    - id: sakura       # Knowledge Keeper
      skills: [file, memory]
  agentToAgent:
    enabled: true`,
  },
];

const workflowSteps = [
  { icon: IconBrain, label: 'Main Agent receives task', color: '#3b82f6' },
  { icon: IconTopologyStarRing3, label: 'Analyzes & dispatches via agent_spawn', color: '#06b6d4' },
  { icon: IconUsersGroup, label: 'Sub-agents execute in parallel', color: '#8b5cf6' },
  { icon: IconHeartbeat, label: 'Heartbeat monitors & auto-patrols', color: '#22c55e' },
  { icon: IconTerminal2, label: 'Results reported back to Main', color: '#f59e0b' },
];

export function HighclawAgentteam({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Build Your AI Workforce
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              From digital personas to coordinated agent teams — all in one config file.
              Create, assemble, and orchestrate your AI team in minutes.
            </p>
          </div>
        </ScrollReveal>

        {/* Three capability cards */}
        <div className="space-y-12 max-w-6xl mx-auto mb-20">
          {capabilities.map((cap, idx) => (
            <ScrollReveal key={idx} delay={idx * 150}>
              <div className="hc-glass p-6 md:p-8 rounded-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${cap.color}15`, border: `1px solid ${cap.color}30` }}
                      >
                        <cap.icon size={24} style={{ color: cap.color }} />
                      </div>
                      <div>
                        <span className="text-xs font-mono" style={{ color: cap.color }}>STEP {cap.step}</span>
                        <h3 className="text-xl font-bold text-[#f8fafc]">{cap.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-3" style={{ color: cap.color }}>{cap.subtitle}</p>
                    <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">{cap.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cap.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs text-[#94a3b8]">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cap.color }} />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Code */}
                  <div className="hc-code-block text-left overflow-x-auto">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#1e1e2e]">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                      <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
                      <span className="text-xs text-[#64748b] ml-2">
                        {idx === 0 ? 'SOUL.md' : idx === 1 ? 'terminal' : 'config.yaml'}
                      </span>
                    </div>
                    <pre className="text-xs md:text-sm leading-relaxed text-[#e2e8f0] whitespace-pre-wrap">
                      {cap.code}
                    </pre>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Workflow visualization */}
        <ScrollReveal delay={500}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 hc-gradient-text-blue">
                How It Works
              </h3>
              <p className="text-[#94a3b8]">Hub-spoke orchestration model — clean, efficient, scalable</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 md:gap-2">
                  <div className="flex flex-col items-center text-center min-w-[120px]">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <step.icon size={28} style={{ color: step.color }} />
                    </div>
                    <p className="text-sm text-[#94a3b8] leading-tight max-w-[140px]">{step.label}</p>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="text-[#3b82f6] text-lg hidden md:block">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Communication rules */}
        <ScrollReveal delay={600}>
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="hc-glass p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-[#f8fafc] mb-4 text-center">Communication Protocol</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/20">
                  <p className="text-sm font-semibold text-[#22c55e] mb-1">Hub-Spoke Model</p>
                  <p className="text-xs text-[#94a3b8]">Main agent is the sole communication hub</p>
                </div>
                <div className="p-4 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/20">
                  <p className="text-sm font-semibold text-[#f59e0b] mb-1">No Cross-Talk</p>
                  <p className="text-xs text-[#94a3b8]">Sub-agents never communicate directly</p>
                </div>
                <div className="p-4 rounded-lg bg-[#3b82f6]/5 border border-[#3b82f6]/20">
                  <p className="text-sm font-semibold text-[#3b82f6] mb-1">Report to Main</p>
                  <p className="text-xs text-[#94a3b8]">All results flow back through Main agent</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
