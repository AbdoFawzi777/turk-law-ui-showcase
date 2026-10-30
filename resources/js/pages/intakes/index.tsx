import { Link, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function IntakesIndex() {
  const { t } = useTranslation();
  const { intakes, filters = {} } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const apply = (event: React.FormEvent) => { event.preventDefault(); router.get(route('intakes.index'), { search: search || undefined }, { preserveState: true }); };
  return <PageTemplate title={t('Matter Intakes')} description={t('Move a potential engagement through intake, conflict, and approval.')} url="/intakes" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Client Management'), href: route('clients.index') }, { title: t('Matter Intakes') }]} actions={[{ label: t('New Intake'), icon: <Plus />, onClick: () => router.get(route('intakes.create')) }]}>
    <div className="space-y-4"><form onSubmit={apply} className="flex gap-2"><div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Search intake reference or title...')} /></div><Button variant="outline">{t('Search')}</Button></form><Card><CardHeader><CardTitle>{t('Intake workflow')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">{t('Reference')}</th><th className="p-3 text-start">{t('Title')}</th><th className="p-3 text-start">{t('Source')}</th><th className="p-3 text-start">{t('Status')}</th><th className="p-3 text-start">{t('Conflict')}</th></tr></thead><tbody>{(intakes?.data || []).map((intake: any) => <tr key={intake.id} className="border-b last:border-0"><td className="p-3 font-mono text-xs"><Link className="text-primary hover:underline" href={route('intakes.show', intake.id)}>{intake.intake_reference}</Link></td><td className="p-3 font-medium">{intake.title}</td><td className="p-3">{intake.client?.name || intake.lead?.name || '—'}</td><td className="p-3"><span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{intake.status}</span></td><td className="p-3">{intake.latest_conflict_check?.status || '—'}</td></tr>)}</tbody></table>{!(intakes?.data || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No matter intakes found.')}</div>}</div></CardContent></Card></div>
  </PageTemplate>;
}
