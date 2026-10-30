import { FormEvent, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function ApprovalsIndex() {
    const { approvals, documents = [], approvers = [] } = usePage().props as any;
    const [documentId, setDocumentId] = useState('');
    const [approverId, setApproverId] = useState('');
    const [reason, setReason] = useState('');
    const requestApproval = (event: FormEvent) => {
        event.preventDefault();
        const document = documents.find((item: any) => String(item.id) === String(documentId));
        if (!document || !approverId) return;
        router.post(route('work.approvals.store'), {
            approvable_type: 'document',
            approvable_id: document.id,
            approval_type: 'document_review',
            approver_ids: [approverId],
            reason,
            version_id: document.current_version?.id,
        }, { onSuccess: () => { setDocumentId(''); setApproverId(''); setReason(''); } });
    };
    const statusLabels: Record<string, string> = { pending: 'معلقة', approved: 'معتمدة', rejected: 'مرفوضة' };

    return <PageTemplate title="الموافقات" description="الموافقات المركزية الموجهة إلى المعتمد الحالي مع سجل القرار." url={route('work.approvals.index')}><Head title="الموافقات" /><div className="space-y-6" dir="rtl"><Card><CardHeader><CardTitle>طلب موافقة جديد</CardTitle></CardHeader><CardContent><form className="grid gap-3 md:grid-cols-3" onSubmit={requestApproval}><select aria-label="المستند المطلوب اعتماده" required className="h-9 rounded border bg-background px-3 text-sm" value={documentId} onChange={(e) => setDocumentId(e.target.value)}><option value="">اختر المستند</option>{documents.map((document: any) => <option key={document.id} value={document.id}>{document.document_number} — {document.title || document.name}</option>)}</select><select aria-label="المعتمد" required className="h-9 rounded border bg-background px-3 text-sm" value={approverId} onChange={(e) => setApproverId(e.target.value)}><option value="">اختر المعتمد</option>{approvers.map((user: any) => <option key={user.id} value={user.id}>{user.name}</option>)}</select><Textarea aria-label="سبب الموافقة" placeholder="سبب طلب الموافقة" value={reason} onChange={(e) => setReason(e.target.value)} /><Button type="submit">إرسال طلب الموافقة</Button></form></CardContent></Card><Card><CardHeader><CardTitle>قائمة الموافقات</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b text-right text-muted-foreground"><th className="p-3">النوع</th><th className="p-3">الطالب</th><th className="p-3">المعتمد الحالي</th><th className="p-3">الحالة</th><th className="p-3">الإجراء</th></tr></thead><tbody>{(approvals?.data || []).map((approval: any) => <tr key={approval.id} className="border-b last:border-0"><td className="p-3">{approval.approval_type}</td><td className="p-3">{approval.requester?.name}</td><td className="p-3">{approval.current_approver?.name || '—'}</td><td className="p-3"><Badge variant={approval.status === 'approved' ? 'success' : 'outline'}>{statusLabels[approval.status] || approval.status}</Badge></td><td className="p-3">{approval.status === 'pending' && <span className="flex gap-2"><Button size="sm" onClick={() => router.patch(route('work.approvals.decide', approval.id), { decision: 'approved' })}><CheckCircle2 className="ml-1 h-4 w-4" /> اعتماد</Button><Button size="sm" variant="destructive" onClick={() => router.patch(route('work.approvals.decide', approval.id), { decision: 'rejected' })}><XCircle className="ml-1 h-4 w-4" /> رفض</Button></span>}</td></tr>)}</tbody></table></div></CardContent></Card></div></PageTemplate>;
}
