import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Check, FileText, Plus, Settings2, X } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

type ExpenseForm = { office_expense_category_id: string; amount: string; expense_date: string; description: string; receipt_file: File | null; notes: string };
const statusLabels: Record<string, string> = { approved: 'معتمد', pending: 'بانتظار الاعتماد', rejected: 'مرفوض' };
const statusStyles: Record<string, string> = { approved: 'bg-emerald-50 text-emerald-700', pending: 'bg-amber-50 text-amber-700', rejected: 'bg-red-50 text-red-700' };
const selectClass = 'h-10 w-full rounded-md border bg-background px-3 text-sm';

export default function OfficeExpensesIndex({ expenses, categories, approvalThreshold, stats, filters, permissions, currency, companyCurrency, availableCurrencies }: any) {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const emptyForm = (): ExpenseForm => ({ office_expense_category_id: String(categories?.[0]?.id || ''), amount: '', expense_date: new Date().toISOString().slice(0, 10), description: '', receipt_file: null, notes: '' });
    const [form, setForm] = useState<ExpenseForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const money = (value: number | string, code = currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: code, currencyDisplay: 'code' }).format(Number(value || 0));
    const openCreate = () => { setEditing(null); setForm(emptyForm()); setErrors({}); setIsCreateOpen(true); };
    const openEdit = (expense: any) => { setIsCreateOpen(false); setEditing(expense); setErrors({}); setForm({ office_expense_category_id: String(expense.office_expense_category_id), amount: expense.amount, expense_date: expense.expense_date.slice(0, 10), description: expense.description, receipt_file: null, notes: expense.notes || '' }); };
    const close = () => { setIsCreateOpen(false); setEditing(null); };
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const validation: Record<string, string> = {};
        if (!form.office_expense_category_id) validation.category = 'اختر فئة المصروف.';
        if (!(Number(form.amount) > 0)) validation.amount = 'أدخل مبلغًا أكبر من صفر.';
        if (!form.expense_date) validation.date = 'أدخل تاريخ المصروف.';
        if (!form.description.trim()) validation.description = 'أدخل وصف المصروف.';
        if (!editing && !form.receipt_file) validation.receipt_file = 'الإيصال مطلوب: أرفق صورة أو ملف PDF حتى 5 ميجابايت.';
        setErrors(validation);
        if (Object.keys(validation).length) return;
        setProcessing(true);
        router.post(editing ? route('office-expenses.update', editing.id) : route('office-expenses.store'), editing ? { ...form, _method: 'put' } : form, {
            forceFormData: true, onSuccess: close, onError: setErrors, onFinish: () => setProcessing(false),
        });
    };
    const applyFilter = (key: string, value: string) => router.get(route('office-expenses.index'), { ...filters, currency, [key]: value || undefined }, { preserveState: true, preserveScroll: true });
    const statEntries = [{ label: t('Total Office Expenses'), value: stats.total }, { label: 'المصروفات المعتمدة', value: stats.approved }, { label: 'بانتظار الاعتماد', value: stats.pending }, { label: 'حد الاعتماد', value: approvalThreshold, code: companyCurrency }];
    return <PageTemplate title={t('Office Expenses')} description={t('Track operating expenses for the office separately from case expenses.')} url="/office-expenses" breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Office Expenses') }]} actions={[
        ...(permissions.canCreate ? [{ label: t('Add Office Expense'), icon: <Plus className="h-4 w-4" />, onClick: openCreate }] : []),
        ...(permissions.canManageSettings ? [{ label: t('Expense Settings'), icon: <Settings2 className="h-4 w-4" />, onClick: () => router.get(route('office-expenses.settings')) }] : []),
        ...(permissions.canViewReports ? [{ label: t('Financial Report'), icon: <FileText className="h-4 w-4" />, onClick: () => router.get(route('office-expenses.reports')) }] : []),
    ]}>
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statEntries.map(({ label, value, code }) => <Card key={label}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold"><bdi dir="ltr">{money(value, code || currency)}</bdi></p></CardContent></Card>)}</div>
            <Card><CardHeader><CardTitle>{t('Office Operating Expenses')}</CardTitle></CardHeader><CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <Input aria-label="البحث في المصروفات" placeholder="البحث في المصروفات…" defaultValue={filters.search || ''} onKeyDown={(e) => { if (e.key === 'Enter') applyFilter('search', e.currentTarget.value); }} />
                    <select aria-label="نوع المصروف" className={selectClass} value={filters.type || ''} onChange={(e) => applyFilter('type', e.target.value)}><option value="">جميع الأنواع</option><option value="government">مصروف حكومي</option><option value="other">مصروف آخر</option></select>
                    <select aria-label="حالة المصروف" className={selectClass} value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)}><option value="">جميع الحالات</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                    <select aria-label="فئة المصروف" className={selectClass} value={filters.office_expense_category_id || ''} onChange={(e) => applyFilter('office_expense_category_id', e.target.value)}><option value="">جميع الفئات</option>{categories.map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
                    <select aria-label="عملة المصروفات" className={selectClass} value={currency} onChange={(e) => applyFilter('currency', e.target.value)}>{availableCurrencies.map((code: string) => <option key={code} value={code}>{code}</option>)}</select>
                </div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr>{['التاريخ', 'الفئة', 'الوصف', 'المبلغ', 'الحالة', 'الإجراءات'].map((label) => <th key={label} className="p-3 text-start">{label}</th>)}</tr></thead><tbody>
                    {expenses.data.map((expense: any) => <tr key={expense.id} className="border-b last:border-0">
                        <td className="whitespace-nowrap p-3"><time dateTime={expense.expense_date.slice(0, 10)}>{new Date(expense.expense_date.slice(0, 10) + 'T12:00:00').toLocaleDateString('ar-EG')}</time></td>
                        <td className="p-3">{expense.category?.name}</td><td className="max-w-xs p-3">{expense.description}</td><td className="p-3 font-semibold"><bdi dir="ltr">{money(expense.amount, expense.currency || companyCurrency)}</bdi></td><td className="p-3"><span className={'rounded-full px-2 py-1 text-xs ' + statusStyles[expense.status]}>{statusLabels[expense.status]}</span></td>
                        <td className="p-3"><div className="flex justify-end gap-1">
                            {expense.receipt_file && <a href={expense.receipt_file} target="_blank" rel="noreferrer" className="rounded p-2 hover:bg-muted" aria-label="عرض الإيصال"><FileText className="h-4 w-4" /></a>}
                            {expense.status === 'pending' && permissions.canApprove && <><Button size="sm" variant="ghost" aria-label="اعتماد" onClick={() => router.post(route('office-expenses.approve', expense.id), {}, { preserveScroll: true })}><Check className="h-4 w-4 text-emerald-600" /></Button><Button size="sm" variant="ghost" aria-label="رفض" onClick={() => router.post(route('office-expenses.reject', expense.id), { reason: '' }, { preserveScroll: true })}><X className="h-4 w-4 text-red-600" /></Button></>}
                            {expense.status === 'pending' && permissions.canEdit && <Button size="sm" variant="outline" onClick={() => openEdit(expense)}>تعديل</Button>}
                            {expense.status === 'pending' && permissions.canDelete && <Button size="sm" variant="ghost" onClick={() => { if (window.confirm('حذف هذا المصروف؟')) router.delete(route('office-expenses.destroy', expense.id), { preserveScroll: true }); }}>حذف</Button>}
                        </div></td>
                    </tr>)}
                </tbody></table>{!expenses.data.length && <p className="p-10 text-center text-muted-foreground">لا توجد مصروفات مطابقة.</p>}</div>
                {expenses.last_page > 1 && <div className="flex items-center justify-between"><Button variant="outline" disabled={!expenses.prev_page_url} onClick={() => router.get(expenses.prev_page_url)}>السابق</Button><span>{expenses.current_page} / {expenses.last_page}</span><Button variant="outline" disabled={!expenses.next_page_url} onClick={() => router.get(expenses.next_page_url)}>التالي</Button></div>}
            </CardContent></Card>
        </div>
        <Dialog open={isCreateOpen || !!editing} onOpenChange={(open) => { if (!open) close(); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>{editing ? 'تعديل مصروف المكتب' : 'إضافة مصروف المكتب'}</DialogTitle><DialogDescription>مصروفات المكتب مستقلة عن القضايا. العملة: {editing?.currency || companyCurrency}.</DialogDescription></DialogHeader>
            <form onSubmit={submit} noValidate className="space-y-4">
                {Object.keys(errors).length > 0 && <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{Object.values(errors).join(' ')}</div>}
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="expense-category">الفئة *</Label><select id="expense-category" required className={selectClass} value={form.office_expense_category_id} onChange={(e) => setForm({ ...form, office_expense_category_id: e.target.value })}><option value="">اختر الفئة</option>{categories.map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="space-y-2"><Label htmlFor="expense-amount">المبلغ *</Label><Input id="expense-amount" type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="expense-date">التاريخ *</Label><Input id="expense-date" type="date" required value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="expense-receipt">الإيصال{editing ? ' (اختياري عند التعديل)' : ' *'}</Label><Input id="expense-receipt" type="file" accept=".jpg,.jpeg,.png,.pdf" aria-describedby="receipt-help" required={!editing} onChange={(e) => setForm({ ...form, receipt_file: e.target.files?.[0] || null })} /><p id="receipt-help" className="text-xs text-muted-foreground">صورة JPG أو PNG أو ملف PDF حتى 5 ميجابايت.</p></div></div>
                <div className="space-y-2"><Label htmlFor="expense-description">الوصف *</Label><Input id="expense-description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="expense-notes">ملاحظات</Label><Input id="expense-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={close}>إلغاء</Button><Button type="submit" disabled={processing}>{processing ? 'جارٍ الحفظ…' : editing ? 'حفظ التغييرات' : 'إنشاء مصروف'}</Button></DialogFooter>
            </form>
        </DialogContent></Dialog>
    </PageTemplate>;
}
