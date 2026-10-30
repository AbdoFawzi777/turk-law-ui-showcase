import { t as localizeSystemText } from '@/utils/i18n';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function LegalComplianceDashboard() {
  const { metrics, clients } = usePage().props as any;
  const cards = [
    ['عملاء قيد الفحص', metrics?.pending_kyc, 'text-amber-600'],
    ['عملاء مرتفعو المخاطر', metrics?.high_risk, 'text-red-600'],
    ['حالات EDD', metrics?.edd_required, 'text-violet-600'],
    ['ملكية مستفيدة ناقصة', metrics?.missing_owners, 'text-blue-600'],
  ];
  return (
    <PageTemplate title="امتثال العملاء" description="KYC والعناية الواجبة والملكية المستفيدة داخل ملفات العملاء" url={route('legal-compliance.dashboard')}>
      <div className="space-y-6" dir="rtl">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, color]) => <Card key={label as string}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div><ShieldAlert className={`h-7 w-7 ${color}`} /></CardContent></Card>)}</div>
        <Card><CardHeader><CardTitle>حالة ملفات العملاء</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-2">{clients?.map((client: any) => { const diligence = client.due_diligence; const owners = client.beneficial_owners || []; const approved = diligence?.kyc_status === 'approved' && diligence?.beneficial_owner_confirmed; return <div key={client.id} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{client.name}</p><p className="mt-1 text-xs text-muted-foreground">{localizeSystemText("KYC:")}{' '}{diligence?.kyc_status || 'pending'} · المخاطر: {diligence?.risk_level || 'medium'}</p></div>{approved ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 text-amber-600" />}</div><div className="mt-3 flex items-center justify-between text-sm"><span>الملاك المستفيدون: {owners.length}</span><Button size="sm" variant="outline" onClick={() => router.get(route('clients.show', client.id))}>فتح الملف</Button></div></div> })}</div></CardContent></Card>
      </div>
    </PageTemplate>
  );
}
