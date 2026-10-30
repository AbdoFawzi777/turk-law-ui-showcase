import { usePage } from '@inertiajs/react';
import { OrganizationFormPage } from '@/pages/administration/components/organization-form-page';

export default function BranchForm() {
    const { branch, managers } = usePage().props as any;

    return <OrganizationFormPage
        title="الفرع"
        description="إنشاء فرع للمكتب أو تحديثه."
        url="/branches"
        initialData={branch}
        listRoute="branches.index"
        storeRoute="branches.store"
        updateRoute="branches.update"
        fields={[
            { name: 'name_ar', label: 'الاسم بالعربية', type: 'text', required: true, width: '48%' },
            { name: 'name_en', label: 'الاسم بالإنجليزية', type: 'text', width: '48%' },
            { name: 'code', label: 'رمز الفرع', type: 'text', required: true, width: '48%' },
            { name: 'city', label: 'المدينة', type: 'text', width: '48%' },
            { name: 'region', label: 'المنطقة', type: 'text', width: '48%' },
            { name: 'phone', label: 'الهاتف', type: 'text', width: '48%' },
            { name: 'email', label: 'البريد الإلكتروني', type: 'email', width: '48%' },
            { name: 'manager_id', label: 'مدير الفرع', type: 'select', options: (managers || []).map((manager: any) => ({ value: String(manager.id), label: manager.name })), width: '48%' },
            { name: 'address', label: 'العنوان', type: 'textarea', width: '100%' },
            { name: 'notes', label: 'ملاحظات', type: 'textarea', width: '100%' },
            { name: 'status', label: 'الحالة', type: 'select', required: true, options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }], width: '48%' },
        ]}
    />;
}
