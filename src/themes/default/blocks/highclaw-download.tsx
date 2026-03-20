'use client';

import { useEffect, useRef, useState } from 'react';
import { IconDownload, IconExternalLink, IconBrandWindows } from '@tabler/icons-react';
import { SiApple, SiLinux } from 'react-icons/si';
import { Section } from '@/shared/types/blocks/landing';

interface Platform {
  name: string;
  arch: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  filename: string;
  downloadUrl: string;
  detectKey: string[];
}

const platforms: Platform[] = [
  {
    name: 'macOS',
    arch: 'Apple Silicon',
    icon: SiApple,
    filename: 'highclaw-darwin-arm64.tar.gz',
    downloadUrl: '#',
    detectKey: ['Mac', 'arm64', 'ARM64'],
  },
  {
    name: 'macOS',
    arch: 'Intel',
    icon: SiApple,
    filename: 'highclaw-darwin-amd64.tar.gz',
    downloadUrl: '#',
    detectKey: ['Mac', 'Intel', 'x86_64'],
  },
  {
    name: 'Windows',
    arch: 'x64',
    icon: IconBrandWindows,
    filename: 'highclaw-windows-amd64.zip',
    downloadUrl: '#',
    detectKey: ['Win', 'x64', 'AMD64'],
  },
  {
    name: 'Windows',
    arch: 'ARM',
    icon: IconBrandWindows,
    filename: 'highclaw-windows-arm64.zip',
    downloadUrl: '#',
    detectKey: ['Win', 'ARM'],
  },
  {
    name: 'Linux',
    arch: 'x64',
    icon: SiLinux,
    filename: 'highclaw-linux-amd64.tar.gz',
    downloadUrl: '#',
    detectKey: ['Linux', 'x86_64', 'x64'],
  },
  {
    name: 'Linux',
    arch: 'ARM64',
    icon: SiLinux,
    filename: 'highclaw-linux-arm64.tar.gz',
    downloadUrl: '#',
    detectKey: ['Linux', 'aarch64', 'arm64'],
  },
];

function detectPlatform(): number {
  if (typeof navigator === 'undefined') return 0;
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';

  // macOS Apple Silicon
  if (/Mac/.test(platform)) {
    // Heuristic: newer Macs are Apple Silicon
    if (/ARM/.test(ua) || /arm64/.test(ua)) return 0;
    // If running Chrome/Safari on Apple Silicon, userAgent may not say ARM
    // Default to Apple Silicon for newer detection
    return 0;
  }
  // Windows
  if (/Win/.test(platform)) {
    if (/ARM/.test(ua)) return 3;
    return 2;
  }
  // Linux
  if (/Linux/.test(platform)) {
    if (/aarch64|arm64/.test(ua)) return 5;
    return 4;
  }
  return 0;
}

export function HighclawDownload({ section }: { section: Section }) {
  const [detected, setDetected] = useState<number>(0);

  useEffect(() => {
    setDetected(detectPlatform());
  }, []);

  const recommended = platforms[detected];

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
            Download HighClaw
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Single binary, zero runtime dependencies. Available for all major platforms.
          </p>
        </div>

        {/* Auto-detected hero card */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="hc-glass p-8 text-center relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
                Recommended for your system
              </span>
            </div>
            <recommended.icon size={48} className="text-[#f8fafc] mx-auto mb-4 mt-4" />
            <h3 className="text-xl font-semibold text-[#f8fafc] mb-1">
              {recommended.name} ({recommended.arch})
            </h3>
            <p className="text-sm font-mono text-[#64748b] mb-6">{recommended.filename}</p>
            <a
              href={recommended.downloadUrl}
              className="hc-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold"
            >
              <IconDownload size={20} />
              Download v1.0.0
            </a>
            <p className="text-xs text-[#64748b] mt-4">
              Or install from source:{' '}
              <code className="text-[#7dd3fc]">make build && make install</code>
            </p>
          </div>
        </div>

        {/* Multi-platform grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-[#f8fafc] mb-6 text-center">All Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform, idx) => (
              <div
                key={idx}
                className={`hc-glass hc-glass-hover p-5 text-center ${
                  idx === detected ? 'border-[#3b82f6]/30' : ''
                }`}
              >
                <platform.icon size={32} className="text-[#94a3b8] mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-[#f8fafc]">
                  {platform.name} ({platform.arch})
                </h4>
                <p className="text-xs font-mono text-[#64748b] mt-1 mb-4">{platform.filename}</p>
                <a
                  href={platform.downloadUrl}
                  className="hc-btn-ghost inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <IconDownload size={16} />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Version & requirements */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-[#f8fafc] font-mono text-lg font-bold">v1.0.0</p>
          <p className="text-sm text-[#64748b]">
            Go 1.22+ (build from source only) | Single binary, zero dependencies
          </p>
          <a
            href="https://github.com/903174293/highclaw/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#3b82f6] hover:text-[#06b6d4] transition-colors"
          >
            View all releases on GitHub
            <IconExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
