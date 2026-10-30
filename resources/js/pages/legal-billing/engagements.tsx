import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function LegalEngagements() {
  const { engagements, clients } = usePage().props as any;
  const [form, setForm] = useState({ client_id: '', title: '', fee_model: 'hourly', currency_code: 'SAR', tax_rate: '0', start_date: '', end_date: '', scope_of_work: '', exclusions: '', billing_notes: '' });
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => router.post(route('legal-billing.engagements.store'), form, { onSuccess: () => setForm({ ...form, title: '', scope_of_work: '' }) });
  return (
    <PageTemplate title="الارتباطات القانونية" description="نطاق العمل ونموذج الأتعاب وشروط الفوترة لكل ملف" url={route('legal-billing.engagements')} actions={[{ label: 'ارتباط جديد', icon: <Plus className="h-4 w-4" />, onClick: () => document.getElementById('new-engagement')?.scrollIntoView({ behavior: 'smooth' }) }]}>
      <div className="space-y-6" dir="rtl">
        <Card><CardHeader><CardTitle>الارتباطات الحالية</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-2">{(engagements?.data || []).map((item: any) => <div key={item.id} className="rounded-lg border p-4"><div className="flex justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.engagement_number} · {item.client?.name}</p></div><span className="rounded-full bg-muted px-2 py-1 text-xs">{item.status}</span></div><div className="mt-3 flex justify-between text-sm text-muted-foreground"><span>النموذج: {item.fee_model}</span><span>ضريبة: {item.tax_rate}%</span></div></div>)}{!(engagements?.data || []).length && <p className="col-span-full py-8 text-center text-sm text-muted-foreground">لم تُسجل ارتباطات بعد.</p>}</div></CardContent></Card>
        <Card id="new-engagement"><CardHeader><CardTitle>إضافة ارتباط قانوني</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-sm">العميل<select className="h-9 w-full rounded-md border bg-background px-3" value={form.client_id} onChange={(e) => update('client_id', e.target.value)}><option value="">اختر العميل</option>{clients?.map((client: any) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
          <label className="space-y-1 text-sm sm:col-span-2">عنوان الارتباط<Input value={form.title} onChange={(e) => update('title', e.target.value)} /></label>
          <label className="space-y-1 text-sm">نموذج الأتعاب<select className="h-9 w-full rounded-md border bg-background px-3" value={form.fee_model} onChange={(e) => update('fee_model', e.target.value)}><option value="hourly">بالساعة</option><option value="fixed">مقطوعة</option><option value="retainer">اشتراك ملف</option><option value="contingency">نسبة نجاح</option></select></label>
          <label className="space-y-1 text-sm">العملة<Input maxLength={3} value={form.currency_code} onChange={(e) => update('currency_code', e.target.value.toUpperCase())} /></label>
          <label className="space-y-1 text-sm">الضريبة %<Input type="number" min="0" max="100" value={form.tax_rate} onChange={(e) => update('tax_rate', e.target.value)} /></label>
          <label className="space-y-1 text-sm">البداية<Input type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} /></label>
          <label className="space-y-1 text-sm">النهاية<Input type="date" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} /></label>
          <label className="space-y-1 text-sm sm:col-span-2">نطاق العمل<Input value={form.scope_of_work} onChange={(e) => update('scope_of_work', e.target.value)} /></label>
          <label className="space-y-1 text-sm sm:col-span-2">الاستثناءات<Input value={form.exclusions} onChange={(e) => update('exclusions', e.target.value)} /></label>
          <div className="flex items-end lg:col-span-4"><Button className="w-full sm:w-auto" disabled={!form.client_id || !form.title} onClick={save}>حفظ الارتباط</Button></div>
        </CardContent></Card>
      </div>
    </PageTemplate>
  );
}
