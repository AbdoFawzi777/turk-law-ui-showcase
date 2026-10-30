import { FormEvent, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { GitBranch, Play } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function WorkflowsIndex() {
    const { workflows } = usePage().props as any;
    const [name, setName] = useState('');
    const create = (event: FormEvent) => { event.preventDefault(); router.post(route('work.workflows.store'), { name, steps: [{ step_order: 1, name: 'تنفيذ المهمة', step_type: 'create_task', configuration: { title: 'مهمة من سير العمل' } }] }, { onSuccess: () => setName('') }); };
    return <PageTemplate title="سير العمل" description="قوالب تنفيذ حتمية قابلة للتدقيق للمهام والمواعيد والموافقات." url={route('work.workflows.index')}><Head title="سير العمل" /><div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]" dir="rtl"><Card><CardHeader><CardTitle>سير عمل جديد</CardTitle></CardHeader><CardContent><form className="flex gap-2" onSubmit={create}><Input aria-label="اسم القالب" required placeholder="اسم القالب" value={name} onChange={(e) => setName(e.target.value)} /><Button type="submit"><GitBranch className="ml-2 h-4 w-4" /> حفظ</Button></form></CardContent></Card><Card><CardHeader><CardTitle>القوالب</CardTitle></CardHeader><CardContent><div className="space-y-3">{(workflows?.data || []).map((workflow: any) => <div key={workflow.id} className="rounded border p-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><span className="font-medium">{workflow.name}</span><span className="mr-3 text-xs text-muted-foreground">{workflow.steps?.length || 0} خطوات</span></div><Button size="sm" variant="outline" onClick={() => router.post(route('work.workflows.run', workflow.id))}><Play className="ml-1 h-4 w-4" /> تشغيل</Button></div><p className="mt-2 text-xs text-muted-foreground">{workflow.status === 'published' ? 'منشور' : workflow.status} — الإصدار {workflow.version}</p></div>)}</div>{(!workflows?.data || workflows.data.length === 0) && <p className="py-8 text-center text-sm text-muted-foreground">لا توجد قوالب مسجلة.</p>}</CardContent></Card></div></PageTemplate>;
}
