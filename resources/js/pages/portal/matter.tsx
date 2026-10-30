import { CalendarDays } from 'lucide-react';
import { PortalLayout } from '@/components/portal-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const labels: Record<string, string> = { open: 'مفتوح', active: 'نشط', pending: 'قيد المتابعة', closed: 'مغلق' };
export default function PortalMatter({ portalAccount, matter, updates = [] }: any) {
    return <PortalLayout title={matter.title} account={portalAccount}>
        <Card><CardContent className="p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">رقم الملف: {matter.matter_number || '—'}</p><p className="mt-3 max-w-3xl leading-7">{matter.description || 'لا يوجد وصف منشور لهذا الملف.'}</p></div><Badge variant="outline">{labels[matter.status] || matter.status}</Badge></div></CardContent></Card>
        <Card className="mt-6"><CardHeader><CardTitle>التحديثات المنشورة</CardTitle></CardHeader><CardContent className="space-y-4">{updates.map((update: any) => <article key={update.id} className="rounded-lg border p-4"><h2 className="font-semibold">{update.title}</h2><p className="my-2 text-sm leading-7 text-muted-foreground">{update.summary}</p><time className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4" />{new Date(update.update_date || update.published_at).toLocaleDateString('ar-EG')}</time></article>)}{!updates.length && <p className="py-8 text-center text-sm text-muted-foreground">لا توجد تحديثات منشورة لهذا الملف.</p>}</CardContent></Card>
    </PortalLayout>;
}
