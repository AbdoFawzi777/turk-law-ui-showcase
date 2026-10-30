import { Download, FileCheck2 } from 'lucide-react';
import { PortalLayout } from '@/components/portal-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PortalDocuments({ portalAccount, documents = [] }: any) {
    return <PortalLayout title="المستندات المشتركة" account={portalAccount}>
        <div className="grid gap-4 md:grid-cols-2">{documents.map((item: any) => <Card key={item.id}><CardContent className="flex h-full items-start justify-between gap-4 p-5"><div className="flex min-w-0 gap-3"><span className="rounded-lg bg-emerald-50 p-3 text-emerald-700"><FileCheck2 className="h-5 w-5" /></span><div className="min-w-0"><h2 className="truncate font-semibold">{item.document.title || item.document.name}</h2><p className="mt-1 text-xs text-muted-foreground">{item.document.document_number || 'دون رقم'} — الإصدار {item.version.version_number}</p><p className="mt-2 text-sm">{item.matter?.title}</p></div></div>{item.download_url ? <Button asChild size="sm" variant="outline"><a href={item.download_url}><Download className="ml-2 h-4 w-4" />تنزيل</a></Button> : <span className="text-xs text-muted-foreground">للعرض فقط</span>}</CardContent></Card>)}
        </div>{!documents.length && <div className="rounded-xl border border-dashed bg-white py-16 text-center text-sm text-muted-foreground">لم يشارك المكتب أي مستندات معك بعد.</div>}
    </PortalLayout>;
}
