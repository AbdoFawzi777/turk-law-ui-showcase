import { Link, router, usePage } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function ConflictsIndex() {
  const { t } = useTranslation();
  const { checks, filters = {} } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const submit = (event: React.FormEvent) => { event.preventDefault(); router.get(route('conflicts.index'), { search: search || undefined }, { preserveState: true }); };
  return <PageTemplate title={t('Conflict Checks')} description={t('Explainable, reviewable checks before an intake becomes ready to open a matter.')} url="/conflicts" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Client Management'), href: route('clients.index') }, { title: t('Conflict Checks') }]}><div className="space-y-4"><form onSubmit={submit} className="flex gap-2"><div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Search checks or intake titles...')} /></div><Button variant="outline">{t('Search')}</Button></form><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />{t('Review queue')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">{t('Check')}</th><th className="p-3 text-start">{t('Intake')}</th><th className="p-3 text-start">{t('Status')}</th><th className="p-3 text-start">{t('Matches')}</th><th className="p-3 text-start">{t('Reviewed')}</th></tr></thead><tbody>{(checks?.data || []).map((check: any) => <tr key={check.id} className="border-b last:border-0"><td className="p-3 font-mono text-xs"><Link className="text-primary hover:underline" href={route('conflicts.show', check.id)}>{check.check_reference}</Link></td><td className="p-3">{check.intake?.title || '—'}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs ${['clear', 'clear_with_conditions'].includes(check.status) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{check.status}</span></td><td className="p-3">{check.matches?.length || 0}</td><td className="p-3">{check.reviewer?.name || '—'}</td></tr>)}</tbody></table>{!(checks?.data || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No conflict checks found.')}</div>}</div></CardContent></Card></div></PageTemplate>;
}
