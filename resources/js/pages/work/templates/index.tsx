import { FormEvent, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { FileCog } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function TemplatesIndex() {
    const { templates } = usePage().props as any; const [form, setForm] = useState<any>({ name: '', template_type: 'other', language: 'ar', content: '' });
    const create = (event: FormEvent) => { event.preventDefault(); router.post(route('work.templates.store'), form, { onSuccess: () => setForm({ name: '', template_type: 'other', language: 'ar', content: '' }) }); };
    return <PageTemplate title="قوالب المستندات" description="أساس القوالب القابلة لإعادة الاستخدام مع لغة ونوع ومتغيرات واضحة." url={route('work.templates.index')} actions={[{ label: 'قالب جديد', icon: <FileCog className="h-4 w-4" />, onClick: () => document.getElementById('template-name')?.focus(), variant: 'default' }]}><Head title="قوالب المستندات" /><div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]" dir="rtl"><Card><CardHeader><CardTitle>قالب جديد</CardTitle></CardHeader><CardContent><form className="space-y-3" onSubmit={create}><Input id="template-name" required placeholder="اسم القالب" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input placeholder="نوع القالب" value={form.template_type} onChange={(e) => setForm({ ...form, template_type: e.target.value })} /><select className="h-9 w-full rounded border bg-background px-3 text-sm" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}><option value="ar">العربية</option><option value="en">الإنجليزية</option></select><Textarea placeholder="محتوى القالب" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /><Button type="submit">حفظ القالب</Button></form></CardContent></Card><Card><CardHeader><CardTitle>القوالب المسجلة</CardTitle></CardHeader><CardContent><div className="space-y-3">{(templates?.data || []).map((template: any) => <div key={template.id} className="rounded border p-3"><div className="flex justify-between"><span className="font-medium">{template.name}</span><span className="text-xs text-muted-foreground">{template.language}</span></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{template.content || 'بدون محتوى'}</p></div>)}</div></CardContent></Card></div></PageTemplate>;
}
