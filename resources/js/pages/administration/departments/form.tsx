import { usePage } from '@inertiajs/react';
import { OrganizationFormPage } from '@/pages/administration/components/organization-form-page';

export default function DepartmentForm() {
    const { department, branches, managers } = usePage().props as any;

    return <OrganizationFormPage
        title="القسم"
        description="إنشاء قسم للمكتب أو تحديثه."
        url="/departments"
        initialData={department}
        listRoute="departments.index"
        storeRoute="departments.store"
        updateRoute="departments.update"
        fields={[
            { name: 'name_ar', label: 'الاسم بالعربية', type: 'text', required: true, width: '48%' },
            { name: 'name_en', label: 'الاسم بالإنجليزية', type: 'text', width: '48%' },
            { name: 'code', label: 'رمز القسم', type: 'text', required: true, width: '48%' },
            { name: 'branch_id', label: 'الفرع', type: 'select', required: true, options: (branches || []).map((branch: any) => ({ value: String(branch.id), label: branch.name_ar })), width: '48%' },
            { name: 'manager_id', label: 'مدير القسم', type: 'select', options: (managers || []).map((manager: any) => ({ value: String(manager.id), label: manager.name })), width: '48%' },
            { name: 'description', label: 'الوصف', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
