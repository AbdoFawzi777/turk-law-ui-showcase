import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Calendar, ShieldCheck, Building2, BriefcaseBusiness } from 'lucide-react';

interface ViewProps {
    record: any;
}

export default function View({ record }: ViewProps) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<'overview' | 'organization' | 'security'>('overview');

    return (
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0" onOpenAutoFocus={(event) => event.preventDefault()}>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">{t('User Profile')}</DialogTitle>
                </div>
            </DialogHeader>

            <div className="border-b px-6 pt-3">
                <div role="tablist" aria-label={t('User profile sections')} className="flex gap-5 overflow-x-auto">
                    {[
                        ['overview', t('Overview')],
                        ['organization', t('Organization')],
                        ['security', t('Security')],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            role="tab"
                            aria-selected={tab === value}
                            onClick={() => setTab(value as typeof tab)}
                            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${tab === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 py-5 pb-6">
                {tab === 'overview' && <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <ProfileField icon={<User className="h-4 w-4" />} label={t('Name')} value={record.name} />
                        <ProfileField icon={<Mail className="h-4 w-4" />} label={t('Email')} value={record.email} />
                        <ProfileField icon={<BriefcaseBusiness className="h-4 w-4" />} label={t('Job Title')} value={record.job_title} />
                        <ProfileField icon={<Calendar className="h-4 w-4" />} label={t('Joined')} value={record.join_date || record.created_at} />
                    </div>
                    <RoleList roles={record.roles} label={t('Roles')} />
                </div>}

                {tab === 'organization' && <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <ProfileField icon={<Building2 className="h-4 w-4" />} label={t('Branch')} value={record.branch?.name_ar || record.branch?.name_en} />
                    <ProfileField icon={<Building2 className="h-4 w-4" />} label={t('Department')} value={record.department?.name_ar || record.department?.name_en} />
                    <ProfileField icon={<BriefcaseBusiness className="h-4 w-4" />} label={t('Team')} value={record.team?.name} />
                    <ProfileField icon={<User className="h-4 w-4" />} label={t('Direct Manager')} value={record.direct_manager?.name} />
                    <ProfileField icon={<Mail className="h-4 w-4" />} label={t('Phone')} value={record.phone} />
                </div>}

                {tab === 'security' && <div className="space-y-4">
                    <ProfileField icon={<Lock className="h-4 w-4" />} label={t('Account Status')} value={record.status || 'active'} />
                    <ProfileField icon={<ShieldCheck className="h-4 w-4" />} label={t('Login Access')} value={Number(record.is_enable_login) === 0 ? t('Disabled') : t('Enabled')} />
                    <RoleList roles={record.roles} label={t('Assigned Permissions Through Roles')} />
                </div>}
            </div>
        </DialogContent>
    );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    return <div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">{icon}{label}</div>
        <p className="mt-1 text-sm font-medium text-foreground">{value || '-'}</p>
    </div>;
}

function RoleList({ roles, label }: { roles?: any[]; label: string }) {
    return <div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><ShieldCheck className="h-4 w-4" />{label}</div>
        <div className="mt-2 flex flex-wrap gap-2">
            {roles?.length ? roles.map((role: any) => <span key={role.id} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{role.label || role.name}</span>) : <span className="text-sm text-muted-foreground">-</span>}
        </div>
    </div>;
}
