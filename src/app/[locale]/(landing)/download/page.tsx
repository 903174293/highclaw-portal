import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const metadata = {
  title: 'Download HighClaw — macOS, Windows, Linux',
  description:
    'Download HighClaw for your platform. Single binary, zero runtime dependencies. Available for macOS (Apple Silicon & Intel), Windows, and Linux.',
};

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page: DynamicPage = {
    show_sections: ['download'],
    sections: {
      download: {
        id: 'download',
        block: 'highclaw-download',
        title: 'Download HighClaw',
      },
    },
  };

  const Page = await getThemePage('dynamic-page');
  return <Page locale={locale} page={page} />;
}
