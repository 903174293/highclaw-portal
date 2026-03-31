'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconRocket,
  IconUsers,
  IconPackage,
  IconBrain,
  IconMessage,
  IconShield,
} from '@tabler/icons-react';
import {
  SiTelegram,
  SiDiscord,
  SiSlack,
  SiWhatsapp,
  SiWechat,
  SiMatrix,
  SiSignal,
} from 'react-icons/si';
import { Section } from '@/shared/types/blocks/landing';

const advantages = [
  { icon: IconRocket, title: 'Ultra-High Performance', description: 'Built 100% in Go. Blazing fast, minimal memory footprint. Outperforms Node.js alternatives by orders of magnitude.' },
  { icon: IconUsers, title: '100+ Agent Scale', description: 'Run 100+ specialized agents in a single instance — each with isolated identity, workspace, model, and memory.' },
  { icon: IconPackage, title: 'Out-of-the-Box Ready', description: 'Single binary, zero dependencies. Download → run → done. No package managers, no environment setup needed.' },
  { icon: IconBrain, title: '22+ AI Providers', description: 'OpenRouter, Anthropic, OpenAI, Ollama, DeepSeek, Gemini, and more. 100% model-agnostic — swap with one config change.' },
  { icon: IconMessage, title: '12+ Channels', description: 'Telegram, Discord, Slack, WhatsApp, Feishu, WeChat — one gateway connects them all.' },
  { icon: IconShield, title: 'Model Failover & Security', description: 'Auto provider switching on failure ensures 24/7 uptime. Plus: sandbox isolation, pairing auth, encrypted secrets.' },
];

const allChannels = [
  { name: 'Telegram', Icon: SiTelegram, color: '#26A5E4' },
  { name: 'Discord', Icon: SiDiscord, color: '#5865F2' },
  { name: 'Slack', Icon: SiSlack, color: '#E01E5A' },
  { name: 'WhatsApp', Icon: SiWhatsapp, color: '#25D366' },
  /** 透明底 Logo：白底容器，见 public/feishu.jpg */
  { name: 'Feishu', Icon: null, color: '#3370FF', logoSrc: '/feishu.jpg' as const },
  { name: 'WeChat', Icon: SiWechat, color: '#07C160' },
  { name: 'iMessage', Icon: null, color: '#34C759', emoji: '💬' },
  { name: 'Matrix', Icon: SiMatrix, color: '#0DBD8B' },
  { name: 'Signal', Icon: SiSignal, color: '#3A76F0' },
  { name: 'Webhook', Icon: null, color: '#f59e0b', emoji: '🔗' },
  { name: 'IRC', Icon: null, color: '#CC5555', emoji: '#' },
  { name: 'CLI', Icon: null, color: '#06b6d4', emoji: '>' },
];

/** 单一渠道图标（仅 Feishu 使用白底 + 自定义图片，其余逻辑不变） */
function ChannelIconBox({ ch }: { ch: (typeof allChannels)[number] }) {
  const bg =
    'logoSrc' in ch && ch.logoSrc ? '#ffffff' : `${ch.color}12`;
  return (
    <div
      className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {'logoSrc' in ch && ch.logoSrc ? (
        <img
          src={ch.logoSrc}
          alt={ch.name}
          className="max-h-[72%] max-w-[72%] object-contain"
        />
      ) : ch.Icon ? (
        <ch.Icon size={40} color={ch.color} />
      ) : (
        <span className="text-3xl font-bold" style={{ color: ch.color }}>{ch.emoji}</span>
      )}
    </div>
  );
}

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
    <div ref={ref} className="transition-all duration-600" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }}>{children}</div>
  );
}

export function HighclawAdvantages({ section }: { section: Section }) {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">Why HighClaw</h2>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">Built from the ground up for performance, scale, and developer experience.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="hc-glass hc-glass-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 border border-[#3b82f6]/20">
                  <item.icon size={24} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">{item.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ===== Multi-Channel AI Gateway ===== */}
        <ScrollReveal delay={600}>
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 hc-gradient-text-blue">Multi-Channel AI Gateway</h3>
              <p className="text-[#94a3b8]">One binary, 12+ messaging platforms — deploy anywhere</p>
            </div>

            <div className="hc-glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }} />

              <div className="relative space-y-1.5">
                {/* Top row — Chat Channels (blue border) */}
                <div className="rounded-xl p-4 border-2 border-[#3b82f6]/30 bg-[#3b82f6]/[0.03]">
                  <p className="text-sm font-bold text-[#3b82f6] mb-4 text-center tracking-widest uppercase" style={{ textShadow: '0 0 15px rgba(59,130,246,0.4)' }}>Chat Channels</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {allChannels.slice(0, 6).map((ch, i) => (
                      <div key={i} className="group flex flex-col items-center gap-2.5 py-4 px-2 rounded-xl border border-[#3b82f6]/15 bg-[#3b82f6]/[0.02] transition-all duration-300 hover:border-[#3b82f6]/35 hover:bg-[#3b82f6]/[0.06] hover:scale-105">
                        <ChannelIconBox ch={ch} />
                        <span className="text-xs font-medium text-[#e2e8f0]/80">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row — More Platforms (cyan border) */}
                <div className="rounded-xl p-4 border-2 border-[#06b6d4]/30 bg-[#06b6d4]/[0.03]">
                  <p className="text-sm font-bold text-[#06b6d4] mb-4 text-center tracking-widest uppercase" style={{ textShadow: '0 0 15px rgba(6,182,212,0.4)' }}>More Platforms</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {allChannels.slice(6).map((ch, i) => (
                      <div key={i} className="group flex flex-col items-center gap-2.5 py-4 px-2 rounded-xl border border-[#06b6d4]/15 bg-[#06b6d4]/[0.02] transition-all duration-300 hover:border-[#06b6d4]/35 hover:bg-[#06b6d4]/[0.06] hover:scale-105">
                        <ChannelIconBox ch={ch} />
                        <span className="text-xs font-medium text-[#e2e8f0]/80">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom badges */}
              <div className="relative flex flex-wrap justify-center gap-3 mt-6 pt-5 border-t border-[#1e1e2e]">
                {['End-to-End Security', 'Hot-Reload Channels', 'Persistent Memory', 'Single Go Binary'].map((badge, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[10px] font-medium text-[#06b6d4]/60 bg-[#06b6d4]/[0.04] border border-[#06b6d4]/10">{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ====== Powerful Skills & Tools ====== */}
        <ScrollReveal delay={700}>
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 hc-gradient-text-blue">Powerful Skills & Tools Out of the Box</h3>
              <p className="text-[#94a3b8] max-w-2xl mx-auto">Every agent comes pre-loaded with professional skills and operational tools. Plus the ability to discover and install more at runtime.</p>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <p className="text-sm font-bold text-[#3b82f6] mb-4 uppercase tracking-wider">Skills <span className="text-[#64748b] font-normal">8</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { emoji: '🔍', title: 'Web Research', desc: 'Structured research with source credibility scoring' },
                  { emoji: '📊', title: 'Data Analysis', desc: 'CSV analysis, pattern recognition, structured reports' },
                  { emoji: '✍️', title: 'Content Writing', desc: 'Articles, emails, marketing copy, documentation' },
                  { emoji: '📈', title: 'Competitive Analysis', desc: 'SWOT, Porter\'s 5 Forces, market positioning' },
                  { emoji: '📝', title: 'Meeting Notes', desc: 'Summaries with action items and follow-ups' },
                  { emoji: '⭐', title: 'Complex Task Executor', desc: 'Multi-step planning with plan.md structured execution' },
                  { emoji: '⭐', title: 'Skill Creator', desc: 'Agents create new skills for themselves or others' },
                  { emoji: '📰', title: 'Content Research Writer', desc: 'Research-driven high-quality content writing' },
                ].map((skill, i) => (
                  <div key={i} className="hc-glass hc-glass-hover p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{skill.emoji}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#f8fafc] mb-1">{skill.title}</h4>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">{skill.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <p className="text-sm font-bold text-[#06b6d4] mb-4 uppercase tracking-wider">Tools <span className="text-[#64748b] font-normal">15</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { emoji: '📁', title: 'File Management', desc: 'List, read, write, delete workspace files' },
                  { emoji: '📄', title: 'Document Reader', desc: 'Extract text from PDF, Word, Excel, PPT' },
                  { emoji: '📋', title: 'Task Manager', desc: 'Kanban-style task create, update, track' },
                  { emoji: '💬', title: 'Agent Message', desc: 'Inter-agent communication and delegation' },
                  { emoji: '📨', title: 'Channel Message', desc: 'Send messages to colleagues via Feishu, Slack, etc.' },
                  { emoji: '🌐', title: 'Web Search', desc: 'DuckDuckGo, Tavily, Google, Bing' },
                  { emoji: '💻', title: 'Code Executor', desc: 'Sandboxed Python, Bash, Node.js runtime' },
                  { emoji: '🔌', title: 'MCP Discovery', desc: 'Search Smithery + ModelScope MCP registries' },
                  { emoji: '📦', title: 'MCP Import', desc: 'One-click import MCP servers as platform tools' },
                  { emoji: '🛡️', title: 'Sandbox', desc: 'Path jail, command allowlist, symlink protection' },
                  { emoji: '🔑', title: 'Encrypted Secrets', desc: 'Secure local key file with XOR encryption' },
                  { emoji: '📡', title: 'Webhook / API', desc: 'Gateway API, health check, skill endpoints' },
                ].map((tool, i) => (
                  <div key={i} className="hc-glass hc-glass-hover p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{tool.emoji}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#f8fafc] mb-1">{tool.title}</h4>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">{tool.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
