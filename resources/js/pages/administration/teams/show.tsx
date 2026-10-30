import { PageTemplate } from '@/components/page-template';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function TeamShow({ team }: { team: any }) {
    const { t } = useTranslation();
    return <PageTemplate title={team.name} description={t('Team profile and members.')} url={`/teams/${team.id}`} noPadding>
        <div className="space-y-5 p-5">
            <div className="grid gap-4 rounded-lg border bg-background p-5 sm:grid-cols-2 lg:grid-cols-4">
                <Info label={t('Branch')} value={team.branch?.name_ar || team.branch?.name_en} />
                <Info label={t('Department')} value={team.department?.name_ar || team.department?.name_en} />
                <Info label={t('Leader')} value={team.leader?.name} />
                <Info label={t('Status')} value={team.status} />
            </div>
            <section className="rounded-lg border bg-background">
                <h2 className="border-b px-5 py-4 text-sm font-semibold">{t('Members')}</h2>
                <div className="divide-y">{(team.members || []).map((member: any) => <div key={member.id} className="px-5 py-3 text-sm"><div className="font-medium">{member.name}</div><div className="text-xs text-muted-foreground">{member.email}</div></div>)}</div>
            </section>
            <Link href={route('teams.index')}><Button variant="outline">{t('Back to teams')}</Button></Link>
        </div>
    </PageTemplate>;
}

function Info({ label, value }: { label: string; value?: string | null }) {
    return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-sm font-medium">{value || '-'}</div></div>;
}
