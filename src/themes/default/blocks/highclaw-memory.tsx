'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconDatabase,
  IconSearch,
  IconVector,
  IconArrowMerge,
  IconLanguage,
  IconClock,
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

const layers = [
  { level: 'L1', title: 'Session History', description: 'Per-session conversation tracking · 4-level DM isolation', icon: IconClock },
  { level: 'L2', title: 'Notes / Compaction', description: 'Auto-compressed long-term memory · Retention policies', icon: IconBrain },
  { level: 'L3', title: 'SQLite / Embedding', description: 'FTS5 + Vector Cosine Similarity · Hybrid search', icon: IconDatabase },
];

const searchEngines = [
  { icon: IconSearch, title: 'FTS5 Full-Text', desc: 'BM25 scoring · Normalized [0,1]', sub: 'content= mode · Zero redundancy' },
  { icon: IconVector, title: 'Vector Search', desc: 'SQLite BLOB · Cosine similarity', sub: '100/batch · LRU cache' },
  { icon: IconArrowMerge, title: 'Hybrid Merge', desc: 'Vector 0.7 + Keyword 0.3', sub: 'Best-of-both-worlds accuracy' },
  { icon: IconLanguage, title: 'CJK Fallback', desc: 'Auto-detect → LIKE fallback', sub: 'Chinese · Japanese · Korean' },
];

const stats = [
  { value: '30-60x', label: 'faster' },
  { value: 'CJK', label: 'auto-fallback' },
  { value: '100/batch', label: 'embedding' },
  { value: 'Zero', label: 'external deps' },
];

export function HighclawMemory({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Industry-Leading Memory System
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              Full-stack search engine inside a single SQLite file. No Pinecone. No Elasticsearch. No Redis.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-5xl mx-auto mb-16">
            <div className="hc-glass p-6 md:p-8 rounded-xl relative overflow-hidden">
              {/* Grid bg */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }} />

              <div className="relative space-y-6">
                {/* Three-layer stack */}
                <div className="space-y-2">
                  {layers.map((layer, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#3b82f6]/[0.03] border border-[#3b82f6]/12 transition-all duration-300 hover:border-[#3b82f6]/25 hover:bg-[#3b82f6]/[0.05]">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center bg-[#3b82f6]/[0.06] border border-[#3b82f6]/15">
                          <layer.icon size={16} className="text-[#60a5fa]/70" />
                          <span className="text-[8px] font-mono font-bold text-[#3b82f6]/50 mt-0.5">{layer.level}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#e2e8f0]">{layer.title}</h4>
                          <p className="text-xs text-[#64748b]">{layer.description}</p>
                        </div>
                      </div>
                      {idx < layers.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <div className="w-px h-3 bg-gradient-to-b from-[#3b82f6]/30 to-[#06b6d4]/30" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Search engines grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {searchEngines.map((engine, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#06b6d4]/[0.03] border border-[#06b6d4]/10 transition-all duration-300 hover:border-[#06b6d4]/25">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#06b6d4]/[0.08]">
                          <engine.icon size={13} className="text-[#06b6d4]/70" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#06b6d4]/80">{engine.title}</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8]/60 leading-relaxed">{engine.desc}</p>
                      <p className="text-[9px] text-[#64748b]/50 mt-0.5">{engine.sub}</p>
                    </div>
                  ))}
                </div>

                {/* SQLite driver bar */}
                <div className="rounded-xl p-3 bg-gradient-to-r from-[#3b82f6]/[0.04] to-[#06b6d4]/[0.04] border border-[#3b82f6]/10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#06b6d4]/80">modernc.org/sqlite — Pure Go In-Process</p>
                      <p className="text-[9px] text-[#64748b]/50">Zero CGO · Cross-compile · WAL mode · Parameterized queries</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 h-1.5 rounded-full bg-[#3b82f6]/10 overflow-hidden">
                          <div className="h-full w-full bg-[#3b82f6]/20 rounded-full" />
                        </div>
                        <span className="text-[8px] text-[#64748b]/40">old: 5-15ms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 h-1.5 rounded-full bg-[#06b6d4]/10 overflow-hidden">
                          <div className="h-full w-[5%] bg-[#06b6d4]/60 rounded-full" />
                        </div>
                        <span className="text-[8px] text-[#06b6d4]/60 font-semibold">now: 20-250μs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLI */}
                <div className="text-center">
                  <code className="text-[9px] font-mono text-[#3b82f6]/25">
                    highclaw memory search | get | list | status | sync | reset
                  </code>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={400}>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl md:text-3xl font-bold hc-gradient-text-blue">{stat.value}</p>
                <p className="text-sm text-[#64748b] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
