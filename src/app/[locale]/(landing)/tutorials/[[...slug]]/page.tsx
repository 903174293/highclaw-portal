import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/core/i18n/navigation';
import { getTutorialByPath, listTutorialDocs } from '@/shared/models/tutorial';

import { TutorialArticle } from '../tutorial-article';

export const revalidate = 60;

/**
 * 动态教程页：slug 为 slugPath 以 / 分段。
 */
export default async function TutorialDynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const path = slug?.length ? slug.map((s) => decodeURIComponent(s)).join('/') : '';

  if (!path) {
    const list = await listTutorialDocs(locale);
    if (list[0]) {
      const hrefPath = list[0].slugPath
        .split('/')
        .map((s) => encodeURIComponent(s))
        .join('/');
      redirect({ href: `/tutorials/${hrefPath}`, locale });
    }
    return (
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-fd-foreground mb-2">Tutorials</h1>
        <p className="text-fd-muted-foreground text-sm leading-relaxed">
          No tutorials published yet. Add Markdown documents in Admin → Tutorials.
        </p>
      </div>
    );
  }

  const doc = await getTutorialByPath(locale, path);
  if (!doc) {
    notFound();
  }

  return <TutorialArticle doc={doc} />;
}
