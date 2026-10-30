import { OrganizationTablePage } from '@/pages/administration/components/organization-table-page';
import { usePage } from '@inertiajs/react';

export default function TeamsIndex() {
    const { teams, branches, departments, leaders, filters } = usePage().props as any;
    return <OrganizationTablePage
        title="الفرق"
        description="إنشاء فرق عمل قانونية متخصصة داخل كل قسم."
        url="/teams"
        entity="teams"
        data={teams}
        filters={filters}
        listRoute="teams.index"
        storeRoute="teams.store"
        updateRoute="teams.update"
        showRoute="teams.show"
        toggleRoute="teams.toggle-status"
        viewPermission="view-teams"
        createPermission="create-teams"
        editPermission="edit-teams"
        togglePermission="toggle-status-teams"
        columns={[
            { key: 'name', label: 'الفريق', sortable: true },
            { key: 'branch.name_ar', label: 'الفرع' },
            { key: 'department.name_ar', label: 'القسم' },
            { key: 'leader.name', label: 'قائد الفريق' },
            { key: 'members_count', label: 'الأعضاء' },
            { key: 'status', label: 'الحالة', type: 'badge' },
        ]}
        formFields={[
            { name: 'name', label: 'اسم الفريق', type: 'text', required: true, width: '48%' },
            { name: 'branch_id', label: 'الفرع', type: 'select', required: true, options: (branches || []).map((branch: any) => ({ value: String(branch.id), label: branch.name_ar })) , width: '48%' },
            { name: 'department_id', label: 'القسم', type: 'select', required: true, options: (departments || []).map((department: any) => ({ value: String(department.id), label: department.name_ar })) , width: '48%' },
            { name: 'leader_id', label: 'قائد الفريق', type: 'select', options: (leaders || []).map((leader: any) => ({ value: String(leader.id), label: leader.name })) , width: '48%' },
            { name: 'description', label: 'الوصف', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
