import { useEffect, useState } from 'react';
import { PageTemplate, type PageAction } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { hasPermission } from '@/utils/authorization';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

const can = (permissions: string[], names: string[]) => names.some((name) => hasPermission(permissions, name));

export default function Clients() {
  const { t } = useTranslation();
  const { auth, clients, clientTypes, allClientTypes, planLimits, saudiCityOptions = [], nationalityOptions = [], flash, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedClientType, setSelectedClientType] = useState(pageFilters.client_type_id || '_empty_');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || '_empty_');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({ password: '', password_confirmation: '' });
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const getInitials = useInitials();

  const hasActiveFilters = () => searchTerm !== '' || selectedClientType !== '_empty_' || selectedStatus !== '_empty_';

  const activeFilterCount = () => (searchTerm ? 1 : 0) + (selectedClientType !== '_empty_' ? 1 : 0) + (selectedStatus !== '_empty_' ? 1 : 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get(route('clients.index'), {
      page: 1,
      search: searchTerm || undefined,
      client_type_id: selectedClientType !== '_empty_' ? selectedClientType : undefined,
      status: selectedStatus !== '_empty_' ? selectedStatus : undefined,
      ...(pageFilters.sort_field && { sort_field: pageFilters.sort_field, sort_direction: pageFilters.sort_direction }),
      ...(pageFilters.per_page && { per_page: pageFilters.per_page }),
    }, { preserveState: true, preserveScroll: true });
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field
      ? (pageFilters.sort_direction === 'asc' ? 'desc' : 'asc')
      : 'asc';
    router.get(route('clients.index'), {
      sort_field: field,
      sort_direction: direction,
      page: 1,
      search: searchTerm || undefined,
      client_type_id: selectedClientType !== '_empty_' ? selectedClientType : undefined,
      status: selectedStatus !== '_empty_' ? selectedStatus : undefined,
      ...(pageFilters.per_page && { per_page: pageFilters.per_page }),
    }, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);

    switch (action) {
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(item);
        break;
      case 'reset-password':
        if (item.email) {
          setIsResetPasswordModalOpen(true);
        } else {
          toast.error(t('Client must have an email address to reset password'));
        }
        break;
    }
  };

  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {

      router.post(route('clients.store'), formData, {
        onSuccess: (page: any) => {
          setIsFormModalOpen(false);
          if (page.props.flash.success) {
            toast.success(page.props.flash.success);
          } else if (page.props.flash.error) {
            toast.error(page.props.flash.error);
          } else if (page.props.flash.warning) {
            toast.warning(page.props.flash.warning);
          }
        },
        onError: (errors) => {
          if (typeof errors === 'string') {
            toast.error(errors);
          } else {
            toast.error(`تعذر إنشاء العميل: ${Object.values(errors).join(', ')}`);
          }
        }
      });
    } else if (formMode === 'edit') {

      router.put(route('clients.update', currentItem.id), formData, {
        onSuccess: (page: any) => {
          setIsFormModalOpen(false);
          if (page.props.flash.success) {
            toast.success(page.props.flash.success);
          } else if (page.props.flash.error) {
            toast.error(page.props.flash.error);
          }
        },
        onError: (errors) => {
          if (typeof errors === 'string') {
            toast.error(errors);
          } else {
            toast.error(`تعذر تحديث العميل: ${Object.values(errors).join(', ')}`);
          }
        }
      });
    }
  };

  const handleDeleteConfirm = () => {

    router.delete(route('clients.destroy', currentItem.id), {
      onSuccess: (page: any) => {
        setIsDeleteModalOpen(false);
        if (page.props.flash.success) {
          toast.success(page.props.flash.success);
        } else if (page.props.flash.error) {
          toast.error(page.props.flash.error);
        }
      },
      onError: (errors) => {
        if (typeof errors === 'string') {
          toast.error(errors);
        } else {
          toast.error(`تعذر حذف العميل: ${Object.values(errors).join(', ')}`);
        }
      }
    });
  };

  const handleToggleStatus = (client: any) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';

    router.put(route('clients.toggle-status', client.id), {}, {
      onSuccess: (page: any) => {
        if (page.props.flash.success) {
          toast.success(page.props.flash.success);
        } else if (page.props.flash.error) {
          toast.error(page.props.flash.error);
        }
      },
      onError: (errors) => {
        if (typeof errors === 'string') {
          toast.error(errors);
        } else {
          toast.error(`تعذر تحديث السجل: ${Object.values(errors).join(', ')}`);
        }
      }
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (resetPasswordData.password !== resetPasswordData.password_confirmation) {
      toast.error(t('Passwords do not match'));
      return;
    }

    if (resetPasswordData.password.length < 6) {
      toast.error(t('Password must be at least 6 characters'));
      return;
    }


    router.put(route('clients.reset-password', currentItem.id), resetPasswordData, {
      onSuccess: (page: any) => {
        setIsResetPasswordModalOpen(false);
        setResetPasswordData({ password: '', password_confirmation: '' });
        if (page.props.flash.success) {
          toast.success(page.props.flash.success);
        } else if (page.props.flash.error) {
          toast.error(page.props.flash.error);
        }
      },
      onError: (errors) => {
        if (typeof errors === 'string') {
          toast.error(errors);
        } else {
          toast.error(`تعذر إعادة تعيين كلمة المرور: ${Object.values(errors).join(', ')}`);
        }
      }
    });
  };

  const [pageInitialState, setPageInitialState] = useState(true);

    useEffect(() => {
        if (!pageInitialState) applyFilters();
        setPageInitialState(false);
    }, [selectedClientType, selectedStatus]);


  const handleResetFilters = () => {
    router.get(route('clients.index'));
  };

  // Define page actions
  const pageActions: PageAction[] = [];

  // Add the "Add New Client" button if user has permission
  if (can(permissions, ['CLIENT_CREATE', 'create-clients', 'manage-clients'])) {
    pageActions.push({
      label: t('Add Client'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew(),
    });
  }

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Client Management'), href: route('clients.index') },
    { title: t('Clients') }
  ];

  // Define table columns
  const columns: import('@/types/crud').TableColumn[] = [
    {
    key: 'user',
    label: t('Client'),
    render: (value: any, row: any) => {
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={value?.avatar}
                        alt={row.name}
                    />
                    <AvatarFallback className="text-lg">
                        {getInitials(row.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-sm text-muted-foreground">{row.email || value?.email}</div>
                </div>
            </div>
        );
    }
    },
    {
      key: 'phone',
      label: t('Phone'),
      render: (value: string) => value || '-'
    },
    {
      key: 'client_type',
      label: t('Type'),
      render: (value: any, row: any) => {
        return row.client_type?.name || row.client_kind || '-';
      }
    },
    {
      key: 'reference_number',
      label: t('Reference'),
      render: (value: string, row: any) => <span className="font-mono text-xs">{value || row.client_id || '-'}</span>
    },
    {
      key: 'client_status',
      label: t('Status'),
      render: (value: string, row: any) => {
        const status = value || row.status;
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${status === 'active'
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
            : status === 'prospect' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
            }`}>
            {status || t('Unknown')}
          </span>
        );
      }
    }
  ];

  // Define table actions
  const actions: import('@/types/crud').TableAction[] = [
      {
          label: t('View'),
      icon: 'Eye',
      action: 'view',
      className: 'text-blue-500',
      requiredPermission: 'view-clients',
      href: (row: any) => route('clients.show', row.id)
    },
    {
      label: t('Edit'),
      icon: 'Edit',
      action: 'edit',
      className: 'text-amber-500',
      requiredPermission: 'edit-clients'
    },
    {
     label: t('Reset Password'),
     icon: 'KeyRound',
     action: 'reset-password',
     className: 'text-blue-500',
     requiredPermission: 'reset-client-password'
   },
    {
      label: t('Toggle Status'),
      icon: 'Lock',
      action: 'toggle-status',
      className: 'text-amber-500',
      requiredPermission: 'toggle-status-clients'
    },
    {
      label: t('Delete'),
      icon: 'Trash2',
      action: 'delete',
      className: 'text-red-500',
      requiredPermission: 'delete-clients'
    }
  ];

  // Prepare client type options for filter and form
  const clientTypeOptions = [
    { value: '_empty_', label: t('All Types') },
    ...(allClientTypes || []).map((type: any) => ({
      value: type.id.toString(),
      label: type.name
    }))
  ];

  // Prepare status options for filter
  const statusOptions = [
    { value: '_empty_', label: t('All Status') },
    { value: 'active', label: t('Active') },
    { value: 'inactive', label: t('Inactive') }
  ];

  return (
    <PageTemplate
      title={t("Clients")}
      description={t("Manage client profiles and contact details.")}
      url="/clients"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {flash?.warning && <div role="alert" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">{flash.warning}</div>}
      {/* Search and filters section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 border">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[
            {
              name: 'client_type_id',
              label: t('Client Type'),
              type: 'select',
              searchable: true,
              value: selectedClientType,
              onChange: setSelectedClientType,
              options: clientTypeOptions
            },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: statusOptions
            }
          ]}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Content section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={clients?.data || []}
          from={clients?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
          entityPermissions={{
            view: 'view-clients',
            edit: 'edit-clients',
            delete: 'delete-clients'
          }}
        />

        {/* Pagination section */}
        <Pagination
          from={clients?.from || 0}
          to={clients?.to || 0}
          total={clients?.total || 0}
          links={clients?.links}
          entityName={t("clients")}
          currentPerPage={pageFilters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            router.get(route('clients.index'), {
              page: 1,
              ...(parseInt(value) !== 10 && { per_page: parseInt(value) }),
              search: searchTerm || undefined,
              client_type_id: selectedClientType !== '_empty_' ? selectedClientType : undefined,
              status: selectedStatus !== '_empty_' ? selectedStatus : undefined,
              sort_field: pageFilters.sort_field || undefined,
              sort_direction: pageFilters.sort_direction || undefined,
            }, { preserveState: true, preserveScroll: true });
          }}
          onPageChange={(url) => router.get(url, {}, { preserveState: true, preserveScroll: true })}
        />
      </div>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: ([
            { name: 'name', label: t('Client Name'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind !== 'corporate', placeholder: "مثال: أحمد محمد" },
            { name: 'name_en', label: t('English name'), type: 'text', placeholder: "Noor Trading Company" },
            { name: 'legal_name', label: t('Legal name'), type: 'text' },
            {
              name: 'client_kind',
              label: t('Client kind'),
              type: 'select',
              required: true,
              defaultValue: 'individual',
              options: [{ value: 'individual', label: t('Individual') }, { value: 'corporate', label: t('Corporate') }],
            },
            { name: 'company_name', label: t('Company name'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind === 'corporate' },
            { name: 'contact_person_name', label: t('Contact person name'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind === 'corporate' },
            { name: 'email', label: t('Email'), type: 'email', required: false, placeholder: "name@example.com" },
            { name: 'phone', label: t('Phone'), type: 'text', required: true, placeholder: "+9665xxxxxxxx", description: t('For companies, enter the contact person phone.') },
            ...((formMode === 'create' ? [{ name: 'create_portal_account', label: 'إنشاء حساب بوابة العميل', type: 'checkbox', defaultValue: true, description: t('A random temporary secret is generated and sent using the configured portal channel.') }] : []) satisfies import('@/types/crud').FormField[]),
            {
              name: 'client_type_id',
              label: t('Client Type'),
              type: 'select',
              searchable: true,
              required: true,
              options: clientTypes ? clientTypes.map((type: any) => ({
                value: type.id.toString(),
                label: type.name
              })) : [],
              emptyNote: { link: route('clients.client-types.index'), linkText: t('Client Types') }
            },
            { name: 'tax_number', label: t('Tax registration number'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind === 'corporate' },
            { name: 'identity_type', label: t('Identity type'), type: 'select', required: true, conditional: (_mode: string, data: any) => data.client_kind !== 'corporate', options: [{ value: 'national_id', label: t('National ID') }, { value: 'iqama', label: t('Iqama') }] },
            { name: 'national_id', label: t('Identity number'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind !== 'corporate' },
            { name: 'commercial_registration_number', label: t('Commercial registration'), type: 'text', required: true, conditional: (_mode: string, data: any) => data.client_kind === 'corporate' },
            { name: 'unified_number', label: t('Unified number'), type: 'text' },
            {
              name: 'nationality',
              label: t('Nationality'),
              type: 'text',
              conditional: (_mode: string, data: any) => data.client_kind !== 'corporate',
              render: (field: any, data: any, onChange: any) => (
                <>
                  <Input
                    id={field.name}
                    name={field.name}
                    list="saudi-nationality-options"
                    value={data[field.name] || ''}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    placeholder="اختر أو اكتب الجنسية..."
                    aria-describedby="nationality-help"
                  />
                  <datalist id="saudi-nationality-options">
                    {nationalityOptions.map((option: any) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </datalist>
                  <span id="nationality-help" className="text-xs text-muted-foreground">
                    {t('Searchable nationality selection; existing and custom nationalities are preserved.')}
                  </span>
                </>
              ),
              description: t('Searchable nationality selection; existing and custom nationalities are preserved.')
            },
            { name: 'country', label: t('Country'), type: 'text' },
            { name: 'city', label: t('City'), type: 'text', render: (field: any, data: any, onChange: any) => <><Input id={field.name} name={field.name} list="saudi-city-options" value={data[field.name] || ''} onChange={(event) => onChange(field.name, event.target.value)} aria-describedby="saudi-city-help" /><datalist id="saudi-city-options">{saudiCityOptions.map((option: any) => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</datalist><span id="saudi-city-help" className="text-xs text-muted-foreground">{t('Suggestions are regional administrative seats; other cities can be entered.')}</span></>, description: t('Suggestions are regional administrative seats; other cities can be entered.') },
            { name: 'website', label: t('Website'), type: 'text' },
            { name: 'tax_rate', label: t('Tax Rate (%)'), type: 'number', step: '0.01', min: '0', max: '100', defaultValue: 0, required: true, placeholder: "14" },
            { name: 'date_of_birth', label: t('Date of Birth'), type: 'date', conditional: (_mode: string, data: any) => data.client_kind !== 'corporate' },
            { name: 'address', label: t('Address'), type: 'textarea', placeholder: "مثال: شارع النصر، القاهرة" },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              options: [
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' }
              ],
              defaultValue: 'active'
            }
          ] as any),
          modalSize: 'xl',
          transformData: (data: Record<string, any>) => ({
            ...data,
            ...(data.client_kind === 'corporate' ? { name: data.company_name } : {}),
          })
        }}
        initialData={currentItem}
        title={
          formMode === 'create'
            ? t('Add New Client')
            : formMode === 'edit'
              ? t('Edit Client')
              : t('View Client')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="client"
      />

      {/* Reset Password Modal */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Reset Client Password')}</DialogTitle>
            {/* <div className="text-sm text-muted-foreground">
              <p><strong>{t('Client')}:</strong> {currentItem?.name}</p>
              <p><strong>{t('Email')}:</strong> {currentItem?.email}</p>
            </div> */}
          </DialogHeader>
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" required>{t('New Password')}</Label>
              <Input
                id="password"
                type="password"
                value={resetPasswordData.password}
                onChange={(e) => setResetPasswordData(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation" required>{t('Confirm Password')}</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={resetPasswordData.password_confirmation}
                onChange={(e) => setResetPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setResetPasswordData({ password: '', password_confirmation: '' });
                }}
              >
                {t('Cancel')}
              </Button>
              <Button type="submit">
                {t('Reset Password')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}
