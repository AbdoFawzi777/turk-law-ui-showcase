import React from 'react';
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { t } from '@/utils/i18n';
import { RichTextField } from '@/components/ui/rich-text-field';

export const customPagesConfig: CrudConfig = {
  entity: {
    name: 'custom-pages',
    endpoint: route('landing-page.custom-pages.index'),
    permissions: {
      view: 'view-custom-pages',
      create: 'create-custom-pages',
      edit: 'edit-custom-pages',
      delete: 'delete-custom-pages'
    }
  },
  modalSize: '4xl',
  description: t('Manage custom landing pages'),
  table: {
    columns: [
      { key: 'title', label: t('Title'), sortable: true },
      { 
        key: 'content', 
        label: t('Content'), 
        render: (value) => {
          const plainText = (value || '').replace(/<[^>]*>/g, '');
          return React.createElement(
            'div',
            { className: 'max-w-xs truncate', title: plainText },
            plainText.substring(0, 100) + '...'
          );
        }
      },
      { 
        key: 'is_active', 
        label: t('Status'), 
        render: columnRenderers.status({
          true: 'bg-green-100 text-green-800',
          false: 'bg-gray-100 text-gray-800'
        })
      },
      { 
        key: 'sort_order', 
        label: t('Sort Order'), 
        sortable: true 
      },
      { 
        key: 'created_at', 
        label: t('Created At'), 
        sortable: true, 
        type: 'date'
      }
    ],
    actions: [
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500'
      }
    ]
  },
  filters: [
    {
      key: 'is_active',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Status') },
        { value: '1', label: t('Active') },
        { value: '0', label: t('Inactive') }
      ]
    }
  ],
  form: {
    fields: [
      {
        name: 'title',
        label: t('Page Title'),
        type: 'text',
        required: true,
        placeholder: t('About Us')
      },
      {
        name: 'content',
        label: t('Content'),
        type: 'custom',
        required: true,
        placeholder: t('Page content...'),
        render: (field, formData, onChange, mode) => React.createElement(RichTextField, {
          name: field.name,
          label: field.label,
          value: typeof formData[field.name] === 'string' ? formData[field.name] : '',
          onChange: (value: string) => onChange(field.name, value),
          placeholder: field.placeholder,
          required: true,
          disabled: mode === 'view',
        }),
      },
      {
        name: 'meta_title',
        label: t('Meta Title (SEO)'),
        type: 'text',
        placeholder: t('SEO title')
      },
      {
        name: 'meta_description',
        label: t('Meta Description (SEO)'),
        type: 'textarea',
        placeholder: t('SEO description')
      },
      {
        name: 'is_active',
        label: t('Active'),
        type: 'switch',
        defaultValue: true
      },
      {
        name: 'sort_order',
        label: t('Sort Order'),
        type: 'number',
        defaultValue: 0
      }
    ]
  }
};
