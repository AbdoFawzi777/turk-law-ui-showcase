import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Check, Download, Edit, Plus, WalletCards } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PayrollTotals } from '@/components/payroll-totals';
import { useTranslation } from 'react-i18next';

const money = (value: any, currency = 'SAR') =>
    Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;

type Line = { label: string; amount: number; notes?: string };
const statusLabel: Record<string, string> = { draft: 'مسودة', approved: 'معتمد', paid: 'مدفوع' };

export default function PayrollShow({ run }: any) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const permissions = auth?.permissions || [];
    const [activeItem, setActiveItem] = useState<any>(null);
    const [additions, setAdditions] = useState<Line[]>([]);
    const [deductions, setDeductions] = useState<Line[]>([]);

    const openEditor = (item: any) => {
        setActiveItem(item);
        setAdditions((item.line_items || []).filter((line: any) => line.type === 'addition').map((line: any) => ({ label: line.label, amount: Number(line.amount), notes: line.notes || '' })));
        setDeductions((item.line_items || []).filter((line: any) => line.type === 'deduction').map((line: any) => ({ label: line.label, amount: Number(line.amount), notes: line.notes || '' })));
    };

    const submitItem = (event: React.FormEvent) => {
        event.preventDefault();
        router.put(route('payroll.runs.employee.update', [run.id, activeItem.user_id]), { additions, deductions }, {
            onSuccess: () => setActiveItem(null),
        });
    };

    const updateLine = (type: 'additions' | 'deductions', index: number, key: keyof Line, value: any) => {
        const setter = type === 'additions' ? setAdditions : setDeductions;
        const source = type === 'additions' ? additions : deductions;
        const next = [...source];
        next[index] = { ...next[index], [key]: key === 'amount' ? Number(value) : value };
        setter(next);
    };

    const addLine = (type: 'additions' | 'deductions') => {
        const setter = type === 'additions' ? setAdditions : setDeductions;
        setter((lines) => [...lines, { label: '', amount: 0 }]);
    };

    const removeLine = (type: 'additions' | 'deductions', index: number) => {
        const setter = type === 'additions' ? setAdditions : setDeductions;
        setter((lines) => lines.filter((_, lineIndex) => lineIndex !== index));
    };

    const transition = (name: 'approve' | 'pay') => {
        router.post(route(name === 'approve' ? 'payroll.runs.approve' : 'payroll.runs.pay', run.id));
    };

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Payroll'), href: route('payroll.runs.index') },
        { title: run.name },
    ];

    return (
        <PageTemplate title={run.name} description={t('Review, adjust, approve, and pay this monthly payroll run.')} url={'/payroll/' + run.id} breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <WalletCards className="h-5 w-5 text-primary" />
                        <span className={
                            'rounded-full px-3 py-1 text-sm ' +
                            (run.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : run.status === 'approved' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')
                        }>
                            {statusLabel[run.status] || run.status}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {run.status === 'draft' && permissions.includes('approve-payroll') && (
                            <Button onClick={() => transition('approve')}><Check className="me-2 h-4 w-4" />{t('Approve Payroll')}</Button>
                        )}
                        {run.status === 'approved' && permissions.includes('pay-payroll') && (
                            <Button onClick={() => transition('pay')}><Check className="me-2 h-4 w-4" />{t('Mark as Paid')}</Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        [t('Base Salary'), 'base_salary', ''],
                        [t('Additions'), 'total_additions', 'text-emerald-700'],
                        [t('Deductions'), 'total_deductions', 'text-red-700'],
                        [t('Net Payroll'), 'net_salary', 'text-primary'],
                    ].map(([label, value, className]) => (
                        <Card key={String(label)}>
                            <CardContent className="p-5">
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className={'mt-2 text-2xl font-semibold ' + className}><PayrollTotals items={run.items} field={value as 'base_salary' | 'total_additions' | 'total_deductions' | 'net_salary'} /></p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader><CardTitle>{t('Employee Payroll Details')}</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="p-3 text-start">{t('Employee')}</th>
                                        <th className="p-3 text-start">{t('Base Salary')}</th>
                                        <th className="p-3 text-start">{t('Additions')}</th>
                                        <th className="p-3 text-start">{t('Deductions')}</th>
                                        <th className="p-3 text-start">{t('Net Salary')}</th>
                                        {(run.status === 'draft' || permissions.includes('view-payroll-payslips')) && <th className="p-3 text-start">{t('Actions')}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(run.items || []).map((item: any) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-3">
                                                <p className="font-medium">{item.employee_name}</p>
                                                <p className="text-xs text-muted-foreground">{item.employee_job_title || t('Internal employee')}</p>
                                            </td>
                                            <td className="p-3">{money(item.base_salary, item.currency)}</td>
                                            <td className="p-3 text-emerald-700">{money(item.total_additions, item.currency)}</td>
                                            <td className="p-3 text-red-700">{money(item.total_deductions, item.currency)}</td>
                                            <td className="p-3 font-semibold">{money(item.net_salary, item.currency)}</td>
                                            {(run.status === 'draft' || permissions.includes('view-payroll-payslips')) && (
                                                <td className="p-3">
                                                    {run.status === 'draft' && permissions.includes('edit-payroll') && <Button variant="outline" size="sm" onClick={() => openEditor(item)}><Edit className="me-2 h-4 w-4" />{t('Adjust')}</Button>}
                                                    {run.status !== 'draft' && permissions.includes('view-payroll-payslips') && (
                                                        <Button asChild variant="outline" size="sm" className="ms-2">
                                                            <a href={route('payroll.runs.payslip', [run.id, item.id])}><Download className="me-2 h-4 w-4" />{t('Payslip PDF')}</a>
                                                        </Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!(run.items || []).length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No active internal employee has financial data configured for this run.')}</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader><DialogTitle>{t('Adjust salary')}: {activeItem?.employee_name}</DialogTitle><DialogDescription>أضف البدلات والخصومات وراجع صافي الراتب قبل الحفظ.</DialogDescription></DialogHeader>
                    <form onSubmit={submitItem} className="space-y-5">
                        {[
                            ['additions', additions, t('Additions'), 'emerald'],
                            ['deductions', deductions, t('Deductions'), 'red'],
                        ].map(([type, lines, title, color]: any) => (
                            <section key={type}>
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className={color === 'emerald' ? 'font-medium text-emerald-700' : 'font-medium text-red-700'}>{title}</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addLine(type)}><Plus className="me-1 h-4 w-4" />{t('Add line')}</Button>
                                </div>
                                <div className="space-y-2">
                                    {(lines as Line[]).map((line, index) => (
                                        <div key={type + '-' + index} className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
                                            <Input aria-label={`${title} ${index + 1} - ${t('Label')}`} required placeholder={t('Label')} value={line.label} onChange={(e) => updateLine(type, index, 'label', e.target.value)} />
                                            <Input aria-label={`${title} ${index + 1} - ${t('Amount')}`} type="number" min={0} step="0.01" required placeholder={t('Amount')} value={line.amount} onChange={(e) => updateLine(type, index, 'amount', e.target.value)} />
                                            <Button type="button" variant="ghost" onClick={() => removeLine(type, index)}>{t('Remove')}</Button>
                                        </div>
                                    ))}
                                    {!(lines as Line[]).length && <p className="text-sm text-muted-foreground">{t('No lines added.')}</p>}
                                </div>
                            </section>
                        ))}
                        <div role="status" aria-live="polite" className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">صافي الراتب المتوقع — الأساسي + البدلات − الخصومات</p>
                            <p dir="ltr" className="mt-2 text-xl font-semibold text-start">{money(Number(activeItem?.base_salary || 0) + additions.reduce((sum, line) => sum + line.amount, 0) - deductions.reduce((sum, line) => sum + line.amount, 0), activeItem?.currency)}</p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setActiveItem(null)}>{t('Cancel')}</Button>
                            <Button type="submit">{t('Save Salary')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageTemplate>
    );
}
