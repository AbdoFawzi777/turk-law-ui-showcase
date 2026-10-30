import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useBrand } from '@/contexts/BrandContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';
import { type NavItem } from '@/types';
import { hasPermission } from '@/utils/authorization';
import { getImagePath } from '@/utils/helpers';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    BookOpen,
    Briefcase,
    Building2,
    CalendarDays,
    CheckSquare,
    ClipboardList,
    DollarSign,
    FileText,
    Gavel,
    Globe,
    Image,
    Landmark,
    LayoutGrid,
    ListTodo,
    Mail,
    MessageSquare,
    Receipt,
    Scale,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function AppSidebar() {
    const { t, i18n } = useTranslation();
    const { auth, globalSettings } = usePage().props as any;
    const userRole = auth.user?.type || auth.user?.role;
    const permissions = auth?.permissions || [];

    const getCompanyNavItems = (): NavItem[] => {
        const items: NavItem[] = [];

        const pushSingleOrMenu = (title: string, icon: any, children: NavItem[]) => {
            if (children.length === 1) {
                items.push({ ...children[0], icon: children[0].icon || icon });
            } else if (children.length > 1) {
                items.push({ title, icon, children });
            }
        };

        // 1. لوحة التحكم (Dashboard)
        if (hasPermission(permissions, 'manage-dashboard')) {
            items.push({ title: t('Dashboard'), href: route('dashboard'), icon: LayoutGrid });
        }

        // 2. إدارة القضايا (Cases & Matters)
        const caseChildren: NavItem[] = [];
        const caseSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'MATTER_VIEW') || hasPermission(permissions, 'view-matters')) {
            caseChildren.push({ title: t('Legal Matters'), href: route('matters.index') });
        }
        if (hasPermission(permissions, 'manage-cases')) {
            caseChildren.push({ title: t('Cases'), href: route('cases.index') });
        }
        if (hasPermission(permissions, 'manage-cases') && hasPermission(permissions, 'view-cases')) {
            caseChildren.push({ title: t('Archived Cases'), href: route('cases.archive.index') });
        }
        if (hasPermission(permissions, 'HEARING_VIEW') || hasPermission(permissions, 'view-hearings')) {
            caseChildren.push({ title: t('Hearing Workspace'), href: route('legal-hearings.index') });
        }
        if (hasPermission(permissions, 'DEADLINE_VIEW') || hasPermission(permissions, 'view-deadlines')) {
            caseChildren.push({ title: t('Legal Deadlines'), href: route('legal-deadlines.index') });
        }
        if (hasPermission(permissions, 'manage-hearings')) {
            caseChildren.push({ title: t('Hearings'), href: route('hearings.index') });
        }
        if (hasPermission(permissions, 'manage-case-types')) {
            caseSetupChildren.push({ title: t('Case Types'), href: route('cases.case-types.index') });
        }
        if (hasPermission(permissions, 'manage-case-statuses')) {
            caseSetupChildren.push({ title: t('Case Status'), href: route('cases.case-statuses.index') });
        }
        if (hasPermission(permissions, 'manage-event-types')) {
            caseSetupChildren.push({ title: t('Event Types'), href: route('advocate.event-types.index') });
        }
        if (hasPermission(permissions, 'manage-hearing-types')) {
            caseSetupChildren.push({ title: t('Hearing Types'), href: route('hearing-types.index') });
        }
        if (caseSetupChildren.length > 0) {
            caseChildren.push({ title: t('Case Setup'), children: caseSetupChildren });
        }
        if (caseChildren.length > 0) {
            items.push({ title: t('Case Management'), icon: Gavel, children: caseChildren });
        }

        // 3. جلسات المحاكم (Courts & Hearings)
        const courtScheduleChildren: NavItem[] = [];
        const courtSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-courts')) {
            courtScheduleChildren.push({ title: t('Courts'), href: route('courts.index') });
        }
        if (hasPermission(permissions, 'manage-judges')) {
            courtScheduleChildren.push({ title: t('Judges'), href: route('judges.index') });
        }
        if (hasPermission(permissions, 'COURT_VIEW') || hasPermission(permissions, 'manage-courts')) {
            courtScheduleChildren.push({ title: t('Circuits'), href: route('circuits.index') });
        }
        if (hasPermission(permissions, 'manage-court-types')) {
            courtSetupChildren.push({ title: t('Court Types'), href: route('advocate.court-types.index') });
        }
        if (courtSetupChildren.length > 0) {
            courtScheduleChildren.push({ title: t('Court Setup'), children: courtSetupChildren });
        }
        if (courtScheduleChildren.length > 0) {
            items.push({ title: t('Court Management'), icon: Landmark, children: courtScheduleChildren });
        }

        // 4. الموكلون والعملاء (Clients, Leads & Communication)
        const clientChildren: NavItem[] = [];
        const clientSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-clients')) {
            clientChildren.push({ title: t('Clients'), href: route('clients.index') });
        }
        if (hasPermission(permissions, 'CLIENT_VIEW') || hasPermission(permissions, 'view-clients')) {
            if (!clientChildren.some((item) => item.href === route('clients.index'))) clientChildren.push({ title: t('Clients'), href: route('clients.index') });
        }
        if (hasPermission(permissions, 'LEAD_VIEW') || hasPermission(permissions, 'view-leads')) {
            clientChildren.push({ title: t('Leads'), href: route('leads.index') });
        }
        if (hasPermission(permissions, 'PARTY_VIEW') || hasPermission(permissions, 'view-parties')) {
            clientChildren.push({ title: t('Parties'), href: route('parties.index') });
        }
        if (hasPermission(permissions, 'INTAKE_VIEW') || hasPermission(permissions, 'view-intakes')) {
            clientChildren.push({ title: t('Matter Intakes'), href: route('intakes.index') });
        }
        if (hasPermission(permissions, 'CONFLICT_VIEW') || hasPermission(permissions, 'view-conflicts')) {
            clientChildren.push({ title: t('Conflict Checks'), href: route('conflicts.index') });
        }
        if (hasPermission(permissions, 'manage-client-documents')) {
            clientChildren.push({ title: t('Documents'), href: route('clients.documents.index') });
        }
        if (hasPermission(permissions, 'manage-messages')) {
            clientChildren.push({ title: t('Communication'), href: route('communication.messages.index') });
        }
        if (hasPermission(permissions, 'CLIENT_PORTAL_MANAGE')) {
            clientChildren.push({ title: 'إدارة بوابة العملاء', href: route('client-portal.manage') });
        }
        if (hasPermission(permissions, 'manage-client-types')) {
            clientSetupChildren.push({ title: t('Client Types'), href: route('clients.client-types.index') });
        }
        if (hasPermission(permissions, 'manage-document-types')) {
            clientSetupChildren.push({ title: t('Document Types'), href: route('advocate.document-types.index') });
        }
        if (clientSetupChildren.length > 0) {
            clientChildren.push({ title: t('Client Setup'), children: clientSetupChildren });
        }
        if (clientChildren.length > 0) {
            items.push({ title: t('Client Management'), icon: Users, children: clientChildren });
        }

        // 5. التشغيل والمهام (Daily Operations & Tasks)
        const taskChildren: NavItem[] = [];
        const taskSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'TASK_VIEW') || hasPermission(permissions, 'TIME_VIEW')) {
            taskChildren.push({ title: 'لوحة عملي', href: route('work.index') });
        }
        if (hasPermission(permissions, 'TASK_VIEW')) taskChildren.push({ title: 'المهام التشغيلية', href: route('work.tasks.index') });
        if (hasPermission(permissions, 'DOCUMENT_VIEW')) taskChildren.push({ title: 'المستندات القانونية', href: route('work.documents.index') });
        if (hasPermission(permissions, 'CORRESPONDENCE_VIEW')) taskChildren.push({ title: 'سجل المراسلات', href: route('work.correspondence.index') });
        if (hasPermission(permissions, 'TIME_VIEW')) taskChildren.push({ title: 'الوقت والمؤقت', href: route('work.time.index') });
        if (hasPermission(permissions, 'APPROVAL_VIEW')) taskChildren.push({ title: 'الموافقات', href: route('work.approvals.index') });
        if (hasPermission(permissions, 'WORKFLOW_VIEW')) taskChildren.push({ title: 'سير العمل', href: route('work.workflows.index') });
        if (hasPermission(permissions, 'manage-tasks')) {
            taskChildren.push({ title: t('Tasks'), href: route('tasks.index') });
        }
        if (hasPermission(permissions, 'manage-task-types')) {
            taskSetupChildren.push({ title: t('Task Types'), href: route('tasks.task-types.index') });
        }
        if (hasPermission(permissions, 'manage-task-statuses')) {
            taskSetupChildren.push({ title: t('Task Status'), href: route('tasks.task-statuses.index') });
        }
        if (taskSetupChildren.length > 0) {
            taskChildren.push({ title: t('Task Setup'), children: taskSetupChildren });
        }
        if (taskChildren.length > 0) {
            items.push({ title: t('Task & Workflow'), icon: ClipboardList, children: taskChildren });
        }

        // 6. إدارة المستندات (Document Management)
        const documentChildren: NavItem[] = [];
        const documentSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-documents')) {
            documentChildren.push({ title: t('Documents'), href: route('document-management.documents.index') });
        }
        if (hasPermission(permissions, 'manage-media')) {
            documentChildren.push({ title: t('Media Library'), href: route('media-library') });
        }
        if (hasPermission(permissions, 'manage-document-categories')) {
            documentSetupChildren.push({ title: t('Categories'), href: route('document-management.categories.index') });
        }
        if (documentSetupChildren.length > 0) {
            documentChildren.push({ title: t('Document Setup'), children: documentSetupChildren });
        }
        if (documentChildren.length > 0) {
            items.push({ title: t('Document Management'), icon: FileText, children: documentChildren });
        }

        // 7. المالية والفوترة (Billing, Invoicing & Financial Operations)
        const billingChildren: NavItem[] = [];
        const billingSetupChildren: NavItem[] = [];
        if (userRole === 'team_member' || userRole === 'employee') {
            billingChildren.push({ title: t('My Payslips'), href: route('payroll.my-payslips'), icon: WalletCards });
        }
        if (hasPermission(permissions, 'manage-invoices')) {
            billingChildren.push({ title: t('Invoices'), href: route('billing.invoices.index') });
            billingChildren.push({ title: 'المالية القانونية', href: route('legal-billing.dashboard') });
            billingChildren.push({ title: 'الارتباطات القانونية', href: route('legal-billing.engagements') });
            billingChildren.push({ title: 'طابور الفوترة', href: route('legal-billing.queue') });
        }
        if (hasPermission(permissions, 'manage-payments')) {
            billingChildren.push({ title: t('Payments'), href: route('billing.payments.index') });
            billingChildren.push({ title: 'التحصيل والأرصدة', href: route('legal-billing.collections') });
        }
        if (hasPermission(permissions, 'manage-expenses')) {
            billingChildren.push({ title: t('Expenses'), href: route('billing.expenses.index') });
        }
        if (hasPermission(permissions, 'manage-time-entries')) {
            billingChildren.push({ title: t('Time Sheet'), href: route('billing.time-entries.index') });
        }
        if (hasPermission(permissions, 'view-payroll')) {
            billingChildren.push({ title: t('Payroll'), href: route('payroll.runs.index') });
        }
        if (hasPermission(permissions, 'view-payroll-reports')) {
            billingChildren.push({ title: t('Payroll Reports'), href: route('payroll.reports.index') });
        }
        if (hasPermission(permissions, 'view-office-expenses')) {
            billingChildren.push({ title: t('Office Expenses'), href: route('office-expenses.index') });
        }
        if (hasPermission(permissions, 'view-office-financial-reports')) {
            billingChildren.push({ title: t('Office Financial Report'), href: route('office-expenses.reports') });
        }
        if (hasPermission(permissions, 'manage-expense-categories')) {
            billingSetupChildren.push({ title: t('Expense Categories'), href: route('billing.expense-categories.index') });
        }
        if (hasPermission(permissions, 'manage-office-expense-categories') || hasPermission(permissions, 'manage-office-expense-settings')) {
            billingSetupChildren.push({ title: t('Office Expense Settings'), href: route('office-expenses.settings') });
        }
        if (billingSetupChildren.length > 0) {
            billingChildren.push({ title: t('Billing Setup'), children: billingSetupChildren });
        }
        if (billingChildren.length > 0) {
            items.push({ title: t('Billing & Invoicing'), icon: BookOpen, children: billingChildren });
        }

        // 8. التقويم والمواعيد (Calendar)
        if (hasPermission(permissions, 'manage-calendar')) {
            items.push({ title: t('Calendar'), href: route('calendar.index'), icon: CalendarDays });
        }

        // 9. الامتثال والتراخيص (Compliance & Licensing)
        const researchChildren: NavItem[] = [];
        const researchSetupChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-compliance-requirements')) {
            researchChildren.push({ title: t('Compliance Requirements'), href: route('compliance.requirements.index') });
        }
        if (hasPermission(permissions, 'manage-compliance-audits')) {
            researchChildren.push({ title: t('Compliance Audits'), href: route('compliance.audits.index') });
        }
        if (hasPermission(permissions, 'manage-risk-assessments')) {
            researchChildren.push({ title: t('Risk Assessments'), href: route('compliance.risk-assessments.index') });
        }
        if (hasPermission(permissions, 'manage-professional-licenses')) {
            researchChildren.push({ title: t('Professional Licenses'), href: route('compliance.professional-licenses.index') });
        }
        if (hasPermission(permissions, 'manage-cle-tracking')) {
            researchChildren.push({ title: t('CLE Tracking'), href: route('compliance.cle-tracking.index') });
        }
        if (hasPermission(permissions, 'manage-regulatory-bodies')) {
            researchChildren.push({ title: t('Regulatory Bodies'), href: route('compliance.regulatory-bodies.index') });
        }
        if (hasPermission(permissions, 'manage-practice-areas')) {
            researchSetupChildren.push({ title: t('Practice Areas'), href: route('advocate.practice-areas.index') });
        }
        if (hasPermission(permissions, 'manage-compliance-categories')) {
            researchSetupChildren.push({ title: t('Compliance Categories'), href: route('compliance.categories.index') });
        }
        if (researchSetupChildren.length > 0) {
            researchChildren.push({ title: t('Research Setup'), children: researchSetupChildren });
        }
        if (researchChildren.length > 0) {
            items.push({ title: t('Compliance & Licensing'), icon: ShieldCheck, children: researchChildren });
        }

        // 11. مركز التنبيهات (Notification Center)
        if (hasPermission(permissions, 'NOTIFICATION_CENTER_VIEW')) {
            items.push({ title: 'مركز التنبيهات', href: route('notification-center.index'), icon: Bell });
        }

        // 12. فريق العمل (Staff Management)
        const staffChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-users')) {
            staffChildren.push({ title: t('Members'), href: route('users.index') });
        }
        if (hasPermission(permissions, 'manage-roles')) {
            staffChildren.push({ title: t('Roles'), href: route('roles.index') });
        }
        if (hasPermission(permissions, 'manage-company-profiles')) {
            staffChildren.push({ title: t('Company Profile'), href: route('advocate.company-profiles.index') });
        }
        if (staffChildren.length > 0) {
            items.push({ title: t('Team Members'), icon: UserCheck, children: staffChildren });
        }

        // 13. التقارير والإحصائيات (Analytics & Reports) - في نهاية القائمة حسب أولوية الاستخدام
        const reportChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-dashboard') && auth.user?.type === 'company') {
            reportChildren.push({ title: t('Analytics & Reports'), href: route('analytics.index'), icon: BarChart3 });
        }
        if (hasPermission(permissions, 'REPORT_VIEW')) {
            reportChildren.push({ title: 'التقارير القانونية', href: route('legal-reports.index'), icon: FileText });
        }
        if (hasPermission(permissions, 'MANAGING_DASHBOARD_VIEW')) {
            reportChildren.push({ title: 'مركز قيادة الشريك', href: route('executive.command-center'), icon: LayoutGrid });
        }
        pushSingleOrMenu('التقارير والإحصائيات', BarChart3, reportChildren);

        // 14. الإدارة والإعدادات (Administration & Settings)
        const administrationChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-branches') || hasPermission(permissions, 'view-branches')) {
            administrationChildren.push({ title: t('Branches'), href: route('branches.index') });
        }
        if (hasPermission(permissions, 'manage-departments') || hasPermission(permissions, 'view-departments')) {
            administrationChildren.push({ title: t('Departments'), href: route('departments.index') });
        }
        if (hasPermission(permissions, 'manage-teams') || hasPermission(permissions, 'view-teams')) {
            administrationChildren.push({ title: t('Teams'), href: route('teams.index') });
        }
        if (hasPermission(permissions, 'manage-permissions')) {
            administrationChildren.push({ title: t('Permissions'), href: route('permissions.index') });
        }
        if (hasPermission(permissions, 'view-audit-log')) {
            administrationChildren.push({ title: t('Audit Log'), href: route('audit-logs.index') });
        }
        if (hasPermission(permissions, 'view-active-sessions')) {
            administrationChildren.push({ title: t('Active Sessions'), href: route('active-sessions.index') });
        }
        if (hasPermission(permissions, 'manage-company-settings')) {
            administrationChildren.push({ title: t('Company Settings'), href: route('advocate.company-settings.index') });
        }
        if (userRole === 'company') {
            administrationChildren.push({ title: t('Notification Templates'), href: route('notification-templates.index') });
        }
        if (hasPermission(permissions, 'manage-settings')) {
            administrationChildren.push({ title: t('Settings'), href: route('settings') });
        }
        if (administrationChildren.length > 0) {
            items.push({ title: t('Settings'), icon: Settings, children: administrationChildren });
        } else if (hasPermission(permissions, 'manage-settings')) {
            items.push({ title: t('Settings'), href: route('settings'), icon: Settings });
        }

        return items;
    };

    const mainNavItems = getCompanyNavItems();
    const { position, effectivePosition, isRtl } = useLayout();
    const { variant, collapsible, style } = useSidebarSettings();
    const { logoLight, logoDark, favicon, updateBrandSettings } = useBrand();
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (style === 'colored') {
            setSidebarStyle({ backgroundColor: 'var(--primary)', color: 'white' });
        } else if (style === 'gradient') {
            setSidebarStyle({
                background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-foreground) 100%)',
                color: 'white'
            });
        } else {
            setSidebarStyle({});
        }
    }, [style]);

    const filterNavItems = (items: NavItem[], query: string): NavItem[] => {
        if (!query.trim()) return items;

        const lowerQuery = query.toLowerCase();

        return items.reduce((acc: NavItem[], item) => {
            const matchesTitle = item.title.toLowerCase().includes(lowerQuery);

            if (item.children) {
                const filteredChildren = filterNavItems(item.children, query);
                if (filteredChildren.length > 0 || matchesTitle) {
                    acc.push({
                        ...item,
                        children: filteredChildren.length > 0 ? filteredChildren : item.children,
                        defaultOpen: true
                    });
                }
            } else if (matchesTitle) {
                acc.push(item);
            }

            return acc;
        }, []);
    };

    const filteredNavItems = filterNavItems(mainNavItems, searchQuery);

    const getFirstAvailableHref = () => {
        if (filteredNavItems.length === 0) return route('dashboard');
        const firstItem = filteredNavItems[0];
        if (firstItem.href) {
            return firstItem.href;
        } else if (firstItem.children && firstItem.children.length > 0) {
            return firstItem.children[0].href || route('dashboard');
        }
        return route('dashboard');
    };

    return (
        <Sidebar side={effectivePosition} dir={isRtl ? 'rtl' : 'ltr'} collapsible={collapsible} variant={variant} className={style !== 'plain' ? 'sidebar-custom-style' : ''}>
            <SidebarHeader className={style !== 'plain' ? 'sidebar-styled' : ''} style={sidebarStyle}>
                <div className="flex justify-center items-center px-3 pt-3 pb-2">
                    <Link href={getFirstAvailableHref()} prefetch className="flex items-center justify-center w-full">
                        {/* Logo for expanded sidebar */}
                        <div className="group-data-[collapsible=icon]:hidden flex items-center justify-start w-full">
                            {(() => {
                                const isDark = document.documentElement.classList.contains('dark');
                                const currentLogo = isDark ? logoLight : logoDark;
                                const displayUrl = getImagePath(currentLogo) ?? currentLogo;

                                return displayUrl ? (
                                    <img
                                        key={`${currentLogo}-${Date.now()}`}
                                        src={displayUrl}
                                    alt="الشعار"
                                        className="h-10 w-auto transition-all duration-200"
                                        onError={() => updateBrandSettings({ [isDark ? 'logoLight' : 'logoDark']: '' })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 py-1 select-none w-full">
                                        <div className="h-10 w-10 rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-primary flex items-center justify-center shadow-none shrink-0">
                                            <Scale className="h-5.5 w-5.5 text-sidebar-primary" />
                                        </div>
                                        <div className="flex flex-col text-start">
                                            <span className="text-xl font-extrabold tracking-tight text-sidebar-primary leading-tight">
                                                ميزان
                                            </span>
                                            <span className="text-[11px] font-bold text-sidebar-foreground/70 leading-tight">
                                                نظام إدارة المحاماة
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Icon for collapsed sidebar */}
                        <div className="h-9 w-9 hidden group-data-[collapsible=icon]:block">
                            {(() => {
                                const displayFavicon = favicon ? getImagePath(favicon) : '';

                                return displayFavicon ? (
                                    <img
                                        key={`${favicon}-${Date.now()}`}
                                        src={displayFavicon}
                                    alt="الأيقونة"
                                        className="h-9 w-9 transition-all duration-200"
                                        onError={() => updateBrandSettings({ favicon: '' })}
                                    />
                                ) : (
                                    <div className="h-9 w-9 bg-sidebar-accent text-sidebar-primary rounded-lg border border-sidebar-border flex items-center justify-center shadow-none">
                                        <Scale className="h-5 w-5 text-sidebar-primary" />
                                    </div>
                                );
                            })()}
                        </div>
                    </Link>
                </div>

                {/* Search Input */}
                <div className="group-data-[collapsible=icon]:hidden px-2.5 pb-2">
                    <div className="relative flex items-center">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/40 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={i18n.language === 'ar' ? 'تصفية القوائم...' : t('Search menu...')}
                            className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-1.5 ps-8.5 pe-7 text-xs font-medium text-sidebar-foreground placeholder:text-sidebar-foreground/40 outline-none focus:border-sidebar-primary transition-colors shadow-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 hover:text-sidebar-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent style={sidebarStyle} className={`h-full ${style !== 'plain' ? 'sidebar-styled' : ''}`}>
                <NavMain searchQuery={searchQuery} items={filteredNavItems} position={effectivePosition} />
            </SidebarContent>
            <SidebarFooter className='p-3'>
                <div className="text-[11px] text-sidebar-foreground/40 text-center leading-relaxed select-none group-data-[collapsible=icon]:hidden">
                    نسخة تجريبية — البيانات لا تُحفظ بعد إعادة التحميل.
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
