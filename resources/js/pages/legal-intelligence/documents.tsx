import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import { FileScan, PencilLine, RefreshCw } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const labels: Record<string, string> = { not_processed: 'غير معالج', queued: 'في الانتظار', processing: 'قيد المعالجة', completed: 'مكتمل', failed: 'تعذر الاستخراج' };
export default function DocumentIntelligence({ documents }: any) {
    const [editing, setEditing] = useState<any>(null); const [text, setText] = useState('');
    const save = (event: FormEvent) => { event.preventDefault(); router.put(route('legal-intelligence.documents.update', editing.id), { extracted_text: text }, { onSuccess: () => { setEditing(null); setText(''); } }); };
    return <PageTemplate title="ذكاء المستندات" description="مراجعة النصوص المستخرجة وتجهيزها للبحث والاسترجاع القانوني الآمن." url={route('legal-intelligence.documents')}>
        <div dir="rtl" className="space-y-5"><div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">محرك OCR الخارجي غير مفعّل حاليًا. يمكنك وضع المستند في قائمة الانتظار أو إدخال نص مستخرج ومراجع يدويًا دون ادعاء تنفيذ معالجة آلية.</div>
        {editing && <Card><CardHeader><CardTitle>إدخال النص المراجع — {editing.title}</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={save}><Textarea required rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="ألصق النص المستخرج بعد مراجعته…" /><div className="flex gap-2"><Button>حفظ واعتماد النص</Button><Button type="button" variant="outline" onClick={() => setEditing(null)}>إلغاء</Button></div></form></CardContent></Card>}
        <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b bg-muted/30 text-right"><th className="p-4">المستند</th><th className="p-4">الرقم</th><th className="p-4">الحالة</th><th className="p-4">المصدر</th><th className="p-4">الإجراءات</th></tr></thead><tbody>{documents?.data?.map((document: any) => <tr key={document.id} className="border-b"><td className="p-4 font-medium">{document.title}</td><td className="p-4">{document.number || '—'}</td><td className="p-4"><Badge variant={document.status === 'completed' ? 'success' : 'outline'}>{labels[document.status] || document.status}</Badge></td><td className="p-4">{document.provider === 'human-reviewed-import' ? 'إدخال بشري مراجع' : document.provider || '—'}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(document); setText(''); }}><PencilLine className="ml-1 h-4 w-4" />إدخال نص</Button><Button size="sm" variant="ghost" onClick={() => router.post(route('legal-intelligence.documents.queue', document.id))}><RefreshCw className="ml-1 h-4 w-4" />إضافة للطابور</Button></div></td></tr>)}</tbody></table></div>{!documents?.data?.length && <div className="py-14 text-center text-muted-foreground"><FileScan className="mx-auto mb-3 h-9 w-9" />لا توجد مستندات متاحة للمعالجة.</div>}</CardContent></Card></div>
    </PageTemplate>;
}
