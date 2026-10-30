import { PageTemplate } from '@/components/page-template';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Check, RotateCcw, Send, FileText, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';

const money = (value: number) =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(
    Number(value || 0)
  );

export default function LegalCollections() {
  const { invoices, clients, payments } = usePage().props as any;
  const [form, setForm] = useState({
    client_id: '',
    amount: '',
    currency: 'SAR',
    payment_method: 'bank_transfer',
    payment_date: new Date().toISOString().slice(0, 10),
    reference: '',
    invoice_id: '',
  });

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'ready' | 'posted' | 'rejected'>('all');

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const record = () => {
    if (!form.client_id || !form.amount) return;
    router.post(route('legal-billing.payments.store'), form, {
      onSuccess: () => {
        setForm({
          client_id: '',
          amount: '',
          currency: 'SAR',
          payment_method: 'bank_transfer',
          payment_date: new Date().toISOString().slice(0, 10),
          reference: '',
          invoice_id: '',
        });
      },
    });
  };

  const invoiceRows = invoices?.data || [];
  const paymentRows = payments || [];

  return (
    <PageTemplate
      title="التحصيل والاعتمادات"
      description="مسودة ← اعتماد المالك ← ترحيل المحاسب ← استحقاق الأتعاب والتسوية"
      url={route('legal-billing.collections')}
    >
      <div className="space-y-6 text-start" dir="rtl">
        {/* Form Panel: تسجيل تحصيل جديد matching Image 2 */}
        <div className="panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-base font-bold text-foreground">تسجيل تحصيل جديد</h2>
            <span className="text-xs text-muted-foreground">دورة الاعتماد السريع</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                الموكل / العميل
              </label>
              <select
                className="field"
                value={form.client_id}
                onChange={(e) => update('client_id', e.target.value)}
              >
                <option value="">اختر الموكل...</option>
                {clients?.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">المبلغ</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="field num"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">العملة</label>
              <select
                className="field"
                value={form.currency}
                onChange={(e) => update('currency', e.target.value)}
              >
                <option value="SAR">SAR — ريال سعودي</option>
                <option value="EGP">EGP — جنيه مصري</option>
                <option value="AED">AED — درهم إماراتي</option>
                <option value="USD">USD — دولار أمريكي</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                طريقة الدفع
              </label>
              <select
                className="field"
                value={form.payment_method}
                onChange={(e) => update('payment_method', e.target.value)}
              >
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="cash">نقداً</option>
                <option value="card">مدى / بطاقة</option>
                <option value="check">شيك</option>
                <option value="instapay">Instapay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                رقم العملية / الإيصال
              </label>
              <input
                type="text"
                placeholder="TRX-..."
                className="field num"
                value={form.reference}
                onChange={(e) => update('reference', e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Info Bar & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/80">
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground flex-wrap">
              <span>
                سعر الصرف المقفل: <strong className="num text-foreground">1.0</strong>
              </span>
              <span>
                القيمة بالريال:{' '}
                <strong className="num text-foreground">
                  {form.amount ? Number(form.amount).toLocaleString('ar-SA') : 0} ر.س
                </strong>
              </span>
              <span>
                المرجع المحاسبي:{' '}
                <strong className="text-foreground">{form.reference || 'تلقائي'}</strong>
              </span>
            </div>

            <button
              onClick={record}
              disabled={!form.client_id || !form.amount}
              className="btn cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>إرسال للاعتماد</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills matching Image 2 */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: `الكل (${invoiceRows.length + paymentRows.length})` },
            { id: 'pending', label: 'بانتظار المالك (1)' },
            { id: 'ready', label: 'جاهز للترحيل (1)' },
            { id: 'posted', label: `مُرحل (${paymentRows.length || 3})` },
            { id: 'rejected', label: 'مرفوض (0)' },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Collections & Approvals Table matching Image 2 */}
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="text-start">رقم</th>
                  <th className="text-start">الموكل</th>
                  <th className="text-start">القضية / الخدمة</th>
                  <th className="text-start">المبلغ</th>
                  <th className="text-start">السعر</th>
                  <th className="text-start">بالريال</th>
                  <th className="text-start">الطريقة</th>
                  <th className="text-center">الحالة</th>
                  <th className="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Demo & Live rows reflecting the workflow */}
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1005</td>
                  <td className="font-semibold text-foreground">سارة الشهري</td>
                  <td className="text-muted-foreground">استشارات قضائية شاملة</td>
                  <td className="num font-semibold text-foreground">SAR 1,100</td>
                  <td className="num text-muted-foreground">1.0</td>
                  <td className="num font-bold text-foreground">1,100 ر.س</td>
                  <td className="text-xs text-muted-foreground">تحويل بنكي</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted text-muted-foreground">
                      بانتظار الاعتماد
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button className="btn text-xs py-1 px-2.5">
                        <Check className="h-3 w-3" />
                        <span>اعتماد</span>
                      </button>
                      <button className="btn-ghost text-xs py-1 px-2">
                        <span>إعادة</span>
                      </button>
                      <button className="text-xs font-semibold text-destructive hover:underline px-1">
                        رفض
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1003</td>
                  <td className="font-semibold text-foreground">عمر الكردي</td>
                  <td className="text-muted-foreground">تحكيم تجاري دولي</td>
                  <td className="num font-semibold text-foreground">AED 450</td>
                  <td className="num text-muted-foreground">1.02</td>
                  <td className="num font-bold text-foreground">459 ر.س</td>
                  <td className="text-xs text-muted-foreground">بطاقة مدى</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                      جاهز للترحيل
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button className="btn-gold text-xs py-1 px-2.5">
                        <span>ترحيل</span>
                      </button>
                      <button className="btn-ghost text-xs py-1 px-2">
                        <span>استرداد</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {invoiceRows.map((inv: any, index: number) => (
                  <tr key={inv.id || index} className="hover:bg-muted/40 transition-colors">
                    <td className="num font-semibold text-muted-foreground">
                      {inv.invoice_number || `INV-${1000 + index}`}
                    </td>
                    <td className="font-semibold text-foreground">{inv.client?.name || 'موكل عام'}</td>
                    <td className="text-muted-foreground">{inv.case?.title || 'أتعاب مرحلة ابتدائية'}</td>
                    <td className="num font-semibold text-foreground">
                      {money(inv.total_amount || 5000)}
                    </td>
                    <td className="num text-muted-foreground">1.0</td>
                    <td className="num font-bold text-foreground">
                      {money(inv.balance_amount || inv.total_amount || 5000)}
                    </td>
                    <td className="text-xs text-muted-foreground">سند قبض</td>
                    <td className="text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                        مُرحل • معتمد
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn-ghost text-xs py-1 px-2">
                        <span>استرداد</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
