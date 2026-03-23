'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Textarea } from '@/shared/components/ui/textarea';
import type { TutorialDocRow } from '@/shared/models/tutorial';

/**
 * 后台教程管理：列表、Markdown 编辑、本地 .md 上传填充正文。
 */
export function AdminTutorialsClient() {
  const [rows, setRows] = useState<TutorialDocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<TutorialDocRow | null>(null);
  /** 是否展开底部编辑区 */
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState({
    locale: 'en',
    slugPath: '',
    title: '',
    description: '',
    contentMd: '',
    sortOrder: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tutorials', { credentials: 'include' });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || '加载失败');
        return;
      }
      setRows(json.data || []);
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setPanelOpen(true);
    setForm({
      locale: 'en',
      slugPath: '',
      title: '',
      description: '',
      contentMd: '# New tutorial\n\n',
      sortOrder: 0,
    });
  };

  const openEdit = (row: TutorialDocRow) => {
    setEditing(row);
    setPanelOpen(true);
    setForm({
      locale: row.locale,
      slugPath: row.slugPath,
      title: row.title,
      description: row.description || '',
      contentMd: row.contentMd,
      sortOrder: row.sortOrder,
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/tutorials/${editing.id}`
        : '/api/admin/tutorials';
      const method = editing ? 'PUT' : 'POST';
      const body = editing
        ? {
            locale: form.locale,
            slugPath: form.slugPath,
            title: form.title,
            description: form.description,
            contentMd: form.contentMd,
            sortOrder: form.sortOrder,
          }
        : { ...form };

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || '保存失败');
        return;
      }
      toast.success('已保存');
      setEditing(null);
      setPanelOpen(false);
      await load();
    } catch {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('确定删除该教程？')) return;
    try {
      const res = await fetch(`/api/admin/tutorials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || '删除失败');
        return;
      }
      toast.success('已删除');
      if (editing?.id === id) {
        setEditing(null);
        setPanelOpen(false);
      }
      await load();
    } catch {
      toast.error('删除失败');
    }
  };

  const onUploadMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setForm((f) => ({ ...f, contentMd: text }));
      setForm((f) => ({
        ...f,
        contentMd: text,
        title: f.title || file.name.replace(/\.(md|mdx|markdown)$/i, ''),
      }));
      toast.success('已读取 Markdown 文件');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tutorials (Markdown)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            发布后前台路径：<Link href="/tutorials" className="underline">/tutorials</Link>
            （左侧目录 + 正文；大桌面端右侧为当前页标题目录）
          </p>
        </div>
        <Button type="button" onClick={openNew}>
          <Plus className="size-4 mr-2" />
          新建
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Locale</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  暂无数据。点击「新建」或执行 db 迁移后添加教程。
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.locale}</TableCell>
                  <TableCell className="font-mono text-xs">{r.slugPath}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.sortOrder}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => openEdit(r)}>
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => remove(r.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {panelOpen && (
        <div className="rounded-lg border p-4 md:p-6 space-y-4 bg-card">
          <h2 className="text-lg font-medium">{editing ? '编辑教程' : '新建教程'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input
                id="locale"
                value={form.locale}
                onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
                placeholder="en / zh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slugPath">路径 slug（如 intro 或 install/macos）</Label>
              <Input
                id="slugPath"
                value={form.slugPath}
                onChange={(e) => setForm((f) => ({ ...f, slugPath: e.target.value }))}
                placeholder="getting-started"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">摘要（可选）</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">排序（数字越小越靠前）</Label>
              <Input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="flex items-end">
              <div>
                <Label className="mb-2 block">上传 .md / .mdx</Label>
                <Button type="button" variant="secondary" asChild>
                  <label className="cursor-pointer">
                    <Upload className="size-4 mr-2 inline" />
                    选择文件
                    <input type="file" accept=".md,.mdx,.markdown,text/markdown" className="hidden" onChange={onUploadMd} />
                  </label>
                </Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contentMd">Markdown 正文</Label>
              <Textarea
                id="contentMd"
                className="min-h-[320px] font-mono text-sm"
                value={form.contentMd}
                onChange={(e) => setForm((f) => ({ ...f, contentMd: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              保存并发布
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setPanelOpen(false);
              }}
            >
              关闭
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
