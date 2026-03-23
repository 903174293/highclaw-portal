import { setRequestLocale } from 'next-intl/server';

import { AdminTutorialsClient } from './admin-tutorials-client';

export const metadata = {
  title: 'Tutorials — Admin',
};

/**
 * 教程 Markdown 管理：列表与编辑发布。
 */
export default async function AdminTutorialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminTutorialsClient />;
}
