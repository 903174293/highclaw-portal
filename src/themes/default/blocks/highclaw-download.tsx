'use client';

import { useEffect, useState } from 'react';
import { IconDownload, IconExternalLink, IconBrandWindows } from '@tabler/icons-react';
import { SiApple, SiLinux } from 'react-icons/si';

import { useSession } from '@/core/auth/client';
import { Section } from '@/shared/types/blocks/landing';
import { useAppContext } from '@/shared/contexts/app';

type PlatformKey =
  | 'darwin-arm64'
  | 'darwin-amd64'
  | 'windows-amd64'
  | 'windows-arm64'
  | 'linux-amd64'
  | 'linux-arm64';

interface Platform {
  name: string;
  arch: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  key: PlatformKey;
  detectKey: string[];
}

const platforms: Platform[] = [
  {
    name: 'macOS',
    arch: 'Apple Silicon',
    icon: SiApple,
    key: 'darwin-arm64',
    detectKey: ['Mac', 'arm64', 'ARM64'],
  },
  {
    name: 'macOS',
    arch: 'Intel',
    icon: SiApple,
    key: 'darwin-amd64',
    detectKey: ['Mac', 'Intel', 'x86_64'],
  },
  {
    name: 'Windows',
    arch: 'x64',
    icon: IconBrandWindows,
    key: 'windows-amd64',
    detectKey: ['Win', 'x64', 'AMD64'],
  },
  {
    name: 'Windows',
    arch: 'ARM',
    icon: IconBrandWindows,
    key: 'windows-arm64',
    detectKey: ['Win', 'ARM'],
  },
  {
    name: 'Linux',
    arch: 'x64',
    icon: SiLinux,
    key: 'linux-amd64',
    detectKey: ['Linux', 'x86_64', 'x64'],
  },
  {
    name: 'Linux',
    arch: 'ARM64',
    icon: SiLinux,
    key: 'linux-arm64',
    detectKey: ['Linux', 'aarch64', 'arm64'],
  },
];

/** 根据 UA 推荐平台索引 */
function detectPlatform(): number {
  if (typeof navigator === 'undefined') return 0;
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';

  if (/Mac/.test(platform)) {
    if (/ARM/.test(ua) || /arm64/.test(ua)) return 0;
    return 1;
  }
  if (/Win/.test(platform)) {
    if (/ARM/.test(ua)) return 3;
    return 2;
  }
  if (/Linux/.test(platform)) {
    if (/aarch64|arm64/.test(ua)) return 5;
    return 4;
  }
  return 0;
}

/**
 * 从实际文件名中提取版本信息（commit hash 或语义版本号）。
 * 例如 "highclaw-dc6ef1a-dirty-darwin-arm64.tar.gz" → "dc6ef1a-dirty"
 * 例如 "highclaw-v1.2.3-darwin-arm64.tar.gz" → "v1.2.3"
 */
function extractVersion(filename: string | null): string {
  if (!filename) return '';
  const base = filename.split('/').pop() || '';
  const match = base.match(/^highclaw-(.+?)-(darwin|linux|windows)/);
  return match?.[1] || '';
}

export function HighclawDownload({ section: _section }: { section: Section }) {
  const [detected, setDetected] = useState<number>(0);
  const { data: session, isPending } = useSession();
  const { setIsShowSignModal } = useAppContext();
  const loggedIn = !!session?.user;

  /** 各平台实际文件的相对路径映射 */
  const [fileMap, setFileMap] = useState<Record<PlatformKey, string | null>>(
    {} as Record<PlatformKey, string | null>
  );

  const openSignModal = () => setIsShowSignModal(true);

  useEffect(() => {
    setDetected(detectPlatform());
    fetch('/api/downloads/list')
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) setFileMap(json.data);
      })
      .catch(() => {});
  }, []);

  const recommended = platforms[detected];
  const MainIcon = recommended.icon;
  const recommendedFile = fileMap[recommended.key];
  const version = extractVersion(recommendedFile) || 'latest';

  /** 下载链接：用 platformKey 作为参数，服务端自动匹配文件 */
  const downloadHref = (key: PlatformKey) =>
    `/api/downloads/${encodeURIComponent(key)}`;

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 hc-gradient-text">
            Download HighClaw
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Single binary, zero runtime dependencies. Sign in to download official builds.
          </p>
        </div>

        {/* 推荐平台卡片 */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="hc-glass p-8 text-center relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
                Recommended for your system
              </span>
            </div>
            <MainIcon size={48} className="text-[#f8fafc] mx-auto mb-4 mt-4" />
            <h3 className="text-xl font-semibold text-[#f8fafc] mb-1">
              {recommended.name} ({recommended.arch})
            </h3>
            <p className="text-sm font-mono text-[#64748b] mb-1">
              {recommendedFile?.split('/').pop() || `highclaw-${recommended.key}`}
            </p>
            {version && (
              <p className="text-xs font-mono text-[#3b82f6] mb-5">{version}</p>
            )}
            {loggedIn ? (
              recommendedFile ? (
                <a
                  href={downloadHref(recommended.key)}
                  className="hc-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold"
                >
                  <IconDownload size={20} />
                  Download
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base text-[#64748b]">
                  Not available yet
                </span>
              )
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={openSignModal}
                className="hc-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold"
              >
                <IconDownload size={20} />
                Download
              </button>
            )}
            <p className="text-xs text-[#64748b] mt-4">
              Or install from source:{' '}
              <code className="text-[#7dd3fc]">make build && make install</code>
            </p>
          </div>
        </div>

        {/* 全平台列表 */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-[#f8fafc] mb-6 text-center">All Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform, idx) => {
              const PIcon = platform.icon;
              const file = fileMap[platform.key];
              const available = !!file;
              return (
                <div
                  key={platform.key}
                  className={`hc-glass hc-glass-hover p-5 text-center ${
                    idx === detected ? 'border-[#3b82f6]/30' : ''
                  }`}
                >
                  <PIcon size={32} className="text-[#94a3b8] mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-[#f8fafc]">
                    {platform.name} ({platform.arch})
                  </h4>
                  <p className="text-xs font-mono text-[#64748b] mt-1 mb-4 truncate" title={file || ''}>
                    {file?.split('/').pop() || '—'}
                  </p>
                  {loggedIn ? (
                    available ? (
                      <a
                        href={downloadHref(platform.key)}
                        className="hc-btn-ghost inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        <IconDownload size={16} />
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-[#475569]">Not available</span>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={openSignModal}
                      className="hc-btn-ghost inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <IconDownload size={16} />
                      Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12 space-y-3">
          {version && (
            <p className="text-[#f8fafc] font-mono text-lg font-bold">{version}</p>
          )}
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
