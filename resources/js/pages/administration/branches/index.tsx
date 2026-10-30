import { OrganizationTablePage } from '@/pages/administration/components/organization-table-page';
import { usePage } from '@inertiajs/react';

export default function BranchesIndex() {
    const { branches, managers, filters } = usePage().props as any;
    return <OrganizationTablePage
        title="الفروع"
        description="إدارة مكاتب المؤسسة ومواقع عملها."
        url="/branches"
        entity="branches"
        data={branches}
        filters={filters}
        listRoute="branches.index"
        storeRoute="branches.store"
        updateRoute="branches.update"
        showRoute="branches.show"
        toggleRoute="branches.toggle-status"
        viewPermission="view-branches"
        createPermission="create-branches"
        editPermission="edit-branches"
        togglePermission="toggle-status-branches"
        columns={[
            { key: 'name_ar', label: 'الفرع', sortable: true },
            { key: 'city', label: 'المدينة' },
            { key: 'manager.name', label: 'مدير الفرع' },
            { key: 'departments_count', label: 'الأقسام' },
            { key: 'users_count', label: 'المستخدمون' },
            { key: 'status', label: 'الحالة', type: 'badge' },
        ]}
        formFields={[
            { name: 'name_ar', label: 'الاسم بالعربية', type: 'text', required: true, width: '48%' },
            { name: 'name_en', label: 'الاسم بالإنجليزية', type: 'text', width: '48%' },
            { name: 'code', label: 'رمز الفرع', type: 'text', required: true, width: '48%' },
            { name: 'city', label: 'المدينة', type: 'text', width: '48%' },
            { name: 'region', label: 'المنطقة', type: 'text', width: '48%' },
            { name: 'phone', label: 'الهاتف', type: 'text', width: '48%' },
            { name: 'email', label: 'البريد الإلكتروني', type: 'email', width: '48%' },
            { name: 'manager_id', label: 'الفرع manager', type: 'select', options: (managers || []).map((manager: any) => ({ value: String(manager.id), label: manager.name })) , width: '48%' },
            { name: 'address', label: 'العنوان', type: 'textarea', width: '100%' },
            { name: 'notes', label: 'ملاحظات', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
