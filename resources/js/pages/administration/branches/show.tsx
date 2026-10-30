import { PageTemplate } from '@/components/page-template';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function BranchShow({ branch }: { branch: any }) {
    const { t } = useTranslation();
    return <PageTemplate title={branch.name_ar || branch.name_en} description={t('Branch profile and linked departments.')} url={`/branches/${branch.id}`} noPadding>
        <div className="space-y-5 p-5">
            <div className="grid gap-4 rounded-lg border bg-background p-5 sm:grid-cols-2 lg:grid-cols-4">
                <Info label={t('Code')} value={branch.code} />
                <Info label={t('City')} value={branch.city} />
                <Info label={t('Manager')} value={branch.manager?.name} />
                <Info label={t('Status')} value={branch.status} />
            </div>
            <section className="rounded-lg border bg-background">
                <h2 className="border-b px-5 py-4 text-sm font-semibold">{t('Departments')}</h2>
                <div className="divide-y">{(branch.departments || []).map((department: any) => <div key={department.id} className="flex items-center justify-between px-5 py-3 text-sm"><span>{department.name_ar || department.name_en}</span><span className="text-muted-foreground">{department.teams?.length || 0} {t('teams')}</span></div>)}</div>
            </section>
            <Link href={route('branches.index')}><Button variant="outline">{t('Back to branches')}</Button></Link>
        </div>
    </PageTemplate>;
}

function Info({ label, value }: { label: string; value?: string | null }) {
    return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-sm font-medium">{value || '-'}</div></div>;
}
