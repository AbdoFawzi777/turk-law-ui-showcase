import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Send } from 'lucide-react';

const money = (value: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value || 0));

export default function LegalInvoice() {
  const { invoice } = usePage().props as any;
  const canApprove = invoice?.workflow_status === 'under_review';
  return (
    <PageTemplate title={`الفاتورة ${invoice?.invoice_number || ''}`} description="فاتورة قانونية داخلية قابلة للمراجعة والتحصيل" url={route('legal-billing.invoices.show', invoice.id)} actions={[{ label: 'طباعة / PDF', variant: 'outline', onClick: () => window.open(route('legal-billing.invoices.print', invoice.id), '_blank') },
      ...(invoice?.workflow_status === 'draft' ? [{ label: 'إرسال للمراجعة', icon: <Send className="h-4 w-4" />, onClick: () => router.post(route('legal-billing.invoices.submit', invoice.id)) }] : []),
      ...((canApprove ? [{ label: 'اعتماد الفاتورة', icon: <CheckCircle2 className="h-4 w-4" />, variant: 'default' as const, onClick: () => router.post(route('legal-billing.invoices.approve', invoice.id)) }] : []) satisfies import('@/components/page-template').PageAction[]),
    ]}>
      <div className="space-y-6" dir="rtl">
        <div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">العميل</p><p className="mt-2 font-semibold">{invoice?.client?.name}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">الحالة</p><Badge className="mt-2" variant={invoice?.workflow_status === 'approved' ? 'success' : 'review'}>{invoice?.workflow_status || invoice?.status}</Badge></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">الرصيد</p><p className="mt-2 text-xl font-semibold">{money(invoice?.balance_amount)}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle>بنود الفاتورة</CardTitle></CardHeader><CardContent><div className="overflow-x-auto rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted/60"><tr><th className="p-3 text-right">الوصف</th><th className="p-3 text-right">الكمية</th><th className="p-3 text-right">المعدل</th><th className="p-3 text-left">المجموع</th></tr></thead><tbody>{(invoice?.legal_invoice_lines || []).map((line: any) => <tr key={line.id} className="border-t"><td className="p-3">{line.description}</td><td className="p-3">{line.quantity}</td><td className="p-3">{money(line.rate)}</td><td className="p-3 text-left font-semibold">{money(line.total_amount)}</td></tr>)}</tbody></table></div><div className="mt-6 ml-auto max-w-sm space-y-2 text-sm"><div className="flex justify-between"><span>الإجمالي قبل الخصم</span><strong>{money(invoice?.subtotal)}</strong></div><div className="flex justify-between"><span>الخصم</span><strong>{money(invoice?.discount_amount)}</strong></div><div className="flex justify-between"><span>الضريبة</span><strong>{money(invoice?.tax_amount)}</strong></div><div className="flex justify-between border-t pt-2 text-base"><span>الإجمالي</span><strong>{money(invoice?.total_amount)}</strong></div></div></CardContent></Card>
        {invoice?.legal_payment_allocations?.length > 0 && <Card><CardHeader><CardTitle>التخصيصات</CardTitle></CardHeader><CardContent className="space-y-2">{invoice.legal_payment_allocations.map((allocation: any) => <div key={allocation.id} className="flex justify-between rounded border p-3 text-sm"><span>{allocation.payment?.payment_number || 'دفعة'}</span><strong>{money(allocation.amount)}</strong></div>)}</CardContent></Card>}
      </div>
    </PageTemplate>
  );
}
