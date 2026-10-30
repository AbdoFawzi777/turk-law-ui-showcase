import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';

const money = (value: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value || 0));

export default function LegalClientStatement() {
  const { client, invoices, totals } = usePage().props as any;
  return <PageTemplate title={`كشف حساب ${client?.name || ''}`} description="الفواتير والمدفوعات والرصيد القانوني للعميل" url={route('legal-billing.clients.statement', client.id)} actions={[{ label: 'العودة للتحصيل', variant: 'outline', onClick: () => router.get(route('legal-billing.collections')) }]}>
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">إجمالي الفوترة</p><p className="mt-2 text-xl font-semibold">{money(totals?.invoiced)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">إجمالي المدفوع</p><p className="mt-2 text-xl font-semibold text-emerald-600">{money(totals?.paid)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">الرصيد</p><p className="mt-2 text-xl font-semibold text-amber-600">{money(totals?.balance)}</p></CardContent></Card></div>
      <Card><CardHeader><CardTitle>الحركة</CardTitle></CardHeader><CardContent><div className="overflow-x-auto rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted/60"><tr><th className="p-3 text-right">الفاتورة</th><th className="p-3 text-right">التاريخ</th><th className="p-3 text-right">الاستحقاق</th><th className="p-3 text-left">الإجمالي</th><th className="p-3 text-left">الرصيد</th></tr></thead><tbody>{invoices?.map((invoice: any) => <tr key={invoice.id} className="border-t"><td className="p-3 font-medium">{invoice.invoice_number}</td><td className="p-3">{invoice.invoice_date}</td><td className="p-3">{invoice.due_date}</td><td className="p-3 text-left">{money(invoice.total_amount)}</td><td className="p-3 text-left font-semibold">{money(invoice.balance_amount)}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  </PageTemplate>;
}
