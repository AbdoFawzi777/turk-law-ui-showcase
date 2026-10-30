// types/crud.ts
export interface EntityConfig {
    name: string;
    endpoint: string;
    permissions: {
        view: string;
        create: string;
        edit: string;
        delete: string;
    };
    breadcrumbs?: {
        title: string;
        href?: string;
    }[];
}

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'badge' | 'image' | 'date' | 'currency' | 'boolean' | 'link' | 'custom';
    className?: string;
    linkClassName?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
    label?: string | ((row: any) => string);
    icon?: string | ((row: any) => string);
    action?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    permission?: string;
    className?: string;
    requiredPermission?: string;
    condition?: (row: any) => boolean;
}

export interface TableConfig {
    columns: TableColumn[];
    actions: TableAction[];
    statusColors?: Record<string, string>;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface FormOption {
    value: string | number | boolean;
    label: string;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | 'grid-2' | 'grid-3' | 'grid-4' | 'grid-5' | 'grid-6';

export interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'date' | 'daterange' | 'text' | 'number' | 'boolean';
    options?: FilterOption[];
    relation?: {
        endpoint: string;
        valueField: string;
        labelField: string;
    };
}

export interface FileValidation {
    accept?: string;
    maxSize?: number; // in bytes
    mimeTypes?: string[]; // e.g. ['image/jpeg', 'image/png']
    extensions?: string[]; // e.g. ['.jpg', '.png']
}

export interface FormField {
    name: string;
    label: string;
    type:
        | 'text'
        | 'email'
        | 'password'
        | 'select'
        | 'textarea'
        | 'radio'
        | 'checkbox'
        | 'switch'
        | 'file'
        | 'date'
        | 'number'
        | 'currency'
        | 'time'
        | 'color'
        | 'multi-select'
        | 'media-picker'
        | 'custom'
        | 'dependent-dropdown';
    placeholder?: string;
    defaultValue?: string | number | boolean | string[];
    disabled?: boolean | ((formData: Record<string, any>) => boolean);
    readOnly?: boolean;
    hideLabel?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    required?: boolean | ((mode: 'create' | 'edit' | 'view') => boolean);
    hidden?: boolean;
    rows?: number;
    displayValue?: React.ReactNode;
    onChange?: (value: any, formData: Record<string, any>, setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>) => void;
    searchable?: boolean; // Enable search functionality for select dropdowns
    multiple?: boolean; // For media-picker and multi-select fields
    action?: { label?: string; linkText?: string; link?: string; onClick?: () => void };
    emptyNote?: { text?: string; link: string; linkText: string; onClick?: () => void } | ((formData: any) => { text?: string; link: string; linkText: string; onClick?: () => void } | null);
    options?: FormOption[];
    relation?: {
        endpoint: string;
        valueField: string;
        labelField: string;
    };
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
    };
    fileValidation?: FileValidation;
    column?: number;
    description?: string;
    colSpan?: number; // Number of columns this field should span (1-12)
    width?: string; // CSS width value (e.g., '50%', '200px')
    row?: number; // Optional row number for grouping fields
    render?: (field: FormField, formData: any, onChange: (name: string, value: any) => void, mode: 'create' | 'edit' | 'view') => React.ReactNode;
    conditional?: (mode: string, formData: any) => boolean;
    dependentConfig?: Array<{
        name: string;
        label: string;
        required?: boolean;
        searchable?: boolean;
        showCurrentValue?: boolean;
        emptyNote?: FormField['emptyNote'];
        options?: { value: string | number; label: string }[];
        dependencies?: Record<string, { value: string | number; label: string }[]>;
        apiEndpoint?: string;
    }>;
    onDependentChange?: (fieldName: string, value: string, formData: Record<string, any>, additionalData?: unknown) => void;
}

export interface FormConfig {
    fields: FormField[];
    modalSize?: ModalSize;
    columns?: number; // Number of columns in the form grid (default: 1)
    layout?: 'grid' | 'flex' | 'default'; // Layout type
    column?: number;
    priceSummary?: { unitPrice: number; quantity: number; quantityFieldName?: string };
    transformData?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export interface CrudHooks {
    afterCreate?: (data: any, response: any) => void;
    afterUpdate?: (data: any, response: any) => void;
    afterDelete?: (id: any) => void;
}

export interface CrudConfig {
    entity: EntityConfig;
    table: TableConfig;
    filters: FilterField[];
    form: FormConfig;
    hooks?: CrudHooks;
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    description?: string; // الوصف for accessibility in dialogs
}
