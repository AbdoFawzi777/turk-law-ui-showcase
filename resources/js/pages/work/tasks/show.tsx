import { FormEvent, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Check, ClipboardCheck, MessageSquare, Paperclip, Play, Send, Timer } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const labels: Record<string, string> = { to_do: 'جديدة', in_progress: 'قيد التنفيذ', waiting: 'انتظار', blocked: 'متوقفة', under_review: 'قيد المراجعة', completed: 'مكتملة', cancelled: 'ملغاة' };
const priorityLabels: Record<string, string> = { critical: 'حرجة', high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };
const sourceLabels: Record<string, string> = { manual: 'يدوية', deadline: 'من موعد نهائي', hearing: 'من جلسة', workflow: 'من سير عمل' };

export default function OperationalTaskShow() {
    const { task } = usePage().props as any;
    const [status, setStatus] = useState(task.work_status);
    const [checklistTitle, setChecklistTitle] = useState('');
    const [comment, setComment] = useState('');

    const updateStatus = (event: FormEvent) => {
        event.preventDefault();
        router.patch(route('work.tasks.status', task.id), { work_status: status });
    };
    const addChecklist = (event: FormEvent) => {
        event.preventDefault();
        if (!checklistTitle.trim()) return;
        router.post(route('work.tasks.checklist.store', task.id), { title: checklistTitle }, { onSuccess: () => setChecklistTitle('') });
    };
    const addComment = (event: FormEvent) => {
        event.preventDefault();
        if (!comment.trim()) return;
        router.post(route('work.tasks.comments.store', task.id), { comment_text: comment }, { onSuccess: () => setComment('') });
    };

    return <PageTemplate title={task.title} description={`${task.task_number || task.task_id} — مساحة تنفيذ ومتابعة المهمة`} url={route('work.tasks.show', task.id)} breadcrumbs={[{ title: 'مساحة العمل', href: route('work.tasks.index') }, { title: task.title, href: route('work.tasks.show', task.id) }]}>
        <Head title={task.title} />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3" dir="rtl">
            <div className="flex items-center gap-2"><Link href={route('work.tasks.index')}><Button variant="outline" size="sm"><ArrowRight className="ml-2 h-4 w-4" /> العودة</Button></Link><Badge variant={task.work_status === 'completed' ? 'success' : 'outline'}>{labels[task.work_status] || task.work_status}</Badge></div>
            <div className="flex gap-2"><Link href={route('work.time.index', { task_id: task.id })}><Button variant="outline" size="sm"><Timer className="ml-2 h-4 w-4" /> بدء مؤقت</Button></Link><Link href={route('work.documents.index', { task_id: task.id })}><Button variant="outline" size="sm"><Paperclip className="ml-2 h-4 w-4" /> مستندات</Button></Link></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" dir="rtl">
            <div className="space-y-6">
                <Card><CardHeader><CardTitle>التنفيذ</CardTitle></CardHeader><CardContent className="space-y-4"><p className="whitespace-pre-wrap text-sm leading-7">{task.description || 'لا يوجد وصف.'}</p><div className="grid gap-4 sm:grid-cols-2"><div><span className="text-xs text-muted-foreground">الملف</span><p className="font-medium">{task.matter ? `${task.matter.matter_number} — ${task.matter.title}` : '—'}</p></div><div><span className="text-xs text-muted-foreground">الموعد النهائي</span><p className="font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString('ar-EG') : '—'}</p></div><div><span className="text-xs text-muted-foreground">المسند إليه</span><p className="font-medium">{task.assigned_user?.name || 'غير مسندة'}</p></div><div><span className="text-xs text-muted-foreground">المراجع</span><p className="font-medium">{task.reviewer?.name || 'غير محدد'}</p></div></div><form className="flex flex-wrap items-end gap-2 border-t pt-4" onSubmit={updateStatus}><label className="min-w-[220px] flex-1 space-y-1"><span className="text-xs text-muted-foreground">تغيير الحالة</span><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>{Object.keys(labels).map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select></label><Button type="submit"><Play className="ml-2 h-4 w-4" /> حفظ الحالة</Button></form></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" /> قائمة التحقق</CardTitle></CardHeader><CardContent><div className="space-y-2">{(task.checklist_items || []).map((item: any) => <button type="button" key={item.id} aria-pressed={item.is_completed} aria-label={`${item.is_completed ? 'إلغاء إكمال' : 'إكمال'} ${item.title}`} onClick={() => router.patch(route('work.tasks.checklist.toggle', item.id))} className="flex w-full items-center gap-3 rounded-md border p-3 text-right hover:bg-muted/40"><span className={`flex h-5 w-5 items-center justify-center rounded border ${item.is_completed ? 'border-primary bg-primary text-primary-foreground' : ''}`}>{item.is_completed && <Check className="h-3 w-3" />}</span><span className={item.is_completed ? 'text-muted-foreground line-through' : ''}>{item.title}</span>{item.is_required && <Badge variant="outline" className="mr-auto">إلزامية</Badge>}</button>)}</div><form className="mt-4 flex gap-2" onSubmit={addChecklist}><Input aria-label="عنصر قائمة التحقق" placeholder="إضافة عنصر" value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} /><Button type="submit" size="icon" aria-label="إضافة"><Check className="h-4 w-4" /></Button></form></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> التعليقات الداخلية</CardTitle></CardHeader><CardContent><div className="space-y-3">{(task.comments || []).map((entry: any) => <div key={entry.id} className="rounded-md border p-3"><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{entry.creator?.name || 'مستخدم'}</span><span>{entry.created_at ? new Date(entry.created_at).toLocaleString('ar-EG') : ''}</span></div><p className="whitespace-pre-wrap text-sm">{entry.comment_text}</p></div>)}</div><form className="mt-4 space-y-2" onSubmit={addComment}><Textarea aria-label="تعليق داخلي" placeholder="أضف تحديثًا للفريق" value={comment} onChange={(e) => setComment(e.target.value)} /><div className="flex justify-end"><Button type="submit"><Send className="ml-2 h-4 w-4" /> إضافة تعليق</Button></div></form></CardContent></Card>
            </div>
            <div className="space-y-6"><Card><CardHeader><CardTitle>الملخص</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">المصدر</span><span>{sourceLabels[task.source || 'manual'] || task.source || 'يدوية'}</span></div><div className="flex justify-between"><span className="text-muted-foreground">الأولوية</span><Badge variant="secondary">{priorityLabels[task.priority] || task.priority}</Badge></div><div className="flex justify-between"><span className="text-muted-foreground">الساعات المقدرة</span><span>{task.estimated_hours || '—'}</span></div><div className="flex justify-between"><span className="text-muted-foreground">الساعات المسجلة</span><span>{(task.time_entries || []).reduce((sum: number, entry: any) => sum + Number(entry.hours || 0), 0).toFixed(2)}</span></div></CardContent></Card><Card><CardHeader><CardTitle>النشاط</CardTitle></CardHeader><CardContent className="space-y-3">{(task.audit_logs || []).slice(0, 10).map((entry: any) => <div key={entry.id} className="border-r-2 border-muted pr-3 text-sm"><p>{entry.action}</p><p className="text-xs text-muted-foreground">{entry.created_at ? new Date(entry.created_at).toLocaleString('ar-EG') : ''}</p></div>)}</CardContent></Card></div>
        </div>
    </PageTemplate>;
}
