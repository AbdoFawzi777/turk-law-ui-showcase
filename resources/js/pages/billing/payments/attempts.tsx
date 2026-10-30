import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

type Attempt = {
    attempt_id: string;
    invoice_reference: string | null;
    provider: string;
    amount: string;
    currency: string;
    status: string;
    created_at: string | null;
    reason: string;
    can_recheck: boolean;
};

export default function PaymentAttempts({ attempts, filters }: { attempts: any; filters: { provider: string } }) {
    const { t } = useTranslation();
    const [provider, setProvider] = useState(filters.provider || '');
    const [reviewReason, setReviewReason] = useState('scheduled_review');

    const applyProvider = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(route('billing.payments.attempts.index'), { provider: provider || undefined }, { preserveState: true, replace: true });
    };

    const recheck = (attempt: Attempt) => {
        if (!window.confirm(t('Recheck this attempt with the payment provider? Unconfirmed outcomes will remain reserved.'))) return;
        router.post(route('billing.payments.attempts.recheck', attempt.attempt_id), { review_reason: reviewReason }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const message = (page.props.flash as any)?.payment_attempt_review;
                if (message) toast.success(message);
            },
            onError: (errors) => toast.error(Object.values(errors).join(', ')),
        });
    };

    const rows = (attempts?.data || []) as Attempt[];
    return (
        <PageTemplate
            title={t('Unresolved invoice payment attempts')}
            description={t('Review reserved payments. Uncertain results remain reserved until verified.')}
            url={route('billing.payments.attempts.index')}
            breadcrumbs={[
                { title: t('Dashboard'), href: route('dashboard') },
                { title: t('Payments'), href: route('billing.payments.index') },
                { title: t('Unresolved attempts') },
            ]}
        >
            <div className="space-y-4" dir="auto">
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={applyProvider} className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="attempt-provider">{t('Payment provider')}</Label>
                                <select id="attempt-provider" className="h-10 rounded-md border bg-background px-3" value={provider} onChange={(event) => setProvider(event.target.value)}>
                                    <option value="">{t('All providers')}</option>
                                    <option value="tap">Tap</option>
                                    <option value="payfast">PayFast</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="razorpay">Razorpay</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="review-reason">{t('Review reason')}</Label>
                                <select id="review-reason" className="h-10 rounded-md border bg-background px-3" value={reviewReason} onChange={(event) => setReviewReason(event.target.value)}>
                                    <option value="scheduled_review">{t('Scheduled reconciliation review')}</option>
                                    <option value="provider_dashboard_checked">{t('Provider dashboard checked')}</option>
                                    <option value="provider_support_confirmation">{t('Provider support confirmation')}</option>
                                </select>
                            </div>
                            <Button type="submit" variant="outline">{t('Apply filters')}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        {rows.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">{t('No unresolved payment attempts.')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead className="border-b bg-muted/40 text-left">
                                        <tr>
                                            {[t('Attempt'), t('Invoice'), t('Provider'), t('Amount'), t('State'), t('Created'), t('Reason'), t('Action')].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((attempt) => (
                                            <tr key={attempt.attempt_id} className="border-b last:border-0">
                                                <td className="px-4 py-3 font-mono text-xs">{attempt.attempt_id}</td>
                                                <td className="px-4 py-3">{attempt.invoice_reference || '—'}</td>
                                                <td className="px-4 py-3">{attempt.provider}</td>
                                                <td className="px-4 py-3 tabular-nums">{attempt.amount} {attempt.currency}</td>
                                                <td className="px-4 py-3"><span className="rounded bg-amber-100 px-2 py-1 text-amber-900 dark:bg-amber-950 dark:text-amber-100">{t(attempt.status)}</span></td>
                                                <td className="px-4 py-3">{attempt.created_at ? new Date(attempt.created_at).toLocaleString() : '—'}</td>
                                                <td className="px-4 py-3 max-w-xs whitespace-normal">{attempt.reason}</td>
                                                <td className="px-4 py-3">
                                                    {attempt.can_recheck ? (
                                                        <Button type="button" size="sm" variant="outline" onClick={() => recheck(attempt)}>
                                                            <RefreshCw className="mr-2 h-4 w-4" />{t('Recheck')}
                                                        </Button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><AlertTriangle className="h-3.5 w-3.5" />{t('Await verified provider notification')}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {attempts?.last_page > 1 && (
                            <div className="flex items-center justify-between border-t p-4 text-sm">
                                <span>{t('Page')} {attempts.current_page} {t('of')} {attempts.last_page}</span>
                                <div className="flex gap-2">
                                    {attempts.prev_page_url && <Button asChild size="sm" variant="outline"><Link href={attempts.prev_page_url}>{t('Previous')}</Link></Button>}
                                    {attempts.next_page_url && <Button asChild size="sm" variant="outline"><Link href={attempts.next_page_url}>{t('Next')}</Link></Button>}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
