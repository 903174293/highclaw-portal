import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const metadata = {
  title: 'Contact Us — HighClaw',
  description:
    'Get in touch with the HighClaw team. General inquiries, partnerships, bug reports, and enterprise support.',
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page: DynamicPage = {
    show_sections: ['contact'],
    sections: {
      contact: {
        id: 'contact',
        block: 'highclaw-contact',
        title: 'Contact Us',
      },
    },
  };

  const Page = await getThemePage('dynamic-page');
  return <Page locale={locale} page={page} />;
}
