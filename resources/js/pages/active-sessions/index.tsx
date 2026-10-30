import { PageTemplate } from '@/components/page-template';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { Monitor, Smartphone, ShieldOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ActiveSessionsIndex() {
    const { t } = useTranslation();
    const { sessions, currentSessionId, filters = {} } = usePage().props as any;
    return <PageTemplate title={t('Active Sessions')} description={t('Review devices that currently have access to your company account.')} url="/active-sessions" noPadding>
        <div className="divide-y rounded-lg border bg-background">
            {(sessions?.data || []).map((session: any) => <div key={session.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-md border p-2 text-muted-foreground">{session.device === 'Mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}</div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">{session.browser || t('Unknown browser')}{session.session_id === currentSessionId && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{t('Current session')}</span>}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{session.user?.name} · {session.ip || '—'} · {session.last_activity}</div>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.delete(route('active-sessions.destroy', session.id), { preserveScroll: true })}><ShieldOff />{t('End session')}</Button>
            </div>)}
            {(sessions?.data || []).length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">{t('No active sessions.')}</div>}
        </div>
        <Pagination from={sessions?.from || 0} to={sessions?.to || 0} total={sessions?.total || 0} links={sessions?.links} entityName={t('sessions')} onPageChange={(url) => router.get(url)} currentPerPage={String(filters.per_page || 10)} onPerPageChange={(value) => router.get(route('active-sessions.index'), { ...filters, per_page: value, page: 1 })} />
    </PageTemplate>;
}
