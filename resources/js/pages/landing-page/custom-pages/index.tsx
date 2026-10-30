import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Plus } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { CrudTable } from '@/components/CrudTable';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { TableColumn } from '@/types/crud';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  sort_order: number;
}

interface PageProps extends InertiaPageProps {
  pages: any;
  filters?: any;
}

export default function CustomPagesIndex() {
  const { t } = useTranslation();
  const { pages, filters: pageFilters = {}, globalSettings, auth } = usePage<PageProps>().props;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState<CustomPage | null>(null);
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = () => searchTerm !== '';

  const activeFilterCount = () => (searchTerm !== '' ? 1 : 0);

  const applyFilters = () => {
    router.get(route('landing-page.custom-pages.index'), {
      page: 1,
      search: searchTerm || undefined,
      ...(pageFilters.sort_field && { sort_field: pageFilters.sort_field, sort_direction: pageFilters.sort_direction }),
      ...(pageFilters.per_page && { per_page: pageFilters.per_page }),
    }, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setShowFilters(false);
    router.get(route('landing-page.custom-pages.index'), {}, { preserveState: true, preserveScroll: true });
  };

  const handleEdit = (page: CustomPage) => {
    router.get(route('landing-page.custom-pages.edit', page.id));
  };

  const handleDelete = (page: CustomPage) => {
    setDeletingPage(page);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingPage) return;
    if (!globalSettings?.is_demo) {
      toast.loading(t('Deleting page...'));
    }

    router.delete(route('landing-page.custom-pages.destroy', deletingPage.id), {
      onSuccess: (page) => {
        setIsDeleteModalOpen(false);
        setDeletingPage(null);
        if (!globalSettings?.is_demo) {
          toast.dismiss();
        }
        if (page.props.flash?.success) {
          toast.success(t(page.props.flash.success));
        } else if (page.props.flash?.error) {
          toast.error(t(page.props.flash.error));
        }
      },
      onError: (errors) => {
        if (!globalSettings?.is_demo) {
          toast.dismiss();
        }
        if (typeof errors === 'string') {
          toast.error(t(errors));
        } else {
          toast.error(t('Failed to delete page'));
        }
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleAction = (action: string, item: CustomPage) => {
    if (action === 'edit') {
      handleEdit(item);
    } else if (action === 'delete') {
      handleDelete(item);
    }
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field
      ? (pageFilters.sort_direction === 'asc' ? 'desc' : 'asc')
      : 'asc';
    router.get(route('landing-page.custom-pages.index'), {
      sort_field: field,
      sort_direction: direction,
      page: 1,
      search: searchTerm || undefined,
      ...(pageFilters.per_page && { per_page: pageFilters.per_page }),
    }, { preserveState: true, preserveScroll: true });
  };

  const columns: TableColumn[] = [
    {
      key: 'title',
      label: 'العنوان',
      sortable: true,
      render: (value: string) => <div className="font-medium">{value}</div>
    },
    {
      key: 'content',
      label: 'المحتوى',
      render: (value: string) => {
        const plainText = value.replace(/<[^>]*>/g, '');
        return <div className="max-w-xs truncate" title={plainText}>{plainText.substring(0, 100)}...</div>;
      }
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (value: boolean) => {
        const statusClass = value
          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
          : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusClass}`}>
            {value ? 'نشط' : 'غير نشط'}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: 'تاريخ الإنشاء',
      sortable: true,
      type: 'date'
    }
  ];

  const actions = [
    {
      label: 'تعديل',
      icon: 'Edit',
      action: 'edit',
      className: 'text-amber-500'
    },
    {
      label: 'حذف',
      icon: 'Trash2',
      action: 'delete',
      className: 'text-red-500'
    }
  ];

  return (
    <PageTemplate
      title="صفحات مخصصة"
      url="/custom-pages"
      description={t('Manage your custom pages and their content.')}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Landing Page'), href: route('landing-page') },
        { title: t('Custom Pages') }
      ]}
      actions={[
        {
          label: 'إضافة صفحة',
          icon: <Plus className="w-4 h-4 mr-2" />,
          variant: 'default',
          onClick: () => router.get(route('landing-page.custom-pages.create'))
        }
      ]}
      noPadding
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 border">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[]}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          permissions={auth.permissions}
          columns={columns}
          actions={actions}
          data={pages?.data || pages || []}
          from={pages?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
        />

        {pages?.links && (
          <Pagination
            from={pages?.from || 0}
            to={pages?.to || 0}
            total={pages?.total || 0}
            links={pages?.links}
            entityName="pages"
            currentPerPage={pageFilters.per_page?.toString() || "10"}
            onPerPageChange={(value) => {
                router.get(route('landing-page.custom-pages.index'), {
                page: 1,
                ...(parseInt(value) !== 10 && { per_page: parseInt(value) }),
                search: searchTerm || undefined,
                sort_field: pageFilters.sort_field || undefined,
                sort_direction: pageFilters.sort_direction || undefined,
                }, { preserveState: true, preserveScroll: true });
            }}
            onPageChange={(url) => router.get(url, {}, { preserveState: true, preserveScroll: true })}
          />
        )}
      </div>

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingPage(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingPage?.title || ''}
        entityName="page"
      />

      <Toaster />
    </PageTemplate>
  );
}
