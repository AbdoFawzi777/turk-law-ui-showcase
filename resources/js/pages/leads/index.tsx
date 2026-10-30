import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Archive, ArrowRightLeft, Search, X } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hasPermission } from '@/utils/authorization';
import { useTranslation } from 'react-i18next';

const can = (permissions: string[], names: string[]) => names.some((name) => hasPermission(permissions, name));

export default function LeadsIndex() {
  const { t } = useTranslation();
  const { auth, leads, filters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState(filters.search || '');
  const [form, setForm] = useState<any>(editing || { name: '', lead_kind: 'individual', email: '', phone: '', requested_service: '', priority: 'medium', status: 'new', summary: '' });

  const openForm = (lead: any = null) => {
    setEditing(lead);
    setForm(lead || { name: '', lead_kind: 'individual', email: '', phone: '', requested_service: '', priority: 'medium', status: 'new', summary: '' });
    setShowForm(true);
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const done = () => { setShowForm(false); setEditing(null); };
    if (editing) router.put(route('leads.update', editing.id), form, { onSuccess: done });
    else router.post(route('leads.store'), form, { onSuccess: done });
  };
  const applySearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.get(route('leads.index'), { search: search || undefined }, { preserveState: true, preserveScroll: true });
  };

  return (
    <PageTemplate title={t('Leads')} description={t('Qualify potential clients before opening a legal file.')} url="/leads"
      breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Client Management'), href: route('clients.index') }, { title: t('Leads') }]}
      actions={can(permissions, ['LEAD_CREATE', 'create-leads', 'manage-leads']) ? [{ label: t('Add Lead'), icon: <Plus />, onClick: () => openForm() }] : []}>
      <div className="space-y-4">
        <form onSubmit={applySearch} className="flex gap-2">
          <div className="relative flex-1"><Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Search leads...')} className="ps-9" /></div>
          <Button variant="outline" type="submit">{t('Search')}</Button>
        </form>
        {showForm && <Card className="border-primary/30"><CardHeader className="flex-row items-center justify-between"><CardTitle>{editing ? t('Edit Lead') : t('New Lead')}</CardTitle><Button size="icon" variant="ghost" onClick={() => setShowForm(false)}><X /></Button></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {[
            ['name', t('Name'), 'text'], ['email', t('Email'), 'email'], ['phone', t('Phone'), 'text'], ['requested_service', t('Requested service'), 'text'],
          ].map(([name, label, type]) => <div key={name} className="space-y-1"><Label htmlFor={`lead-${name}`}>{label}</Label><Input id={`lead-${name}`} type={type} value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={name === 'name'} /></div>)}
          <div className="space-y-1"><Label>{t('Lead type')}</Label><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.lead_kind} onChange={(e) => setForm({ ...form, lead_kind: e.target.value })}><option value="individual">{t('Individual')}</option><option value="corporate">{t('Corporate')}</option></select></div>
          <div className="space-y-1"><Label>{t('Priority')}</Label><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">{t('Low')}</option><option value="medium">{t('Medium')}</option><option value="high">{t('High')}</option><option value="urgent">{t('Urgent')}</option></select></div>
          <div className="space-y-1 md:col-span-2"><Label>{t('Summary')}</Label><textarea className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
          <div className="flex justify-end gap-2 md:col-span-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('Cancel')}</Button><Button type="submit">{editing ? t('Save changes') : t('Create lead')}</Button></div>
        </form></CardContent></Card>}
        <Card><CardHeader><CardTitle>{t('Lead pipeline')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40 text-start"><tr><th className="p-3 text-start">{t('Reference')}</th><th className="p-3 text-start">{t('Name')}</th><th className="p-3 text-start">{t('Service')}</th><th className="p-3 text-start">{t('Status')}</th><th className="p-3 text-end">{t('Actions')}</th></tr></thead><tbody>{(leads?.data || []).map((lead: any) => <tr key={lead.id} className="border-b last:border-0"><td className="p-3 font-mono text-xs">{lead.lead_reference}</td><td className="p-3 font-medium">{lead.name}<div className="text-xs text-muted-foreground">{lead.email || lead.phone || '—'}</div></td><td className="p-3">{lead.requested_service || '—'}</td><td className="p-3"><span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{lead.status}</span></td><td className="p-3"><div className="flex justify-end gap-1">{can(permissions, ['LEAD_EDIT', 'edit-leads', 'manage-leads']) && <Button size="icon" variant="ghost" onClick={() => openForm(lead)}><Pencil /></Button>}{can(permissions, ['LEAD_CONVERT', 'convert-leads', 'manage-leads']) && lead.status !== 'converted' && <Button size="icon" variant="ghost" onClick={() => router.post(route('leads.convert', lead.id))}><ArrowRightLeft /></Button>}{can(permissions, ['LEAD_ARCHIVE', 'archive-leads', 'manage-leads']) && lead.status !== 'archived' && <Button size="icon" variant="ghost" onClick={() => router.put(route('leads.archive', lead.id))}><Archive /></Button>}</div></td></tr>)}</tbody></table>{!(leads?.data || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No leads found.')}</div>}</div></CardContent></Card>
      </div>
    </PageTemplate>
  );
}
