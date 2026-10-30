import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudTable } from '@/components/CrudTable';
import { PageTemplate } from '@/components/page-template';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/utils/authorization';
import { router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type OrganizationTablePageProps = {
    title: string;
    description: string;
    url: string;
    entity: string;
    data: any;
    filters?: any;
    columns: any[];
    formFields: any[];
    listRoute: string;
    storeRoute: string;
    updateRoute: string;
    showRoute: string;
    toggleRoute: string;
    viewPermission: string;
    createPermission: string;
    editPermission: string;
    togglePermission: string;
};

export function OrganizationTablePage(props: OrganizationTablePageProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const permissions = auth?.permissions || [];
    const [search, setSearch] = useState(props.filters?.search || '');
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [current, setCurrent] = useState<any>(null);

    const applySearch = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(route(props.listRoute), { search: search || undefined, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    const submit = (formData: any) => {
        const options = {
            onSuccess: () => setOpen(false),
            preserveScroll: true,
        };
        if (mode === 'create') {
            router.post(route(props.storeRoute), formData, options);
        } else {
            router.put(route(props.updateRoute, current.id), formData, options);
        }
    };

    const columns = props.columns.map((column) => ({ ...column, label: t(column.label) }));
    const actions: import('@/types/crud').TableAction[] = [
        { label: t('View'), icon: 'Eye', action: 'view', href: (row: any) => route(props.showRoute, row.id), requiredPermission: props.viewPermission },
        { label: t('Edit'), icon: 'Pencil', action: 'edit', requiredPermission: props.editPermission },
        { label: t('Activate / Deactivate'), icon: 'Power', action: 'toggle-status', requiredPermission: props.togglePermission },
    ];

    return (
        <PageTemplate
            title={t(props.title)}
            description={t(props.description)}
            url={props.url}
            noPadding
            actions={hasPermission(permissions, props.createPermission) ? [{ label: t('Add'), icon: <Plus />, onClick: () => { setCurrent(null); setMode('create'); setOpen(true); } }] : []}
        >
            <div className="space-y-4">
                <form onSubmit={applySearch} className="flex flex-col gap-2 border-b bg-muted/20 p-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1">
                        <label htmlFor={`${props.entity}-search`} className="text-xs font-medium text-muted-foreground">{t('Search')}</label>
                        <Input id={`${props.entity}-search`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Search by name or code')} />
                    </div>
                    <Button type="submit" variant="outline"><Search />{t('Search')}</Button>
                </form>

                <div className="overflow-hidden rounded-lg border bg-background">
                    <CrudTable
                        columns={columns}
                        actions={actions}
                        data={props.data?.data || []}
                        from={props.data?.from || 0}
                        onAction={(action, row) => {
                            if (action === 'edit') { setCurrent(row); setMode('edit'); setOpen(true); }
                            if (action === 'toggle-status') router.put(route(props.toggleRoute, row.id), {}, { preserveScroll: true });
                        }}
                        permissions={permissions}
                        entityPermissions={{ view: props.viewPermission, edit: props.editPermission, delete: props.togglePermission }}
                        showActions
                    />
                    <Pagination
                        from={props.data?.from || 0}
                        to={props.data?.to || 0}
                        total={props.data?.total || 0}
                        links={props.data?.links}
                        entityName={t(props.entity)}
                        onPageChange={(url) => router.get(url, {}, { preserveState: true, preserveScroll: true })}
                        currentPerPage={String(props.filters?.per_page || 10)}
                        onPerPageChange={(value) => router.get(route(props.listRoute), {
                            ...props.filters,
                            per_page: value,
                            page: 1,
                        }, { preserveState: true, preserveScroll: true })}
                    />
                </div>
            </div>

            <CrudFormModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={submit}
                formConfig={{ fields: props.formFields, columns: 2, layout: 'grid', modalSize: 'xl' }}
                initialData={current || { status: 'active' }}
                title={mode === 'create' ? t('Add') : t('Edit')}
                mode={mode}
            />
        </PageTemplate>
    );
}
