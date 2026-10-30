import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageAction {
  label?: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
  tooltip?: string;
}

export interface PageTemplateProps {
  title: string;
  description?: string;
  url: string;
  actions?: PageAction[];
  children: ReactNode;
  noPadding?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageTemplate({
  title,
  description,
  url,
  actions,
  children,
  noPadding = false,
  breadcrumbs,
  className,
}: PageTemplateProps) {
  // Default breadcrumbs if none provided
  const pageBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
    {
      title,
      href: url,
    },
  ];

  return (
    <AppLayout breadcrumbs={pageBreadcrumbs}>
      <Head title={`${title} - ${(usePage().props as any).globalSettings?.titleText || 'ميزان'}`} />

      <div className={cn("flex min-w-0 flex-1 flex-col gap-4 pt-4 pb-[50px] px-4 sm:px-6 lg:px-[50px]", className)}>
        {/* Header with action buttons */}
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
            <h1 className="break-words text-xl font-semibold leading-snug">{title}</h1>
            <div className="text-xs text-muted-foreground">{description}</div>
        </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {actions.map((action, index) => {
                // Determine button size based on whether it has a label
                const hasLabel = action.label && action.label.trim() !== '';
                const buttonSize = hasLabel ? 'sm' : 'icon';

                const buttonElement = (
                  <Button
                    variant={action.variant || 'outline'}
                    size={buttonSize}
                    onClick={action.onClick}
                    className="cursor-pointer"
                  >
                    {action.icon && !hasLabel && action.icon}
                    {action.icon && hasLabel && action.icon}
                    {hasLabel && action.label}
                  </Button>
                );

                // Wrap with tooltip if tooltip text is provided
                if (action.tooltip && action.tooltip.trim() !== '') {
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        {buttonElement}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                // Return button without tooltip
                return <span key={index}>{buttonElement}</span>;
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={noPadding ? "" : "rounded-xl border p-4 sm:p-6"}>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
