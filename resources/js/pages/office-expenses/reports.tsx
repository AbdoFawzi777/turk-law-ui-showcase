import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

type Report = {
    revenue: number; direct_case_expenses: number; payroll_expenses: number;
    office_expenses: number; net_profit: number; currency: string;
    available_currencies: string[]; has_legacy_currency: boolean;
};

export default function OfficeExpenseReports({ report, year }: { report: Report; year: number }) {
    const { t } = useTranslation();
    const [selectedYear, setSelectedYear] = useState(String(year));
    const [currency, setCurrency] = useState(report.currency);
    const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: report.currency, currencyDisplay: 'code' }).format(value);
    const applyFilters = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(route('office-expenses.reports'), { year: selectedYear, currency });
    };
    const profitColor = report.net_profit < 0 ? 'text-red-700' : 'text-emerald-700';
    const entries = [
        { label: t('Office Revenue'), value: report.revenue, color: '' },
        { label: t('Case Expenses'), value: report.direct_case_expenses, color: 'text-red-700' },
        { label: t('Payroll'), value: report.payroll_expenses, color: 'text-red-700' },
        { label: t('Office Operating Expenses'), value: report.office_expenses, color: 'text-red-700' },
        { label: t('Net Office Profit'), value: report.net_profit, color: profitColor },
    ];

    return <PageTemplate title={t('Office Financial Report')} description={t('Profit and loss view including approved office operating expenses.')} url="/office-expenses/reports" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Office Expenses'), href: route('office-expenses.index') }, { title: t('Financial Report') }]}>
        <div className="space-y-6">
            <Card><CardContent className="space-y-4 p-5">
                <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-4">
                    <div className="space-y-2"><Label htmlFor="report-year">{t('Report Year')}</Label>
                        <select id="report-year" className="h-10 rounded-md border bg-background px-3" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {Array.from({ length: 101 }, (_, index) => 2100 - index).map((value) => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="report-currency">عملة التقرير</Label>
                        <select id="report-currency" className="h-10 rounded-md border bg-background px-3" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            {report.available_currencies.map((value) => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </div>
                    <Button type="submit">عرض التقرير</Button>
                </form>
                <p className="text-sm text-muted-foreground">تُعرض كل عملة بشكل مستقل دون خلط أو تحويل. المصروفات المعتمدة فقط تدخل التقرير.</p>
                {report.has_legacy_currency && <p role="note" className="text-sm text-amber-800">المصروفات القديمة التي لم تُسجّل لها عملة تُعرض بعملة المكتب الحالية.</p>}
            </CardContent></Card>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {entries.map(({ label, value, color }) => <Card key={label}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className={'mt-2 overflow-x-auto whitespace-nowrap text-xl font-semibold 2xl:text-2xl ' + color}><bdi dir="ltr">{money(value)}</bdi></p></CardContent></Card>)}
            </div>
            <Card><CardContent className="p-6">
                <h2 className="text-lg font-semibold">{t('Profit and Loss Formula')}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{t('Revenue - direct case expenses - payroll - approved office operating expenses = net office profit')}</p>
                <div className="mt-5 grid gap-3">
                    {entries.map(({ label, value, color }, index) => <div key={label} className={'flex flex-wrap items-center justify-between gap-2 ' + (index === 4 ? 'pt-1 text-lg' : 'border-b pb-3')}><span>{index > 0 && index < 4 ? '− ' : ''}{label}</span><bdi dir="ltr" className={'font-semibold ' + color}>{money(value)}</bdi></div>)}
                </div>
            </CardContent></Card>
        </div>
    </PageTemplate>;
}
