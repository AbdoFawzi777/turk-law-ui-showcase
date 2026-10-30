import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, CreditCard, FileCheck2, HandCoins, WalletCards } from 'lucide-react';

const money = (value: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value || 0));

export default function LegalBillingDashboard() {
  const { metrics, overdueInvoices, recentInvoices, lawyerKpis } = usePage().props as any;
  const cards = [
    { label: 'الرصيد المستحق', value: money(metrics?.outstanding), icon: WalletCards, tone: 'text-amber-600' },
    { label: 'متأخر التحصيل', value: money(metrics?.overdue), icon: HandCoins, tone: 'text-red-600' },
    { label: 'عناصر طابور الفوترة', value: metrics?.queued_items ?? 0, icon: ClipboardList, tone: 'text-blue-600' },
    { label: 'دفعات غير مخصصة', value: money(metrics?.unallocated_payments), icon: CreditCard, tone: 'text-violet-600' },
  ];

  return (
    <PageTemplate title="المالية القانونية" description="متابعة الفوترة والتحصيل والاعتمادات داخل الشركة" url={route('legal-billing.dashboard')} actions={[
      { label: 'طابور الفوترة', icon: <ArrowLeft className="h-4 w-4" />, onClick: () => router.get(route('legal-billing.queue')) },
      { label: 'التحصيل', icon: <ArrowLeft className="h-4 w-4" />, variant: 'outline', onClick: () => router.get(route('legal-billing.collections')) },
    ]}>
      <div className="space-y-6" dir="rtl">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between p-5">
                <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>
                <Icon className={`h-7 w-7 ${tone}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>الفواتير المتأخرة</CardTitle></CardHeader>
            <CardContent>
              {overdueInvoices?.length ? <div className="space-y-3">{overdueInvoices.map((invoice: any) => (
                <button key={invoice.id} type="button" className="flex w-full items-center justify-between rounded-lg border p-3 text-right hover:bg-muted" onClick={() => router.get(route('legal-billing.invoices.show', invoice.id))}>
                  <span><span className="block font-medium">{invoice.client?.name || 'عميل'}</span><span className="text-xs text-muted-foreground">{invoice.invoice_number} · استحقاق {invoice.due_date}</span></span>
                  <span className="font-semibold text-red-600">{money(invoice.balance_amount)}</span>
                </button>
              ))}</div> : <p className="text-sm text-muted-foreground">لا توجد فواتير متأخرة حاليًا.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>آخر الفواتير</CardTitle></CardHeader>
            <CardContent>
              {recentInvoices?.length ? <div className="divide-y">{recentInvoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between py-3">
                  <span><span className="block font-medium">{invoice.invoice_number}</span><span className="text-xs text-muted-foreground">{invoice.client?.name || 'عميل'} · {invoice.workflow_status || invoice.status}</span></span>
                  <span className="font-semibold">{money(invoice.total_amount)}</span>
                </div>
              ))}</div> : <p className="text-sm text-muted-foreground">لم تُنشأ فواتير قانونية بعد.</p>}
            </CardContent>
          </Card>
        </div>

        <Card><CardHeader><CardTitle>مؤشرات الإنتاجية والربحية</CardTitle></CardHeader><CardContent><div className="grid gap-4 md:grid-cols-3"><div className="rounded-lg bg-muted/50 p-4"><p className="text-sm text-muted-foreground">قيمة الوقت المعتمد</p><p className="mt-1 text-lg font-semibold">{money(metrics?.approved_time_value)}</p></div><div className="rounded-lg bg-muted/50 p-4"><p className="text-sm text-muted-foreground">قيمة الوقت المفوتر</p><p className="mt-1 text-lg font-semibold">{money(metrics?.billed_time_value)}</p></div><div className="rounded-lg bg-muted/50 p-4"><p className="text-sm text-muted-foreground">نسبة التحويل إلى فوترة</p><p className="mt-1 text-lg font-semibold">{metrics?.realization_rate || 0}%</p></div></div><div className="mt-5 divide-y">{lawyerKpis?.map((lawyer: any) => <div key={lawyer.name} className="flex items-center justify-between py-3 text-sm"><span>{lawyer.name} · {lawyer.hours} ساعة</span><span className="font-medium">{money(lawyer.billed_value)} / {money(lawyer.value)}</span></div>)}</div></CardContent></Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground"><FileCheck2 className="h-5 w-5 text-emerald-600" /> مسار الاعتماد الداخلي منفصل عن بوابات الدفع ومنظومة SaaS، وتظل مرحلة ZATCA مؤجلة.</CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
