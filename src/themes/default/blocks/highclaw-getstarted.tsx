'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconDownload, IconBrandGithub, IconBrandDiscord } from '@tabler/icons-react';
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

export function HighclawGetstarted({ section }: { section: Section }) {
  const [copied, setCopied] = useState(false);

  const codeContent = `# 1. Build
git clone https://github.com/HighClawHub/highclaw.git && cd highclaw && make build && make install

# 2. Setup
highclaw onboard --interactive

# 3. Chat
highclaw agent -m "Hello, HighClaw!"`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section className="py-24 md:py-32 relative">
      {/* Background glow */}
      <div className="hc-glow-orb w-[500px] h-[500px] bg-[#3b82f6] top-0 left-1/2 -translate-x-1/2 animate-[hc-pulse-glow_3s_ease-in-out_infinite]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Get Started in 3 Steps
            </h2>
          </div>
        </ScrollReveal>

        {/* Terminal code block */}
        <ScrollReveal delay={200}>
          <div className="max-w-2xl mx-auto mb-12">
            <div className="hc-code-block relative">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1e1e2e]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
                  <span className="text-xs text-[#64748b] ml-2">terminal</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-xs text-[#64748b] hover:text-[#f8fafc] transition-colors px-2 py-1 rounded"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm leading-relaxed p-0 m-0">
                <code className="block font-mono">
                  {/* 每行用 block span，避免 pre/code 内显式换行符文本节点在 SSR 与客户端不一致导致 hydration 失败 */}
                  <span className="block text-[#6b7280]"># 1. Build</span>
                  <span className="block">
                    <span className="text-[#c4b5fd]">$</span>{' '}
                    <span className="text-[#f8fafc]">
                      git clone https://github.com/HighClawHub/highclaw.git && cd highclaw && make build && make install
                    </span>
                  </span>
                  <span className="block h-3" aria-hidden />
                  <span className="block text-[#6b7280]"># 2. Setup</span>
                  <span className="block">
                    <span className="text-[#c4b5fd]">$</span>{' '}
                    <span className="text-[#7dd3fc]">highclaw</span>{' '}
                    <span className="text-[#86efac]">onboard --interactive</span>
                  </span>
                  <span className="block h-3" aria-hidden />
                  <span className="block text-[#6b7280]"># 3. Chat</span>
                  <span className="block">
                    <span className="text-[#c4b5fd]">$</span>{' '}
                    <span className="text-[#7dd3fc]">highclaw</span>{' '}
                    <span className="text-[#86efac]">agent</span>{' '}
                    <span className="text-[#f8fafc]">-m</span>{' '}
                    <span className="text-[#86efac]">&quot;Hello, HighClaw!&quot;</span>
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* Triple CTA */}
        <ScrollReveal delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/download"
              className="hc-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold"
            >
              <IconDownload size={20} />
              Download
            </Link>
            <a
              href="https://github.com/HighClawHub/highclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="hc-btn-ghost inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold"
            >
              <IconBrandGithub size={20} />
              Star on GitHub
            </a>
            <a
              href="https://discord.gg/89C8zWz4H"
              target="_blank"
              rel="noopener noreferrer"
              className="hc-btn-ghost inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold"
            >
              <IconBrandDiscord size={20} />
              Join Discord
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
