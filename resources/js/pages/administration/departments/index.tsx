import { OrganizationTablePage } from '@/pages/administration/components/organization-table-page';
import { usePage } from '@inertiajs/react';

export default function DepartmentsIndex() {
    const { departments, branches, managers, filters } = usePage().props as any;
    return <OrganizationTablePage
        title="الأقسام"
        description="تنظيم العمل القانوني والتشغيلي حسب القسم."
        url="/departments"
        entity="departments"
        data={departments}
        filters={filters}
        listRoute="departments.index"
        storeRoute="departments.store"
        updateRoute="departments.update"
        showRoute="departments.show"
        toggleRoute="departments.toggle-status"
        viewPermission="view-departments"
        createPermission="create-departments"
        editPermission="edit-departments"
        togglePermission="toggle-status-departments"
        columns={[
            { key: 'name_ar', label: 'القسم', sortable: true },
            { key: 'branch.name_ar', label: 'الفرع' },
            { key: 'manager.name', label: 'مدير القسم' },
            { key: 'teams_count', label: 'الفرق' },
            { key: 'users_count', label: 'المستخدمون' },
            { key: 'status', label: 'الحالة', type: 'badge' },
        ]}
        formFields={[
            { name: 'name_ar', label: 'الاسم بالعربية', type: 'text', required: true, width: '48%' },
            { name: 'name_en', label: 'الاسم بالإنجليزية', type: 'text', width: '48%' },
            { name: 'code', label: 'رمز القسم', type: 'text', required: true, width: '48%' },
            { name: 'branch_id', label: 'الفرع', type: 'select', required: true, options: (branches || []).map((branch: any) => ({ value: String(branch.id), label: branch.name_ar })) , width: '48%' },
            { name: 'manager_id', label: 'القسم manager', type: 'select', options: (managers || []).map((manager: any) => ({ value: String(manager.id), label: manager.name })) , width: '48%' },
            { name: 'description', label: 'الوصف', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
