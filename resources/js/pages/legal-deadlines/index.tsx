import { FormEvent, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const date = (value: any) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';
const overdue = (row: any) => !['completed', 'cancelled'].includes(row.status) && row.due_date && new Date(row.due_date) < new Date();

export default function LegalDeadlinesIndex() {
  const { t } = useTranslation();
  const { deadlines, filters = {} } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const submit = (event: FormEvent) => { event.preventDefault(); router.get(route('legal-deadlines.index'), { search: search || undefined }, { preserveState: true }); };
  return <PageTemplate title={t('Legal deadlines')} description={t('Due dates, responsible lawyers, calculated-rule review, and overdue exposure.')} url="/legal/deadlines" breadcrumbs={[{ title: t('Legal Matters'), href: route('matters.index') }, { title: t('Deadlines') }]}>
    <div className="space-y-4" dir="auto"><form onSubmit={submit} className="flex gap-2"><div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label={t('Search deadlines')} className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Search deadlines')} /></div><Button type="submit" variant="outline">{t('Search')}</Button></form><Card className="overflow-hidden"><CardHeader className="border-b bg-muted/20"><CardTitle className="text-base">{t('Deadline register')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-sm"><thead className="border-b bg-muted/30"><tr>{[t('Due date'), t('Deadline'), t('Matter'), t('Responsible'), t('Priority'), t('Status'), t('Review')].map((heading) => <th key={heading} className="p-3 text-start font-medium text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{(deadlines?.data || []).map((row: any) => <tr key={row.id} className={`border-b last:border-0 ${overdue(row) ? 'bg-red-50/40' : ''}`}><td className="p-3" dir="ltr">{overdue(row) && <AlertTriangle className="me-1 inline h-3 w-3 text-red-700" />}{date(row.due_date)}</td><td className="p-3 font-medium">{row.title}<div className="text-xs text-muted-foreground">{row.source}</div></td><td className="p-3">{row.matter ? <Link href={route('matters.show', row.matter.id)} className="text-primary hover:underline">{row.matter.matter_number}</Link> : '—'}<div className="text-xs text-muted-foreground">{row.case?.internal_case_number || '—'}</div></td><td className="p-3">{row.responsible_user?.name || '—'}</td><td className="p-3"><Badge variant="outline">{row.priority}</Badge></td><td className="p-3"><Badge variant="outline">{row.status}</Badge></td><td className="p-3">{row.requires_review ? <span className="text-xs text-amber-700">{t('Legal review required')}</span> : row.manual_override ? <span className="text-xs text-primary">{t('Override recorded')}</span> : '—'}</td></tr>)}</tbody></table>{!(deadlines?.data || []).length && <div className="p-12 text-center text-sm text-muted-foreground">{t('No deadlines found.')}</div>}</div></CardContent></Card></div>
  </PageTemplate>;
}
