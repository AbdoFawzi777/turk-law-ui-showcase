import { FormEvent, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const date = (value: any) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';

export default function LegalHearingsIndex() {
  const { t } = useTranslation();
  const { hearings, filters = {} } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const submit = (event: FormEvent) => { event.preventDefault(); router.get(route('legal-hearings.index'), { search: search || undefined }, { preserveState: true }); };
  return <PageTemplate title={t('Hearings workspace')} description={t('Upcoming court sessions and preparation status across scoped matters.')} url="/legal/hearings" breadcrumbs={[{ title: t('Legal Matters'), href: route('matters.index') }, { title: t('Hearings') }]} actions={[{ label: t('Legacy hearing register'), icon: <Calendar className="h-4 w-4" />, variant: 'outline', onClick: () => router.get(route('hearings.index')) }]}>
    <div className="space-y-4" dir="auto"><form onSubmit={submit} className="flex gap-2"><div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label={t('Search hearings')} className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Search hearing, case, or court')} /></div><Button type="submit" variant="outline">{t('Search')}</Button></form><Card className="overflow-hidden"><CardHeader className="border-b bg-muted/20"><CardTitle className="text-base">{t('Hearing agenda')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b bg-muted/30"><tr>{[t('Date'), t('Hearing'), t('Case'), t('Court'), t('Lawyer'), t('Status')].map((heading) => <th key={heading} className="p-3 text-start font-medium text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{(hearings?.data || []).map((hearing: any) => <tr key={hearing.id} className="border-b last:border-0"><td className="p-3" dir="ltr">{date(hearing.hearing_date)}<div className="text-xs text-muted-foreground" dir="ltr">{hearing.hearing_time || '—'}</div></td><td className="p-3"><Link className="font-medium text-primary hover:underline" href={route('legal-hearings.show', hearing.id)}>{hearing.title}</Link><div className="font-mono text-xs text-muted-foreground" dir="ltr">{hearing.hearing_id}</div></td><td className="p-3">{hearing.case?.internal_case_number || hearing.case?.case_id || '—'}</td><td className="p-3">{hearing.court?.name || '—'}<div className="text-xs text-muted-foreground">{hearing.circuit?.name || '—'}</div></td><td className="p-3">{hearing.assigned_lawyer?.name || '—'}</td><td className="p-3"><Badge variant="outline">{hearing.status}</Badge></td></tr>)}</tbody></table>{!(hearings?.data || []).length && <div className="p-12 text-center text-sm text-muted-foreground">{t('No hearings found.')}</div>}</div></CardContent></Card></div>
  </PageTemplate>;
}
