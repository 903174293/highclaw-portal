'use client';

import { useEffect, useRef, useState } from 'react';
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';
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

const teamMembers = [
  {
    name: 'Marcus Chen',
    role: 'Founder & CEO',
    bio: 'Former Senior Researcher at Google Brain. Ph.D. in Computer Science from Carnegie Mellon University. Led the multi-agent architecture design for Google Assistant. Published 12 papers at NeurIPS and ICML.',
    avatarGradient: 'from-[#3b82f6] to-[#8b5cf6]',
    initials: 'MC',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  },
  {
    name: 'Elena Volkov',
    role: 'Chief Technology Officer',
    bio: 'Former Principal Architect at Microsoft Azure AI. M.S. in EECS from MIT. Led the Azure Cognitive Services multi-language team serving 200M+ API calls daily.',
    avatarGradient: 'from-[#06b6d4] to-[#3b82f6]',
    initials: 'EV',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
  },
  {
    name: 'James Nakamura',
    role: 'VP of Engineering',
    bio: 'Former Engineering Director at Meta Infrastructure. M.S. in Computer Science from Stanford University. Managed 200+ engineers building Meta\'s internal AI toolchain.',
    avatarGradient: 'from-[#8b5cf6] to-[#ec4899]',
    initials: 'JN',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Head of Product',
    bio: 'Former Product Lead at Anthropic. Harvard MBA and UC Berkeley CS dual degree. Defined the go-to-market strategy for Claude API.',
    avatarGradient: 'from-[#22c55e] to-[#06b6d4]',
    initials: 'SM',
    avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    name: 'David Park',
    role: 'Lead AI Researcher',
    bio: 'Former Research Scientist at DeepMind. D.Phil. in Machine Learning from University of Oxford. Specializes in agent collaboration systems and emergent behavior.',
    avatarGradient: 'from-[#f59e0b] to-[#ef4444]',
    initials: 'DP',
    avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
  },
  {
    name: 'Aria Santos',
    role: 'Head of Security',
    bio: 'Former Zero Trust Security Engineering Director at Cloudflare. M.S. in Information Security from Georgia Tech. OSCP and CISSP certified.',
    avatarGradient: 'from-[#ef4444] to-[#8b5cf6]',
    initials: 'AS',
    avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
  },
];

export function HighclawTeam({ section }: { section: Section }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
              Meet the Team
            </h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
              World-class engineers and researchers building the future of AI agent infrastructure.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="hc-glass hc-glass-hover p-6 h-full flex flex-col">
                {/* Avatar */}
                <div className="relative w-16 h-16 mb-4 flex-shrink-0">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.avatarGradient} opacity-30 blur-md scale-110`} />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative w-16 h-16 rounded-full object-cover border-2 border-[#1e1e2e]"
                  />
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-semibold text-[#f8fafc]">{member.name}</h3>
                <p className="text-sm font-medium hc-gradient-text-blue mb-3">{member.role}</p>

                {/* Bio */}
                <p className="text-sm text-[#94a3b8] leading-relaxed flex-1">{member.bio}</p>

                {/* Social links */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1e1e2e]">
                  <button className="text-[#64748b] hover:text-[#3b82f6] transition-colors">
                    <IconBrandLinkedin size={18} />
                  </button>
                  <button className="text-[#64748b] hover:text-[#3b82f6] transition-colors">
                    <IconBrandGithub size={18} />
                  </button>
                  <button className="text-[#64748b] hover:text-[#3b82f6] transition-colors">
                    <IconBrandX size={18} />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
