import { PageTemplate } from '@/components/page-template';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuditLogsIndex() {
    const { t } = useTranslation();
    const { auditLogs, filters = {} } = usePage().props as any;
    const [search, setSearch] = useState(filters.action || '');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(route('audit-logs.index'), { action: search || undefined, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    return <PageTemplate title={t('Audit Log')} description={t('A searchable, read-only record of sensitive administration activity.')} url="/audit-logs" noPadding>
        <div className="space-y-4">
            <form onSubmit={submit} className="flex flex-col gap-2 border-b bg-muted/20 p-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                    <label htmlFor="audit-action" className="text-xs font-medium text-muted-foreground">{t('Action')}</label>
                    <Input id="audit-action" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Filter by action')} />
                </div>
                <Button type="submit" variant="outline"><Search />{t('Search')}</Button>
            </form>
            <div className="divide-y rounded-lg border bg-background">
                {(auditLogs?.data || []).map((log: any) => {
                    const oldValues = log.old_values || {};
                    const newValues = log.new_values || {};
                    const keys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)]));
                    return <article key={log.id} className="p-4">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">{log.subject_user?.name || log.actor?.name || t('System activity')}</h2>
                                <p className="text-xs text-muted-foreground">{log.action} · {log.module}</p>
                            </div>
                            <time className="text-xs text-muted-foreground">{log.created_at}</time>
                        </div>
                        {keys.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {keys.map((key) => <div key={key} className="rounded-md bg-muted/30 px-3 py-2 text-xs">
                                <div className="font-medium">{key.replaceAll('_', ' ')}</div>
                                <div className="mt-1 text-muted-foreground"><span>{String(oldValues[key] ?? '—')}</span> <span aria-hidden>→</span> <span>{String(newValues[key] ?? '—')}</span></div>
                            </div>)}
                        </div>}
                    </article>;
                })}
                {(auditLogs?.data || []).length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">{t('No audit activity has been recorded yet.')}</div>}
            </div>
            <Pagination from={auditLogs?.from || 0} to={auditLogs?.to || 0} total={auditLogs?.total || 0} links={auditLogs?.links} entityName={t('audit events')} onPageChange={(url) => router.get(url)} currentPerPage={String(filters.per_page || 10)} onPerPageChange={(value) => router.get(route('audit-logs.index'), { ...filters, per_page: value, page: 1 })} />
        </div>
    </PageTemplate>;
}
