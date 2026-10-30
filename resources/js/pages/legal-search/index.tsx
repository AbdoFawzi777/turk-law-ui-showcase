import { FormEvent, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { FileSearch, RefreshCw, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const labels: Record<string, string> = { client: 'عميل', matter: 'ملف', case: 'قضية', hearing: 'جلسة', task: 'مهمة', document: 'مستند', invoice: 'فاتورة', judgment: 'حكم', precedent: 'سابقة', knowledge: 'معرفة', research: 'بحث' };
export default function LegalSearch({ query = '', entityType = '', results = [] }: any) {
    const [term, setTerm] = useState(query); const [type, setType] = useState(entityType);
    const submit = (event: FormEvent) => { event.preventDefault(); router.get(route('legal-search.index'), { q: term, entity_type: type || undefined }, { preserveState: true }); };
    return <PageTemplate title="البحث القانوني الموحد" description="ابحث في البيانات المصرح لك بها فقط، بما فيها النصوص المستخرجة من المستندات." url={route('legal-search.index')} actions={[{ label: 'تحديث الفهرس', icon: <RefreshCw className="h-4 w-4" />, onClick: () => router.post(route('legal-search.rebuild')), variant: 'outline' }]}>
        <div dir="rtl" className="space-y-5">
            <form onSubmit={submit} className="grid gap-3 rounded-xl bg-muted/40 p-4 md:grid-cols-[minmax(220px,1fr)_220px_auto]"><label className="relative"><Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pr-10" autoFocus aria-label="عبارة البحث" placeholder="اكتب كلمتين أو رقم مرجع…" value={term} onChange={(e) => setTerm(e.target.value)} /></label><select aria-label="نوع السجل" className="h-10 rounded-md border bg-background px-3 text-sm" value={type} onChange={(e) => setType(e.target.value)}><option value="">كل أنواع السجلات</option>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><Button>بحث</Button></form>
            {query && <p className="text-sm text-muted-foreground">عُثر على {results.length} نتيجة لعبارة «{query}».</p>}
            <div className="grid gap-3">{results.map((result: any) => <Card key={`${result.entity_type}-${result.entity_id}`}><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="mb-2 flex items-center gap-2"><Badge variant="secondary">{labels[result.entity_type] || result.entity_type}</Badge>{result.confidentiality !== 'internal' && <Badge variant="outline">مقيد</Badge>}</div><h2 className="font-semibold">{result.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{result.summary}</p></div>{result.url && <Button asChild size="sm" variant="outline"><Link href={result.url}>فتح السجل</Link></Button>}</div></CardContent></Card>)}</div>
            {query && !results.length && <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground"><FileSearch className="mx-auto mb-3 h-9 w-9" /><p>لا توجد نتائج ضمن البيانات المصرح لك بها.</p><p className="mt-1 text-xs">جرّب كلمة مختلفة أو حدّث الفهرس.</p></div>}
        </div>
    </PageTemplate>;
}
