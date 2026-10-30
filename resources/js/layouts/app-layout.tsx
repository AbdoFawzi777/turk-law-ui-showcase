import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import React from 'react';
import { useFavicon } from '@/hooks/use-favicon';
import { useBrandTheme } from '@/hooks/use-brand-theme';
import { useLayout } from '@/contexts/LayoutContext';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    useFavicon();
    useBrandTheme();
    
    const { effectivePosition } = useLayout();

    React.useEffect(() => {
        const isRtl = effectivePosition === 'right';
        const direction = isRtl ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.setAttribute('dir', direction);
        document.body.dir = direction;
    }, [effectivePosition]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
