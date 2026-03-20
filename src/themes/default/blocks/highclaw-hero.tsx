'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconRocket, IconBrandGithub } from '@tabler/icons-react';
import { Section } from '@/shared/types/blocks/landing';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold hc-gradient-text-blue">
      {count}{suffix}
    </span>
  );
}

export function HighclawHero({ section }: { section: Section }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 hc-grid-bg" />

      {/* Decorative glow orbs */}
      <div className="hc-glow-orb w-[600px] h-[600px] bg-[#3b82f6] top-[-200px] left-[-100px] animate-[hc-pulse-glow_3s_ease-in-out_infinite]" />
      <div className="hc-glow-orb w-[400px] h-[400px] bg-[#06b6d4] bottom-[-100px] right-[-50px] animate-[hc-pulse-glow_4s_ease-in-out_infinite_1s]" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-24 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8 opacity-0 animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#3b82f6]/25 blur-[60px] scale-[2]" />
            <img
              src="/highclaw.png"
              alt="HighClaw"
              className="relative w-36 h-36 md:w-48 md:h-48 rounded-3xl"
              style={{ filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 80px rgba(6, 182, 212, 0.2))' }}
            />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 hc-gradient-text animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          High-Performance AI Agent
          <br />
          Infrastructure
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-10 opacity-0 animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards]">
          High performance. Built for speed and reliability. 100% Go. 100% Agnostic.
        </p>

        {/* Key stats strip */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12 opacity-0 animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
          <div className="text-center">
            <AnimatedCounter end={100} suffix="+" />
            <p className="text-sm text-[#94a3b8] mt-1">Agents</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={22} suffix="+" />
            <p className="text-sm text-[#94a3b8] mt-1">AI Providers</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={12} suffix="+" />
            <p className="text-sm text-[#94a3b8] mt-1">Channels</p>
          </div>
          <div className="text-center">
            <span className="text-4xl md:text-5xl font-bold hc-gradient-text-blue">Zero</span>
            <p className="text-sm text-[#94a3b8] mt-1">Dependencies</p>
          </div>
        </div>

        {/* Terminal code block */}
        <div className="max-w-2xl mx-auto mb-10 opacity-0 animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_0.45s_forwards]">
          <div className="hc-code-block text-left">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#1e1e2e]">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
              <span className="text-xs text-[#64748b] ml-2">terminal</span>
            </div>
            <code className="text-sm md:text-base leading-relaxed">
              <span className="text-[#6b7280]"># Build & Install</span>
              {'\n'}
              <span className="text-[#c4b5fd]">$</span>{' '}
              <span className="text-[#f8fafc]">git clone https://github.com/903174293/highclaw.git</span>
              {'\n'}
              <span className="text-[#c4b5fd]">$</span>{' '}
              <span className="text-[#f8fafc]">cd highclaw && make build && make install</span>
              {'\n'}
              <span className="text-[#c4b5fd]">$</span>{' '}
              <span className="text-[#7dd3fc]">highclaw</span>{' '}
              <span className="text-[#86efac]">onboard</span>
            </code>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[hc-fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards]">
          <Link
            href="/download"
            className="hc-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold"
          >
            <IconRocket size={20} />
            Get Started
          </Link>
          <a
            href="https://github.com/903174293/highclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="hc-btn-ghost inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold"
          >
            <IconBrandGithub size={20} />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
