import { FormEvent, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarClock, CheckCircle2, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const statusLabels: Record<string, string> = {
    to_do: 'جديدة', in_progress: 'قيد التنفيذ', waiting: 'انتظار', blocked: 'متوقفة',
    under_review: 'قيد المراجعة', completed: 'مكتملة', cancelled: 'ملغاة',
};
const priorityLabels: Record<string, string> = { critical: 'حرجة', high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };

export default function OperationalTasksIndex() {
    const { tasks, statuses = [], users = [], matters = [], filters = {} } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [assignee, setAssignee] = useState(filters.assignee || '');
    const [overdue, setOverdue] = useState(Boolean(filters.overdue));
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<any>({ title: '', description: '', matter_id: '', priority: 'medium', due_date: '', assigned_to: '' });

    const applyFilters = (event?: FormEvent) => {
        event?.preventDefault();
        router.get(route('work.tasks.index'), {
            search: search || undefined, status: status || undefined, assignee: assignee || undefined,
            overdue: overdue ? 1 : undefined, page: 1,
        }, { preserveState: true, preserveScroll: true });
    };

    const createTask = (event: FormEvent) => {
        event.preventDefault();
        router.post(route('work.tasks.store'), {
            ...form,
            matter_id: form.matter_id || undefined,
            assigned_to: form.assigned_to || undefined,
        }, { onSuccess: () => setCreating(false) });
    };

    return (
        <PageTemplate
            title="مساحة العمل القانونية"
            description="قائمة تشغيلية موحدة للمهام اليومية المرتبطة بالملفات والمواعيد والجلسات."
            url={route('work.tasks.index')}
            actions={[{ label: creating ? 'إغلاق' : 'مهمة جديدة', icon: creating ? undefined : <Plus className="h-4 w-4" />, onClick: () => setCreating(!creating), variant: 'default' }]}
        >
            <Head title="مساحة العمل القانونية" />

            {creating && (
                <Card className="mb-6" dir="rtl">
                    <CardHeader><CardTitle>إنشاء مهمة تشغيلية</CardTitle></CardHeader>
                    <CardContent>
                        <form className="grid gap-4 md:grid-cols-2" onSubmit={createTask}>
                            <label className="space-y-1 md:col-span-2"><span className="text-sm font-medium">العنوان</span><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                            <label className="space-y-1 md:col-span-2"><span className="text-sm font-medium">الوصف</span><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                            <label className="space-y-1"><span className="text-sm font-medium">الملف</span><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.matter_id} onChange={(e) => setForm({ ...form, matter_id: e.target.value })}><option value="">بدون ملف</option>{matters.map((matter: any) => <option key={matter.id} value={matter.id}>{matter.matter_number} — {matter.title}</option>)}</select></label>
                            <label className="space-y-1"><span className="text-sm font-medium">المسند إليه</span><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}><option value="">غير مسندة</option>{users.map((user: any) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
                            <label className="space-y-1"><span className="text-sm font-medium">الأولوية</span><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="critical">حرجة</option><option value="high">عالية</option><option value="medium">متوسطة</option><option value="low">منخفضة</option></select></label>
                            <label className="space-y-1"><span className="text-sm font-medium">تاريخ الاستحقاق</span><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label>
                            <div className="flex items-end gap-2 md:col-span-2"><Button type="submit">حفظ المهمة</Button><Button type="button" variant="outline" onClick={() => setCreating(false)}>إلغاء</Button></div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card dir="rtl">
                <CardHeader className="gap-4">
                    <div className="flex items-center justify-between gap-3"><CardTitle>المهام</CardTitle><span className="text-sm text-muted-foreground">{tasks?.total ?? 0} سجل</span></div>
                    <form className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_170px_180px_auto_auto]" onSubmit={applyFilters}>
                        <label className="relative"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="بحث في المهام" className="pr-9" placeholder="بحث بالرقم أو العنوان أو الملف" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
                        <select aria-label="الحالة" className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">كل الحالات</option>{statuses.map((value: string) => <option key={value} value={value}>{statusLabels[value] || value}</option>)}</select>
                        <select aria-label="تصفية المسند إليه" className="h-9 rounded-md border bg-background px-3 text-sm" value={assignee} onChange={(e) => setAssignee(e.target.value)}><option value="">كل المسند إليهم</option>{users.map((user: any) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
                        <label className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm"><input type="checkbox" checked={overdue} onChange={(e) => setOverdue(e.target.checked)} /> متأخرة</label>
                        <Button type="submit" variant="outline"><SlidersHorizontal className="ml-2 h-4 w-4" /> تطبيق</Button>
                    </form>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[780px] text-sm">
                            <thead><tr className="border-b text-right text-muted-foreground"><th className="p-3">المهمة</th><th className="p-3">الملف</th><th className="p-3">المسند إليه</th><th className="p-3">الاستحقاق</th><th className="p-3">الحالة</th><th className="p-3">الأولوية</th></tr></thead>
                            <tbody>{(tasks?.data || []).map((task: any) => {
                                const overdueTask = task.due_date && !['completed', 'cancelled'].includes(task.work_status) && new Date(task.due_date) < new Date();
                                return <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                                    <td className="p-3"><Link className="font-medium text-primary hover:underline" href={route('work.tasks.show', task.id)}>{task.task_number || task.task_id} — {task.title}</Link><div className="text-xs text-muted-foreground">{task.source === 'deadline' ? 'من موعد نهائي' : task.source === 'hearing' ? 'من جلسة' : task.source === 'workflow' ? 'من سير عمل' : 'يدوية'}</div></td>
                                    <td className="p-3">{task.matter ? <span>{task.matter.matter_number}<br /><span className="text-xs text-muted-foreground">{task.matter.title}</span></span> : '—'}</td>
                                    <td className="p-3">{task.assigned_user?.name || 'غير مسندة'}</td>
                                    <td className={`p-3 ${overdueTask ? 'font-semibold text-destructive' : ''}`}><span className="inline-flex items-center gap-1"><CalendarClock className="h-4 w-4" />{task.due_date ? new Date(task.due_date).toLocaleDateString('ar-EG') : '—'}</span></td>
                                    <td className="p-3"><Badge variant={task.work_status === 'completed' ? 'success' : task.work_status === 'cancelled' ? 'destructive' : 'outline'}>{statusLabels[task.work_status] || task.work_status}</Badge></td>
                                    <td className="p-3"><Badge variant={task.priority === 'critical' ? 'destructive' : 'secondary'}>{priorityLabels[task.priority] || task.priority}</Badge></td>
                                </tr>;
                            })}</tbody>
                        </table>
                        {(!tasks?.data || tasks.data.length === 0) && <div className="py-12 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 h-8 w-8" />لا توجد مهام مطابقة.</div>}
                    </div>
                    {tasks?.links && <div className="mt-4 flex flex-wrap gap-2">{tasks.links.map((link: any, index: number) => <Link key={index} href={link.url || '#'} preserveScroll className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}
                </CardContent>
            </Card>
        </PageTemplate>
    );
}
