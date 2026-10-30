import { FormEvent, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function Circuits() {
  const { t } = useTranslation();
  const { circuits, courts = [], filters = {} } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const [form, setForm] = useState<any>({ court_id: '', name: '', circuit_number: '', specialty: '', notes: '' });
  const submit = (event: FormEvent) => { event.preventDefault(); router.post(route('circuits.store'), form); };
  const filter = (event: FormEvent) => { event.preventDefault(); router.get(route('circuits.index'), { search: search || undefined }, { preserveState: true }); };
  return <PageTemplate title={t('Court circuits')} description={t('Internal court circuit directory with specialty and judge associations.')} url="/circuits" breadcrumbs={[{ title: t('Courts'), href: route('courts.index') }, { title: t('Circuits') }]} actions={[{ label: t('Court register'), icon: <Search className="h-4 w-4" />, variant: 'outline', onClick: () => router.get(route('courts.index')) }]}>
    <div className="space-y-4" dir="auto"><form onSubmit={filter} className="flex gap-2"><Input aria-label={t('Search circuits')} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Search circuit')} /><Button type="submit" variant="outline">{t('Search')}</Button></form><Card className="border-primary/20"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="h-4 w-4" />{t('Add circuit')}</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-3 md:grid-cols-4"><select aria-label={t('Court')} className="h-9 rounded-md border bg-background px-3 text-sm" value={form.court_id} onChange={(event) => setForm({ ...form, court_id: event.target.value })}><option value="">{t('Select court')}</option>{courts.map((court: any) => <option key={court.id} value={court.id}>{court.name}</option>)}</select><Input aria-label={t('Circuit name')} placeholder={t('Circuit name')} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Input aria-label={t('Circuit number')} placeholder={t('Number')} value={form.circuit_number} onChange={(event) => setForm({ ...form, circuit_number: event.target.value })} /><Button type="submit">{t('Create')}</Button></form></CardContent></Card><Card className="overflow-hidden"><CardHeader className="border-b bg-muted/20"><CardTitle className="text-base">{t('Circuit directory')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/30"><tr><th className="p-3 text-start">{t('Court')}</th><th className="p-3 text-start">{t('Circuit')}</th><th className="p-3 text-start">{t('Specialty')}</th><th className="p-3 text-start">{t('Judges')}</th></tr></thead><tbody>{(circuits?.data || []).map((circuit: any) => <tr key={circuit.id} className="border-b last:border-0"><td className="p-3">{circuit.court?.name || '—'}</td><td className="p-3 font-medium">{circuit.name}<div className="text-xs text-muted-foreground">{circuit.circuit_number || '—'}</div></td><td className="p-3">{circuit.specialty || '—'}</td><td className="p-3">{(circuit.judges || []).map((judge: any) => judge.name).join('، ') || '—'}</td></tr>)}</tbody></table>{!(circuits?.data || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No circuits found.')}</div>}</div></CardContent></Card></div>
  </PageTemplate>;
}
