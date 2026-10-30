import { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { Plus, WalletCards } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PayrollTotals } from '@/components/payroll-totals';
import { useTranslation } from 'react-i18next';

const statusLabel: Record<string, string> = {
    draft: 'مسودة',
    approved: 'معتمد',
    paid: 'مدفوع',
};

export default function PayrollIndex({ runs }: any) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const permissions = auth?.permissions || [];
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const now = new Date();
    const [form, setForm] = useState({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        currency: 'SAR',
        name: 'Payroll ' + now.toLocaleString('en-US', { month: 'long' }) + ' ' + now.getFullYear(),
        notes: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        router.post(route('payroll.runs.store'), form, {
            onSuccess: () => setIsCreateOpen(false),
        });
    };

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Payroll') },
    ];

    return (
        <PageTemplate
            title={t('Payroll')}
            description={t('Manage monthly salaries for internal employees only.')}
            url="/payroll"
            breadcrumbs={breadcrumbs}
            actions={[
                ...(permissions.includes('create-payroll') ? [{ label: t('New Payroll Run'), icon: <Plus className="h-4 w-4" />, onClick: () => setIsCreateOpen(true) }] : []),
                ...(permissions.includes('view-payroll-reports') ? [{ label: t('Reports'), onClick: () => router.get(route('payroll.reports.index')) }] : []),
            ]}
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('Payroll Runs')}</p>
                                <p className="mt-2 text-2xl font-semibold">{runs?.total || 0}</p>
                            </div>
                            <WalletCards className="h-8 w-8 text-primary" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground">{t('Latest Status')}</p>
                            <p className="mt-2 text-2xl font-semibold">{statusLabel[runs?.data?.[0]?.status] || '—'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground">{t('Latest Net Payroll')}</p>
                            <p className="mt-2 text-2xl font-semibold"><PayrollTotals items={runs?.data?.[0]?.items || []} field="net_salary" /></p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>{t('Monthly Payroll Runs')}</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="p-3 text-start">{t('Payroll Run')}</th>
                                        <th className="p-3 text-start">{t('Employees')}</th>
                                        <th className="p-3 text-start">{t('Base Salary')}</th>
                                        <th className="p-3 text-start">{t('Additions')}</th>
                                        <th className="p-3 text-start">{t('Deductions')}</th>
                                        <th className="p-3 text-start">{t('Net')}</th>
                                        <th className="p-3 text-start">{t('Status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(runs?.data || []).map((run: any) => (
                                        <tr key={run.id} className="border-b last:border-0">
                                            <td className="p-3">
                                                <Link className="font-medium text-primary hover:underline" href={route('payroll.runs.show', run.id)}>
                                                    {run.name}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">{run.year}-{String(run.month).padStart(2, '0')}</div>
                                            </td>
                                            <td className="p-3">{run.items_count || 0}</td>
                                            <td className="p-3"><PayrollTotals items={run.items} field="base_salary" /></td>
                                            <td className="p-3 text-emerald-700"><PayrollTotals items={run.items} field="total_additions" /></td>
                                            <td className="p-3 text-red-700"><PayrollTotals items={run.items} field="total_deductions" /></td>
                                            <td className="p-3 font-semibold"><PayrollTotals items={run.items} field="net_salary" /></td>
                                            <td className="p-3">
                                                <span className={
                                                    'rounded-full px-2 py-1 text-xs ' +
                                                    (run.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : run.status === 'approved' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')
                                                }>
                                                    {statusLabel[run.status] || run.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!(runs?.data || []).length && (
                                <div className="p-10 text-center text-sm text-muted-foreground">
                                    {t('No payroll runs yet. Create the first monthly run after employee financial data is set up.')}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('New Payroll Run')}</DialogTitle></DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="payroll-year">{t('Year')}</Label>
                                <Input id="payroll-year" type="number" min={2000} max={2200} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payroll-month">{t('Month')}</Label>
                                <Input id="payroll-month" type="number" min={1} max={12} value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="payroll-currency">{t('Currency')}</Label>
                                <select id="payroll-currency" className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                                    <option value="SAR">SAR - ر.س</option>
                                    <option value="EGP">EGP</option>
                                    <option value="USD">USD</option>
                                </select>
                                <p className="text-xs text-muted-foreground">{t('Create separate payroll runs for each currency. Existing employee currency is preserved.')}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payroll-name">{t('Run Name')}</Label>
                            <Input id="payroll-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payroll-notes">{t('Notes')}</Label>
                            <Input id="payroll-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>{t('Cancel')}</Button>
                            <Button type="submit">{t('Create Run')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageTemplate>
    );
}
