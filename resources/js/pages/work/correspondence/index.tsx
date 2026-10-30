import { FormEvent, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Archive, MailPlus, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CorrespondenceIndex() {
    const { correspondences, matters = [], filters = {} } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<any>({
        direction: 'incoming',
        correspondence_date: new Date().toISOString().slice(0, 10),
        matter_id: '',
        subject: '',
        channel: 'email',
        confidentiality: 'internal',
        delivery_status: 'draft',
    });
    const deliveryStatusLabels: Record<string, string> = {
        draft: 'مسودة',
        sent: 'مرسلة',
        delivered: 'تم التسليم',
        archived: 'مؤرشفة',
    };

    const filter = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('work.correspondence.index'), { search: search || undefined }, { preserveState: true, preserveScroll: true });
    };

    const create = (event: FormEvent) => {
        event.preventDefault();
        router.post(route('work.correspondence.store'), { ...form, matter_id: form.matter_id || undefined }, { onSuccess: () => setCreating(false) });
    };

    return (
        <PageTemplate
            title="سجل المراسلات"
            description="تسجيل الوارد والصادر وربطه بالملف والمستند مع حالة التسليم."
            url={route('work.correspondence.index')}
            actions={[{ label: creating ? 'إغلاق' : 'تسجيل مراسلة', icon: creating ? undefined : <MailPlus className="h-4 w-4" />, onClick: () => setCreating(!creating), variant: 'default' }]}
        >
            <Head title="سجل المراسلات" />

            {creating && (
                <Card className="mb-6" dir="rtl">
                    <CardHeader><CardTitle>تسجيل مراسلة</CardTitle></CardHeader>
                    <CardContent>
                        <form className="grid gap-4 md:grid-cols-2" onSubmit={create}>
                            <label className="space-y-1"><span className="text-sm">الاتجاه</span><select className="h-9 w-full rounded border bg-background px-3 text-sm" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}><option value="incoming">وارد</option><option value="outgoing">صادر</option></select></label>
                            <label className="space-y-1"><span className="text-sm">التاريخ</span><Input type="date" required value={form.correspondence_date} onChange={(e) => setForm({ ...form, correspondence_date: e.target.value })} /></label>
                            <label className="space-y-1 md:col-span-2"><span className="text-sm">الموضوع</span><Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
                            <label className="space-y-1"><span className="text-sm">الملف</span><select className="h-9 w-full rounded border bg-background px-3 text-sm" value={form.matter_id} onChange={(e) => setForm({ ...form, matter_id: e.target.value })}><option value="">بدون ملف</option>{matters.map((matter: any) => <option key={matter.id} value={matter.id}>{matter.matter_number} — {matter.title}</option>)}</select></label>
                            <div className="flex items-end"><Button type="submit">حفظ السجل</Button></div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card dir="rtl">
                <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle>المراسلات</CardTitle>
                        <form className="flex gap-2" onSubmit={filter}>
                            <div className="relative"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="بحث في المراسلات" className="pr-9" placeholder="بحث بالمرجع أو الموضوع" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                            <Button type="submit" variant="outline">بحث</Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[780px] text-sm">
                            <thead><tr className="border-b text-right text-muted-foreground"><th className="p-3">المرجع</th><th className="p-3">الاتجاه</th><th className="p-3">الموضوع</th><th className="p-3">التاريخ</th><th className="p-3">الحالة</th><th className="p-3">إجراء</th></tr></thead>
                            <tbody>
                                {(correspondences?.data || []).map((entry: any) => (
                                    <tr key={entry.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium">{entry.reference_number}</td>
                                        <td className="p-3">{entry.direction === 'incoming' ? 'وارد' : 'صادر'}</td>
                                        <td className="p-3">{entry.subject}</td>
                                        <td className="p-3">{entry.correspondence_date ? new Date(entry.correspondence_date).toLocaleDateString('ar-EG') : '—'}</td>
                                        <td className="p-3">{deliveryStatusLabels[entry.delivery_status] || entry.delivery_status}</td>
                                        <td className="p-3">
                                            {entry.delivery_status !== 'archived' && <Button size="sm" variant="outline" aria-label={`أرشفة ${entry.reference_number}`} onClick={() => router.patch(route('work.correspondence.archive', entry.id))}><Archive className="ml-1 h-4 w-4" /> أرشفة</Button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </PageTemplate>
    );
}
