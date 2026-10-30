import { useState } from 'react';
import { router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export default function OfficeExpenseSettings({ categories, approvalThreshold }: any) {
    const { t } = useTranslation();
    const [threshold, setThreshold] = useState(String(approvalThreshold ?? 0));
    const [form, setForm] = useState({ name: '', type: 'other', description: '' });

    const saveThreshold = (event: React.FormEvent) => { event.preventDefault(); router.put(route('office-expenses.settings.update'), { approval_threshold: threshold }, { preserveScroll: true }); };
    const createCategory = (event: React.FormEvent) => { event.preventDefault(); router.post(route('office-expense-categories.store'), form, { preserveScroll: true, onSuccess: () => setForm({ name: '', type: 'other', description: '' }) }); };
    const deleteCategory = (id: number) => { if (window.confirm(t('Delete this category?'))) router.delete(route('office-expense-categories.destroy', id), { preserveScroll: true }); };

    return <PageTemplate title={t('Office Expense Settings')} description={t('Configure categories and approval controls for office operating expenses.')} url="/office-expenses/settings" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Office Expenses'), href: route('office-expenses.index') }, { title: t('Settings') }]}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
            <div className="space-y-6"><Card><CardHeader><CardTitle>{t('Approval Threshold')}</CardTitle></CardHeader><CardContent><form onSubmit={saveThreshold} className="space-y-4"><p className="text-sm text-muted-foreground">{t('Expenses above this amount require manager approval. Set 0 to require approval for every expense.')}</p><div className="space-y-2"><Label htmlFor="office-approval-threshold">{t('Amount')}</Label><Input id="office-approval-threshold" type="number" min="0" step="0.01" value={threshold} onChange={(event) => setThreshold(event.target.value)} required /></div><Button type="submit">{t('Save Threshold')}</Button></form></CardContent></Card><Card><CardHeader><CardTitle>{t('Add Category')}</CardTitle></CardHeader><CardContent><form onSubmit={createCategory} className="space-y-4"><div className="space-y-2"><Label htmlFor="office-category-name">{t('Name')}</Label><Input id="office-category-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div><div className="space-y-2"><Label>{t('Type')}</Label><Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="government">{t('Government Expense')}</SelectItem><SelectItem value="other">{t('Other Expense')}</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="office-category-description">{t('Description')}</Label><Input id="office-category-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><Button type="submit">{t('Add Category')}</Button></form></CardContent></Card></div>
            <Card><CardHeader><CardTitle>{t('Office Expense Categories')}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">{t('Name')}</th><th className="p-3 text-start">{t('Type')}</th><th className="p-3 text-start">{t('Status')}</th><th className="p-3 text-end">{t('Actions')}</th></tr></thead><tbody>{(categories?.data || []).map((category: any) => <tr key={category.id} className="border-b last:border-0"><td className="p-3">{category.name}</td><td className="p-3">{category.type === 'government' ? t('Government Expense') : t('Other Expense')}</td><td className="p-3">{category.status}</td><td className="p-3 text-end"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => router.put(route('office-expense-categories.toggle-status', category.id), {}, { preserveScroll: true })}>{category.status === 'active' ? t('Deactivate') : t('Activate')}</Button><Button size="sm" variant="ghost" onClick={() => deleteCategory(category.id)}>{t('Delete')}</Button></div></td></tr>)}</tbody></table>{!(categories?.data || []).length && <p className="p-10 text-center text-sm text-muted-foreground">{t('No office expense categories yet.')}</p>}</div></CardContent></Card>
        </div>
    </PageTemplate>;
}
