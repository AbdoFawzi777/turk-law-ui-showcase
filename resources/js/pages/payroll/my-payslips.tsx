import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Download, WalletCards } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

type Payslip = {
    id: number;
    run: { id: number; name: string; year: number; month: number; status: 'approved' | 'paid'; paid_at: string | null };
    base_salary: string;
    total_additions: string;
    gross_salary: string;
    total_deductions: string;
    net_salary: string;
    currency: string;
};

const formatMoney = (amount: string, currency: string, locale: string) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return `${amount} ${currency}`;
    try {
        return new Intl.NumberFormat(locale.startsWith('ar') ? 'ar-SA' : 'en', {
            style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return `${amount} ${currency}`;
    }
};

export default function MyPayslips({ payslips, filters }: { payslips: any; filters: { year: string | number; month: string | number } }) {
    const { t, i18n } = useTranslation();
    const [year, setYear] = useState(String(filters.year || ''));
    const [month, setMonth] = useState(String(filters.month || ''));
    const applyFilters = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(route('payroll.my-payslips'), { year: year || undefined, month: month || undefined }, { preserveState: true, replace: true });
    };

    return (
        <PageTemplate title={t('My Payslips')} description={t('View your approved payroll statements.')} url={route('payroll.my-payslips')}>
            <div className="space-y-5" dir="auto">
                <Card>
                    <CardContent className="p-5">
                        <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="payslip-year">{t('Year')}</Label>
                                <Input id="payslip-year" inputMode="numeric" type="number" min="2000" max="2200" value={year} onChange={(event) => setYear(event.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="payslip-month">{t('Month')}</Label>
                                <Input id="payslip-month" inputMode="numeric" type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} />
                            </div>
                            <Button type="submit">{t('Apply filters')}</Button>
                            <Button type="button" variant="outline" onClick={() => { setYear(''); setMonth(''); router.get(route('payroll.my-payslips')); }}>{t('Clear filters')}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="divide-y p-0">
                        {(payslips.data as Payslip[]).map((slip) => (
                            <article key={slip.id} className="space-y-3 p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <WalletCards aria-hidden="true" className="h-5 w-5 text-primary" />
                                        <div>
                                            <h2 className="font-semibold">{slip.run.name}</h2>
                                            <p className="text-sm text-muted-foreground">{slip.run.year} / {String(slip.run.month).padStart(2, '0')}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-muted px-3 py-1 text-sm">{t(slip.run.status)}</span>
                                </div>
                                <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                    <div><dt className="text-muted-foreground">{t('Gross pay')}</dt><dd className="font-medium">{formatMoney(slip.gross_salary, slip.currency, i18n.language)}</dd></div>
                                    <div><dt className="text-muted-foreground">{t('Additions')}</dt><dd>{formatMoney(slip.total_additions, slip.currency, i18n.language)}</dd></div>
                                    <div><dt className="text-muted-foreground">{t('Deductions')}</dt><dd>{formatMoney(slip.total_deductions, slip.currency, i18n.language)}</dd></div>
                                    <div><dt className="text-muted-foreground">{t('Net pay')}</dt><dd className="font-semibold">{formatMoney(slip.net_salary, slip.currency, i18n.language)}</dd></div>
                                </dl>
                                <Button asChild variant="outline" size="sm">
                                    <a href={route('payroll.my-payslips.download', slip.id)}><Download aria-hidden="true" className="me-2 h-4 w-4" />{t('Download payslip')}</a>
                                </Button>
                            </article>
                        ))}
                        {!payslips.data.length && <div className="p-10 text-center text-sm text-muted-foreground">{t('No approved payslips are available for this period.')}</div>}
                    </CardContent>
                </Card>

                {payslips.links?.length > 3 && <nav aria-label={t('Payslip pages')} className="flex flex-wrap gap-2">
                    {payslips.links.map((link: any, index: number) => link.url
                        ? <Link key={index} href={link.url} preserveScroll className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        : <span key={index} className="rounded border px-3 py-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: link.label }} />)}
                </nav>}
            </div>
        </PageTemplate>
    );
}
