type PayrollItem = {
    currency: string; base_salary: string | number; total_additions: string | number;
    total_deductions: string | number; net_salary: string | number;
};
type AmountField = 'base_salary' | 'total_additions' | 'total_deductions' | 'net_salary';

export function PayrollTotals({ items = [], field }: { items: PayrollItem[]; field: AmountField }) {
    const totals = items.reduce<Record<string, number>>((result, item) => {
        result[item.currency] = (result[item.currency] || 0) + Number(item[field] || 0);
        return result;
    }, {});
    return <span className="inline-flex max-w-full flex-col gap-1 overflow-x-auto">{Object.entries(totals).map(([currency, value]) => <bdi key={currency} dir="ltr" className="whitespace-nowrap">{new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'code' }).format(value)}</bdi>)}{!items.length && '—'}</span>;
}
