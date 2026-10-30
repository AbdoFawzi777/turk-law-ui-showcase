import { PageTemplate } from '@/components/page-template';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function DepartmentShow({ department }: { department: any }) {
    const { t } = useTranslation();
    return <PageTemplate title={department.name_ar || department.name_en} description={t('Department profile and linked teams.')} url={`/departments/${department.id}`} noPadding>
        <div className="space-y-5 p-5">
            <div className="grid gap-4 rounded-lg border bg-background p-5 sm:grid-cols-2 lg:grid-cols-4">
                <Info label={t('Code')} value={department.code} />
                <Info label={t('Branch')} value={department.branch?.name_ar || department.branch?.name_en} />
                <Info label={t('Manager')} value={department.manager?.name} />
                <Info label={t('Status')} value={department.status} />
            </div>
            <section className="rounded-lg border bg-background">
                <h2 className="border-b px-5 py-4 text-sm font-semibold">{t('Teams')}</h2>
                <div className="divide-y">{(department.teams || []).map((team: any) => <div key={team.id} className="flex items-center justify-between px-5 py-3 text-sm"><span>{team.name}</span><span className="text-muted-foreground">{team.leader?.name || '-'}</span></div>)}</div>
            </section>
            <Link href={route('departments.index')}><Button variant="outline">{t('Back to departments')}</Button></Link>
        </div>
    </PageTemplate>;
}

function Info({ label, value }: { label: string; value?: string | null }) {
    return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-sm font-medium">{value || '-'}</div></div>;
}
