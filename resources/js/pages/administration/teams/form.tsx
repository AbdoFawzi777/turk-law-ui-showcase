import { usePage } from '@inertiajs/react';
import { OrganizationFormPage } from '@/pages/administration/components/organization-form-page';

export default function TeamForm() {
    const { team, branches, departments, leaders, members } = usePage().props as any;

    return <OrganizationFormPage
        title="الفريق"
        description="إنشاء فريق عمل متخصص أو تحديثه."
        url="/teams"
        initialData={team ? { ...team, member_ids: (team.members || []).map((member: any) => String(member.id)) } : undefined}
        listRoute="teams.index"
        storeRoute="teams.store"
        updateRoute="teams.update"
        fields={[
            { name: 'name', label: 'اسم الفريق', type: 'text', required: true, width: '48%' },
            { name: 'branch_id', label: 'الفرع', type: 'select', required: true, options: (branches || []).map((branch: any) => ({ value: String(branch.id), label: branch.name_ar })), width: '48%' },
            { name: 'department_id', label: 'القسم', type: 'select', required: true, options: (departments || []).map((department: any) => ({ value: String(department.id), label: department.name_ar })), width: '48%' },
            { name: 'leader_id', label: 'قائد الفريق', type: 'select', options: (leaders || []).map((leader: any) => ({ value: String(leader.id), label: leader.name })), width: '48%' },
            { name: 'member_ids', label: 'أعضاء الفريق', type: 'multi-select', options: (members || []).map((member: any) => ({ value: String(member.id), label: member.name })), width: '100%' },
            { name: 'description', label: 'الوصف', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
