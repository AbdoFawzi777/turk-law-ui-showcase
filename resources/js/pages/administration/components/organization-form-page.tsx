import { CrudFormModal } from '@/components/CrudFormModal';
import { PageTemplate } from '@/components/page-template';
import { router } from '@inertiajs/react';
import type { FormField } from '@/types/crud';
import { useTranslation } from 'react-i18next';

type OrganizationFormPageProps = {
    title: string;
    description: string;
    url: string;
    initialData?: any;
    fields: FormField[];
    listRoute: string;
    storeRoute: string;
    updateRoute: string;
};

export function OrganizationFormPage({
    title,
    description,
    url,
    initialData,
    fields,
    listRoute,
    storeRoute,
    updateRoute,
}: OrganizationFormPageProps) {
    const { t } = useTranslation();
    const mode = initialData?.id ? 'edit' : 'create';

    const submit = (data: any) => {
        const options = {
            onSuccess: () => router.get(route(listRoute)),
            preserveScroll: true,
        };

        if (mode === 'edit') {
            router.put(route(updateRoute, initialData.id), data, options);
        } else {
            router.post(route(storeRoute), data, options);
        }
    };

    return (
        <PageTemplate title={t(title)} description={t(description)} url={url} noPadding>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-muted-foreground">{t('Complete the organization details and save to continue.')}</p>
            </div>
            <CrudFormModal
                isOpen
                onClose={() => router.get(route(listRoute))}
                onSubmit={submit}
                formConfig={{ fields, columns: 2, layout: 'grid', modalSize: 'xl' }}
                initialData={initialData || { status: 'active' }}
                title={mode === 'edit' ? t('Edit') : t('Add')}
                mode={mode}
            />
        </PageTemplate>
    );
}
