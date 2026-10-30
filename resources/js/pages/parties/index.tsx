import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { hasPermission } from '@/utils/authorization';
import { useTranslation } from 'react-i18next';

const can = (permissions: string[], names: string[]) => names.some((name) => hasPermission(permissions, name));

export default function PartiesIndex() {
  const { t } = useTranslation();
  const { auth, parties, filters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const [search, setSearch] = useState(filters.search || '');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ party_kind: 'individual', name: '', legal_name: '', email: '', phone: '', commercial_registration_number: '' });
  const submit = (event: React.FormEvent) => { event.preventDefault(); router.post(route('parties.store'), form, { onSuccess: () => setShowForm(false) }); };
  const applySearch = (event: React.FormEvent) => { event.preventDefault(); router.get(route('parties.index'), { search: search || undefined }, { preserveState: true }); };

  return <PageTemplate title={t('Parties')} description={t('One directory for clients, counterparties, institutions, and related entities.')} url="/parties" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Client Management'), href: route('clients.index') }, { title: t('Parties') }]} actions={can(permissions, ['PARTY_CREATE', 'create-parties', 'manage-parties']) ? [{ label: t('Add Party'), icon: <Plus />, onClick: () => setShowForm(!showForm) }] : []}>
    <div className="space-y-4">
      <form onSubmit={applySearch} className="flex gap-2"><div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Search by name, reference, registration, email...')} /></div><Button variant="outline">{t('Search')}</Button></form>
      {showForm && <Card className="border-primary/30"><CardHeader><CardTitle>{t('New party')}</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-2"><div className="space-y-1"><Label>{t('Party kind')}</Label><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.party_kind} onChange={(e) => setForm({ ...form, party_kind: e.target.value })}><option value="individual">{t('Individual')}</option><option value="company">{t('Company')}</option><option value="government">{t('Government')}</option><option value="entity">{t('Entity')}</option><option value="law_firm">{t('Law firm')}</option><option value="insurer">{t('Insurer')}</option></select></div>{[['name', t('Name')], ['legal_name', t('Legal name')], ['email', t('Email')], ['phone', t('Phone')], ['commercial_registration_number', t('Commercial registration number')]].map(([name, label]) => <div key={name} className="space-y-1"><Label>{label}</Label><Input value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={name === 'name'} /></div>)}<div className="flex justify-end gap-2 md:col-span-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('Cancel')}</Button><Button type="submit">{t('Create party')}</Button></div></form></CardContent></Card>}
      <Card><CardHeader><CardTitle>{t('Party directory')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">{t('Reference')}</th><th className="p-3 text-start">{t('Party')}</th><th className="p-3 text-start">{t('Kind')}</th><th className="p-3 text-start">{t('Connections')}</th></tr></thead><tbody>{(parties?.data || []).map((party: any) => <tr key={party.id} className="border-b last:border-0"><td className="p-3 font-mono text-xs">{party.party_reference}</td><td className="p-3"><Link className="font-medium text-primary hover:underline" href={route('parties.show', party.id)}>{party.legal_name || party.name}</Link><div className="text-xs text-muted-foreground">{party.email || party.phone || '—'}</div></td><td className="p-3">{party.party_kind}</td><td className="p-3">{(party.clients_count || 0) + (party.relationships_count || 0) + (party.reverse_relationships_count || 0)}</td></tr>)}</tbody></table>{!(parties?.data || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No parties found.')}</div>}</div></CardContent></Card>
    </div>
  </PageTemplate>;
}
