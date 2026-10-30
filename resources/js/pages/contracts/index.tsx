import { Link, router, useForm } from '@inertiajs/react';
import { Ban, FileCheck2, FileUp, Send } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const statuses: Record<string, string> = { draft: 'مسودة', ready_to_send: 'جاهز للإرسال', sent: 'أُرسل', viewed: 'تم الاطلاع', signed: 'موقع', declined: 'مرفوض', cancelled: 'ملغى' };

export default function ContractsIndex({ contracts, clients = [], matters = [], invoices = [], canCreate = false, canSend = false, canCancel = false }: any) {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialMatterId = searchParams?.get('matter_id') || '';
    const initialClientId = searchParams?.get('client_id') || '';
    const form = useForm({ client_id: initialClientId, matter_id: initialMatterId, invoice_id: '', title: '', file: null as File | null });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.post(route('contracts.store'), { forceFormData: true, onSuccess: () => form.reset() }); };
    const send = (contractId: number) => router.post(route('contracts.send', contractId));
    const cancel = (contractId: number) => router.post(route('contracts.cancel', contractId), { reason: 'تم الإلغاء من إدارة المكتب.' });

    return (
        <PageTemplate title="العقود الإلكترونية" description="رفع العقود وإرسالها للموكل ومتابعة حالات الاطلاع والتوقيع." url={route('contracts.index')}>
            <div dir="rtl" className="grid gap-6 xl:grid-cols-[380px_1fr]">
                {canCreate && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileUp className="h-4 w-4" />
                                رفع عقد
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={submit}>
                                <label className="block space-y-2 text-sm">
                                    العنوان
                                    <Input required value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                                </label>
                                <label className="block space-y-2 text-sm">
                                    الموكل
                                    <select required className="h-10 w-full rounded-md border bg-background px-3" value={form.data.client_id} onChange={(e) => form.setData('client_id', e.target.value)}>
                                        <option value="">اختر الموكل</option>
                                        {clients.map((client: any) => <option key={client.id} value={client.id}>{client.name}</option>)}
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm">
                                    القضية / الملف (اختياري)
                                    <select className="h-10 w-full rounded-md border bg-background px-3" value={form.data.matter_id} onChange={(e) => form.setData('matter_id', e.target.value)}>
                                        <option value="">بدون ربط</option>
                                        {matters.map((matter: any) => <option key={matter.id} value={matter.id}>{matter.matter_number} — {matter.title}</option>)}
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm">
                                    الفاتورة المرتبطة (اختياري)
                                    <select className="h-10 w-full rounded-md border bg-background px-3" value={form.data.invoice_id} onChange={(e) => form.setData('invoice_id', e.target.value)}>
                                        <option value="">بدون ربط</option>
                                        {invoices.map((invoice: any) => <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} — {invoice.status}</option>)}
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm">
                                    ملف العقد
                                    <Input required type="file" accept=".pdf,.doc,.docx" onChange={(e) => form.setData('file', e.target.files?.[0] || null)} />
                                </label>
                                {Object.keys(form.errors).length > 0 && <p className="text-sm text-red-700">{Object.values(form.errors).join(' ')}</p>}
                                <Button disabled={form.processing}><FileUp className="ml-2 h-4 w-4" />حفظ كمسودة</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>سجل العقود</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(contracts?.data || []).map((contract: any) => (
                            <div key={contract.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FileCheck2 className="h-4 w-4 text-emerald-700" />
                                        <strong>{contract.title}</strong>
                                        <Badge variant={contract.status === 'signed' ? 'success' : 'outline'}>{statuses[contract.status] || contract.status}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {contract.contract_number} · {contract.client?.name}
                                        {contract.matter ? <span> · <Link href={route('matters.show', contract.matter.id)} className="underline hover:text-primary font-medium">{contract.matter.matter_number}</Link></span> : ''}
                                        {contract.invoice ? ` · ${contract.invoice.invoice_number}` : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <a href={route('contracts.download', contract.id)}>عرض الملف</a>
                                    </Button>
                                    {canSend && ['draft', 'ready_to_send'].includes(contract.status) && (
                                        <Button size="sm" onClick={() => send(contract.id)}>
                                            <Send className="ml-2 h-4 w-4" />
                                            إرسال للموكل
                                        </Button>
                                    )}
                                    {canCancel && !['signed', 'declined', 'cancelled'].includes(contract.status) && (
                                        <Button size="sm" variant="outline" onClick={() => cancel(contract.id)}>
                                            <Ban className="ml-2 h-4 w-4" />
                                            إلغاء
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {!(contracts?.data || []).length && <p className="py-12 text-center text-sm text-muted-foreground">لا توجد عقود بعد.</p>}
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
