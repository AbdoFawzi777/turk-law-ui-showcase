import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';
import { RefreshCw, ReceiptText } from 'lucide-react';
import { useState } from 'react';

const money = (value: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value || 0));

export default function LegalBillingQueue() {
  const { queue, clients, filters = {} } = usePage().props as any;
  const rows = queue?.data || [];
  const [selected, setSelected] = useState<number[]>([]);
  const [form, setForm] = useState({ invoice_date: new Date().toISOString().slice(0, 10), due_date: '', discount_type: 'amount', discount_value: '0', tax_rate: '', notes: '' });
  const toggle = (id: number) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const refresh = () => router.post(route('legal-billing.queue.refresh'), {});
  const createInvoice = () => router.post(route('legal-billing.invoices.from-queue'), { ...form, queue_ids: selected }, { onSuccess: () => setSelected([]) });

  return (
    <PageTemplate title="طابور الفوترة" description="مصادر العمل المعتمدة التي لم تُدرج في فاتورة بعد" url={route('legal-billing.queue')} actions={[{ label: 'تحديث الطابور', icon: <RefreshCw className="h-4 w-4" />, onClick: refresh }]}>
      <div className="space-y-6" dir="rtl">
        <Card>
          <CardHeader><CardTitle>العناصر الجاهزة للفوترة</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[720px] text-sm"><thead className="bg-muted/60"><tr><th className="p-3 text-right"><input aria-label="تحديد الكل" type="checkbox" checked={rows.length > 0 && selected.length === rows.length} onChange={() => setSelected(selected.length === rows.length ? [] : rows.map((row: any) => row.id))} /></th><th className="p-3 text-right">العميل</th><th className="p-3 text-right">الوصف</th><th className="p-3 text-right">التاريخ</th><th className="p-3 text-right">المصدر</th><th className="p-3 text-left">الإجمالي</th></tr></thead>
                <tbody>{rows.map((row: any) => <tr key={row.id} className="border-t"><td className="p-3"><input aria-label={`تحديد ${row.description}`} type="checkbox" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} /></td><td className="p-3 font-medium">{row.client?.name}</td><td className="p-3">{row.description}</td><td className="p-3">{row.service_date || '—'}</td><td className="p-3 text-muted-foreground">{row.source_type === 'time_entry' ? 'وقت' : 'مصروف'}</td><td className="p-3 text-left font-semibold">{money(row.total_amount)}</td></tr>)}
                {!rows.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">لا توجد عناصر جاهزة. حدّث الطابور بعد اعتماد الوقت أو المصروفات.</td></tr>}</tbody></table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardHeader><CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5" /> إنشاء فاتورة من المحدد ({selected.length})</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-sm">تاريخ الفاتورة<Input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} /></label>
            <label className="space-y-1 text-sm">تاريخ الاستحقاق<Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label>
            <label className="space-y-1 text-sm">نوع الخصم<select className="h-9 w-full rounded-md border bg-background px-3" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}><option value="amount">قيمة ثابتة</option><option value="percent">نسبة مئوية</option></select></label>
            <label className="space-y-1 text-sm">الخصم<Input type="number" min="0" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} /></label>
            <label className="space-y-1 text-sm">نسبة الضريبة<Input type="number" min="0" max="100" placeholder="من ملف العميل" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} /></label>
            <label className="space-y-1 text-sm sm:col-span-2">ملاحظات<Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            <div className="flex items-end"><Button className="w-full" disabled={!selected.length || !form.due_date} onClick={createInvoice}>إنشاء مسودة الفاتورة</Button></div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
