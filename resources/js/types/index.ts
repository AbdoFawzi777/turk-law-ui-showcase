import { LucideIcon } from 'lucide-react';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    type: string;
    lang?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    roles?: Array<{ id: number; name: string; label?: string }>;
    permissions?: string[];
    company?: User | null;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
}

export interface GlobalSettings {
    [key: string]: unknown;
    layoutDirection?: 'left' | 'right';
    is_demo?: boolean;
    defaultLanguage?: string;
    themeMode?: 'light' | 'dark' | 'system';
    themeColor?: string;
    customColor?: string;
    titleText?: string;
    title?: string;
    favicon?: string;
    logoDark?: string;
    logoLight?: string;
    base_url?: string;
    image_url?: string;
}

export interface SharedData {
    [key: string]: unknown;
    auth: { user: User | null; roles: string[] | null; permissions: string[] };
    flash: FlashMessages;
    globalSettings: GlobalSettings;
    name: string;
    base_url: string;
    image_url: string;
    csrf_token: string;
    quote: { message: string; author: string };
    userLanguage: string;
    isImpersonating: boolean;
    is_demo: boolean;
    featureFlags: { showSaasNavigation: boolean };
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedData {}
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon;
    permission?: string;
    children?: NavItem[];
    target?: string;
    external?: boolean;
    defaultOpen?: boolean;
    group?: string;
    badge?: {
        label: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    };
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface PageAction {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
}
