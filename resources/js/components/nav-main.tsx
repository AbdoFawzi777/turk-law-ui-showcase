import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronLeft, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Store expanded menu state in localStorage
const STORAGE_KEY = 'nav_expanded_items';

export function NavMain({ items = [], position, searchQuery = '' }: { items: NavItem[]; position: 'left' | 'right'; searchQuery?: string }) {
    const page = usePage();
    const { state } = useSidebar();
    const { t } = useTranslation();

    const isRtl = document.documentElement.dir === 'rtl';
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const effectivePosition = isRtl ? (position === 'left' ? 'right' : 'left') : position;

    // Initialize expanded state
    useEffect(() => {
        const newExpandedItems: Record<string, boolean> = {};

        const processMenuItems = (menuItems: NavItem[], parentKey?: string) => {
            menuItems.forEach(item => {
                const isItemActive = isActive(item.href);
                const hasActiveChild = item.children && isChildActive(item.children);

                if (parentKey && (isItemActive || hasActiveChild)) {
                    newExpandedItems[parentKey] = true;
                }

                if (item.children && (isItemActive || hasActiveChild || item.defaultOpen === true)) {
                    newExpandedItems[item.title] = true;
                    processMenuItems(item.children, item.title);
                }

                if (item.children) {
                    checkNestedChildren(item.children, 1, newExpandedItems);
                }
            });
        };

        processMenuItems(items);

        setExpandedItems(newExpandedItems);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
        }
    }, [page.url, items]);

    const checkNestedChildren = (
        children: NavItem[],
        level: number,
        newExpandedItems: Record<string, boolean>
    ) => {
        children.forEach(child => {
            const childKey = `${level}-${child.title}`;
            const isChildItemActive = isActive(child.href);
            const hasActiveChild = child.children && isChildActive(child.children);

            if (child.children && (isChildItemActive || hasActiveChild)) {
                newExpandedItems[childKey] = true;
                checkNestedChildren(child.children, level + 1, newExpandedItems);
            }
        });
    };

    const toggleExpand = (title: string) => {
        const newExpandedItems = {
            ...expandedItems,
            [title]: !expandedItems[title]
        };

        setExpandedItems(newExpandedItems);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
        }
    };

    const isActive = (href?: string) => {
        if (!href) return false;

        const hrefPath = href.startsWith('http') ? new URL(href).pathname : href;
        const currentPath = page.url.split('?')[0].split('#')[0];

        const normalizedHref = hrefPath.replace(/\/$/, '');
        const normalizedCurrent = currentPath.replace(/\/$/, '');

        if (normalizedCurrent === normalizedHref) {
            return true;
        }

        if (normalizedCurrent.startsWith(normalizedHref + '/')) {
            return true;
        }

        return false;
    };

    const isChildActive = (children?: NavItem[]): boolean => {
        if (!children) return false;
        return children.some(child => isActive(child.href) || isChildActive(child.children));
    };

    const renderSubMenu = (children: NavItem[], level: number = 1) => {
        return (
            <SidebarMenuSub className="my-1 space-y-0.5 ps-3 pe-1 ms-3 border-s border-gray-200 dark:border-gray-800 rtl:ms-0 rtl:me-3 rtl:border-s-0 rtl:border-e rtl:pe-3 rtl:ps-1">
                {children.map(child => (
                    <div key={child.title}>
                        {child.children ? (
                            <>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton
                                        isActive={isChildActive(child.children)}
                                        onClick={() => toggleExpand(`${level}-${child.title}`)}
                                        className="cursor-pointer font-medium"
                                    >
                                        <div className="flex items-center gap-2 w-full min-w-0">
                                            <span className="truncate text-xs">{child.title}</span>
                                            {state !== "collapsed" && (
                                                <div className="ms-auto shrink-0 flex items-center">
                                                    {expandedItems[`${level}-${child.title}`] ?
                                                        <ChevronDown className="h-3 w-3 opacity-60" /> :
                                                        <ChevronLeft className="h-3 w-3 opacity-60" />
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>

                                {expandedItems[`${level}-${child.title}`] && renderSubMenu(child.children, level + 1)}
                            </>
                        ) : (
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                                    {child.target === '_blank' ? (
                                        <a
                                            href={child.href || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 w-full min-w-0"
                                        >
                                            <span className="truncate text-xs">{child.title}</span>
                                        </a>
                                    ) : (
                                        <Link
                                            href={child.href || '#'}
                                            preserveState={false}
                                            className="flex items-center gap-2 w-full min-w-0"
                                        >
                                            <span className="truncate text-xs">{child.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        )}
                    </div>
                ))}
            </SidebarMenuSub>
        );
    };

    const renderCollapsedDropdownItems = (children: NavItem[]) => {
        return children.map(child => {
            if (child.children && child.children.length > 0) {
                return (
                    <DropdownMenuSub key={child.title}>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                            <span>{child.title}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent sideOffset={4}>
                            {renderCollapsedDropdownItems(child.children)}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                );
            }

            return (
                <DropdownMenuItem key={child.title} asChild className="cursor-pointer" dir={isRtl ? 'rtl' : 'ltr'}>
                    {child.target === '_blank' ? (
                        <a
                            href={child.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>{child.title}</span>
                        </a>
                    ) : (
                        <Link href={child.href || '#'} preserveState={false}>
                            <span>{child.title}</span>
                        </Link>
                    )}
                </DropdownMenuItem>
            );
        });
    };

    return (
        <>
            {searchQuery && items.length === 0 && state !== 'collapsed' ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                    <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('No menu found')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">"{searchQuery}"</p>
                </div>
            ) : (
            <SidebarGroup className="px-2 py-1">
                <SidebarMenu className="gap-1">
                    {items.map((item) => (
                        <div key={item.title}>
                            {item.children ? (
                                <>
                                    {state === 'collapsed' ? (
                                        <SidebarMenuItem>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={isChildActive(item.children)}
                                                        tooltip={{ children: item.title }}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2 w-full justify-center">
                                                            {item.icon && <item.icon className="h-4.5 w-4.5 shrink-0 text-sidebar-foreground/80" />}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    side={effectivePosition === 'right' ? 'left' : 'right'}
                                                    align="start"
                                                    className="min-w-[200px]"
                                                >
                                                    <DropdownMenuItem dir={isRtl ? 'rtl' : 'ltr'} disabled className="opacity-100 cursor-default">
                                                        <span className="font-semibold text-xs">{item.title}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {renderCollapsedDropdownItems(item.children)}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </SidebarMenuItem>
                                    ) : (
                                        <>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    isActive={isChildActive(item.children)}
                                                    onClick={() => toggleExpand(item.title)}
                                                    className="cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-2.5 w-full min-w-0">
                                                        {item.icon && (
                                                            <item.icon className="h-4 w-4 shrink-0 text-sidebar-foreground/75 group-hover:text-white group-data-[active=true]:text-white transition-colors" />
                                                        )}
                                                        <span className="truncate text-[12.5px] font-medium group-data-[active=true]:font-bold group-data-[active=true]/menu-button:font-bold">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ms-auto px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-[#f59e0b] text-[#1c1917] shrink-0 shadow-xs">
                                                                {item.badge.label}
                                                            </span>
                                                        )}
                                                        <div className="ms-auto shrink-0 flex items-center">
                                                            {expandedItems[item.title] ? (
                                                                <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform" />
                                                            ) : (
                                                                <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            {expandedItems[item.title] && renderSubMenu(item.children)}
                                        </>
                                    )}
                                </>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }} className="group">
                                        {item.target === '_blank' ? (
                                            <a
                                                href={item.href || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 w-full min-w-0"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4 shrink-0 text-sidebar-foreground/75 group-hover:text-white group-data-[active=true]:text-white transition-colors" />
                                                )}
                                                {state !== 'collapsed' && (
                                                    <>
                                                        <span className="truncate text-[12.5px] font-medium group-data-[active=true]:font-bold group-data-[active=true]/menu-button:font-bold">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ms-auto px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-[#f59e0b] text-[#1c1917] shrink-0 shadow-xs">
                                                                {item.badge.label}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.href || '#'}
                                                preserveState={false}
                                                className="flex items-center gap-2.5 w-full min-w-0"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4 shrink-0 text-sidebar-foreground/75 group-hover:text-white group-data-[active=true]:text-white transition-colors" />
                                                )}
                                                {state !== 'collapsed' && (
                                                    <>
                                                        <span className="truncate text-[12.5px] font-medium group-data-[active=true]:font-bold group-data-[active=true]/menu-button:font-bold">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ms-auto px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-[#f59e0b] text-[#1c1917] shrink-0 shadow-xs">
                                                                {item.badge.label}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </div>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            )}
        </>
    );
}
