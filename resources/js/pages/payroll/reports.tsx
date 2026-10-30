import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTemplate } from '@/components/page-template';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PayrollTotals } from '@/components/payroll-totals';

export default function PayrollReports({ runs }: any) {
    const { t } = useTranslation();
    return (
        <PageTemplate
            title={t('Payroll Reports')}
            description={t('Total payroll expense for approved and paid internal payroll runs.')}
            url="/payroll/reports"
            breadcrumbs={[
                { title: t('Dashboard'), href: route('dashboard') },
                { title: t('Payroll'), href: route('payroll.runs.index') },
                { title: t('Reports') },
            ]}
        >
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        [t('Base Salaries'), 'base_salary', ''],
                        [t('Additions'), 'total_additions', 'text-emerald-700'],
                        [t('Deductions'), 'total_deductions', 'text-red-700'],
                        [t('Total Payroll Expense'), 'net_salary', 'text-primary'],
                    ].map(([label, value, color]) => (
                        <Card key={String(label)}>
                            <CardContent className="p-5">
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className={'mt-2 text-2xl font-semibold ' + color}><PayrollTotals items={(runs || []).flatMap((run: any) => run.items || [])} field={value as 'base_salary' | 'total_additions' | 'total_deductions' | 'net_salary'} /></p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card>
                    <CardHeader><CardTitle>{t('Approved Payroll Runs')}</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="p-3 text-start">{t('Run')}</th>
                                    <th className="p-3 text-start">{t('Status')}</th>
                                    <th className="p-3 text-start">{t('Net Payroll')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(runs || []).map((run: any) => (
                                    <tr key={run.id} className="border-b last:border-0">
                                        <td className="p-3"><Link className="text-primary hover:underline" href={route('payroll.runs.show', run.id)}>{run.name}</Link></td>
                                        <td className="p-3">{run.status}</td>
                                        <td className="p-3 font-semibold"><PayrollTotals items={run.items} field="net_salary" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!(runs || []).length && <p className="p-8 text-center text-sm text-muted-foreground">{t('No approved payroll runs yet.')}</p>}
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
