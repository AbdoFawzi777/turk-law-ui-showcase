// config/crud/users.ts
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { t } from '@/utils/i18n';
import React from 'react';

export const usersConfig: CrudConfig = {
  entity: {
    name: 'users',
    endpoint: route('users.index'),
    permissions: {
      view: 'view-users',
      create: 'create-users',
      edit: 'edit-users',
      delete: 'delete-users'
    }
  },
  modalSize: 'lg',
  table: {
    columns: [
      { 
        key: 'name', 
        label: t('Name'), 
        sortable: true,
        render: (_value, row: { name?: string; email?: string }) => React.createElement(
          'div', { className: 'flex items-center gap-3' },
          React.createElement('div', { className: 'flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white' },
            (row.name || '').split(' ').filter(Boolean).map((name) => name[0]).join('').substring(0, 2).toUpperCase()),
          React.createElement('div', null,
            React.createElement('div', { className: 'font-medium' }, row.name),
            React.createElement('div', { className: 'text-sm text-muted-foreground' }, row.email)),
        ),
      },
      { 
        key: 'roles', 
        label: t('Roles'),
        render: (value: Array<{ id?: number; label?: string; name: string }> | null) => {
          if (!value?.length) return React.createElement('span', { className: 'text-muted-foreground' }, 'لا توجد أدوار معيّنة');
          return value.map((role) => React.createElement('span', {
            key: role.id ?? role.name,
            className: 'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-1',
          }, role.label || role.name));
        },
      },
      { 
        key: 'created_at', 
        label: t('Joined'), 
        sortable: true, 
        type: 'date',
      }
    ],
    actions: [
      { 
        label: t('View'), 
        icon: 'Eye', 
        action: 'view', 
        className: 'text-blue-500',
        requiredPermission: 'view-users'
      },
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500',
        requiredPermission: 'edit-users'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        requiredPermission: 'delete-users'
      }
    ]
  },
  filters: [
    {
      key: 'role',
      label: t('Role'),
      type: 'select',
      options: [] // Will be populated dynamically
    }
  ],
  form: {
    fields: [
      { name: 'name', label: t('Name'), type: 'text', required: true },
      { name: 'email', label: t('Email'), type: 'email', required: true },
      { 
        name: 'password', 
        label: t('Password'), 
        type: 'password',
        required: true,
        conditional: (mode) => mode === 'create'
      },
      { 
        name: 'password_confirmation', 
        label: t('Confirm Password'), 
        type: 'password',
        required: true,
        conditional: (mode) => mode === 'create'
      },
      { 
        name: 'roles', 
        label: t('Roles'), 
        type: 'multi-select',
        options: [] // Will be populated dynamically
      }
    ]
  }
};
