import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const metadata = {
  title: 'Team — HighClaw',
  description:
    'Meet the team behind HighClaw: engineers from Google Brain, Microsoft Azure, Meta, Anthropic, DeepMind, and Cloudflare.',
};

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page: DynamicPage = {
    show_sections: ['team'],
    sections: {
      team: {
        id: 'team',
        block: 'highclaw-team',
        title: 'Our Team',
      },
    },
  };

  const Page = await getThemePage('dynamic-page');
  return <Page locale={locale} page={page} />;
}
