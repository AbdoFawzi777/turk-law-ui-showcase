import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import {
    BarChart3,
    BriefcaseBusiness,
    Download,
    ListChecks,
    Users,
    WalletCards,
    Filter,
    RotateCcw,
    Search,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    TrendingUp,
    Scale,
    ExternalLink,
    AlertCircle,
    Calendar,
} from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Props {
    activeTab: 'matters' | 'clients' | 'billing' | 'tasks';
    filters: Record<string, any>;
    summary: {
        open_matters: number;
        active_clients: number;
        outstanding_balance: number;
        open_tasks: number;
    };
    reportData: {
        kpis: Record<string, any>;
        analytics: {
            status_distribution?: Array<{ label: string; count: number; percentage: number; amount?: number }>;
            priority_distribution?: Array<{ label: string; count: number; percentage: number }>;
            type_distribution?: Array<{ label: string; count: number; percentage: number }>;
            workload?: Array<{ name: string; count?: number; total?: number; completed?: number; overdue?: number }>;
            aging?: Array<{ label: string; amount: number; count: number }>;
            projections?: { disclaimer: string; data: Array<{ label: string; amount: number; count: number }> };
            top_clients?: Array<{ name: string; invoiced: number; outstanding: number; matters_count: number }>;
            action_needed?: Array<{
                id: number;
                title: string;
                matter_number: string;
                client_name: string;
                reason: string;
                badge: string;
                badge_type: 'default' | 'warning' | 'destructive';
            }>;
        };
        items: any[];
    };
    options: {
        clients: Array<{ id: number; name: string }>;
        users: Array<{ id: number; name: string }>;
        matters: Array<{ id: number; matter_number: string; title: string }>;
    };
    canExport: boolean;
}

export default function LegalReports({
    activeTab = 'matters',
    filters = {},
    summary,
    reportData,
    options,
    canExport,
}: Props) {
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        status: filters.status || '',
        priority: filters.priority || '',
        type: filters.type || '',
        client_id: filters.client_id || '',
        lawyer_id: filters.lawyer_id || '',
        assigned_to: filters.assigned_to || '',
        matter_id: filters.matter_id || '',
        has_balance: filters.has_balance || '',
        search: filters.search || '',
    });

    const handleFilterChange = (key: string, value: any) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const clean: Record<string, any> = { tab: activeTab };
        Object.entries(localFilters).forEach(([k, v]) => {
            if (v !== '' && v !== null && v !== undefined) {
                clean[k] = v;
            }
        });
        router.get(route('legal-reports.index'), clean, { preserveState: true });
    };

    const resetFilters = () => {
        setLocalFilters({
            date_from: '',
            date_to: '',
            status: '',
            priority: '',
            type: '',
            client_id: '',
            lawyer_id: '',
            assigned_to: '',
            matter_id: '',
            has_balance: '',
            search: '',
        });
        router.get(route('legal-reports.index'), { tab: activeTab }, { preserveState: true });
    };

    const switchTab = (newTab: 'matters' | 'clients' | 'billing' | 'tasks') => {
        router.get(route('legal-reports.index'), { tab: newTab }, { preserveState: true });
    };

    const getExportUrl = () => {
        const params = new URLSearchParams();
        Object.entries(localFilters).forEach(([k, v]) => {
            if (v) params.append(k, String(v));
        });
        const queryStr = params.toString();
        return route('legal-reports.export', activeTab) + (queryStr ? `?${queryStr}` : '');
    };

    const tabsConfig = [
        { key: 'matters', label: 'تقرير الملفات القانونية', icon: BriefcaseBusiness, desc: 'حالة الملفات، الجلسات، القضايا المرتبطة، وتوزيع الأولويات' },
        { key: 'clients', label: 'تقرير العملاء', icon: Users, desc: 'بيانات العملاء، القضايا والعقود التابعة، والمستحقات المالية' },
        { key: 'billing', label: 'تقرير الفوترة والتحصيل', icon: WalletCards, desc: 'الفواتير، نسب التحصيل، أعمار الديون، وتقديرات الاستحقاق' },
        { key: 'tasks', label: 'تقرير المهام', icon: ListChecks, desc: 'إنجاز المهام، التأخيرات، أعباء العمل وتتبع المواعيد النهائية' },
    ];

    const currentTabMeta = tabsConfig.find((t) => t.key === activeTab) || tabsConfig[0];

    return (
        <PageTemplate
            title="مركز التقارير القانونية والإدارية"
            description="لوحة تحليلية متكاملة لاستعراض مؤشرات الأداء، تتبع الالتزامات، وتصدير التقارير المعتمدة."
            url={route('legal-reports.index')}
        >
            <div dir="rtl" className="space-y-6">
                {/* 1. Global KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-r-4 border-r-blue-600 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">الملفات المفتوحة</p>
                                <strong className="mt-2 block text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-200">
                                    {(summary?.open_matters ?? 0).toLocaleString('ar-SA')}
                                </strong>
                            </div>
                            <span className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                <BriefcaseBusiness className="h-6 w-6" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-emerald-600 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">العملاء النشطون</p>
                                <strong className="mt-2 block text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-200">
                                    {(summary?.active_clients ?? 0).toLocaleString('ar-SA')}
                                </strong>
                            </div>
                            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <Users className="h-6 w-6" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-amber-600 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">إجمالي الرصيد المستحق</p>
                                <strong className="mt-2 block text-2xl font-bold tracking-tight text-amber-900 dark:text-amber-200">
                                    {Number(summary?.outstanding_balance ?? 0).toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                                    <span className="text-xs font-normal text-muted-foreground">ر.س</span>
                                </strong>
                            </div>
                            <span className="rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                <WalletCards className="h-6 w-6" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-purple-600 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">المهام الجارية والمفتوحة</p>
                                <strong className="mt-2 block text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-200">
                                    {(summary?.open_tasks ?? 0).toLocaleString('ar-SA')}
                                </strong>
                            </div>
                            <span className="rounded-xl bg-purple-50 p-3 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                                <ListChecks className="h-6 w-6" />
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Interactive Navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {tabsConfig.map((t) => {
                            const Icon = t.icon;
                            const isActive = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => switchTab(t.key as any)}
                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {canExport && (
                        <Button asChild variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                            <a href={getExportUrl()}>
                                <Download className="h-4 w-4" />
                                <span>تصدير CSV المفلتر</span>
                            </a>
                        </Button>
                    )}
                </div>

                {/* 3. Report Header & Context */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">{currentTabMeta.label}</h2>
                        <p className="text-sm text-muted-foreground">{currentTabMeta.desc}</p>
                    </div>
                </div>

                {/* 4. Interactive Filters Section */}
                <Card className="bg-card/50">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Filter className="h-4 w-4 text-primary" />
                            فلاتر التقرير المتقدمة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {/* Search */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">بحث بالنص</label>
                                <div className="relative">
                                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="بحث بالرقم أو الاسم..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pr-8 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">من تاريخ</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">إلى تاريخ</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">الحالة</label>
                                <select
                                    value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                >
                                    <option value="">جميع الحالات</option>
                                    {activeTab === 'matters' && (
                                        <>
                                            <option value="open">مفتوح</option>
                                            <option value="active">نشط</option>
                                            <option value="on_hold">معلق</option>
                                            <option value="closing">قيد الإغلاق</option>
                                            <option value="closed">مغلق</option>
                                            <option value="archived">مؤرشف</option>
                                        </>
                                    )}
                                    {activeTab === 'clients' && (
                                        <>
                                            <option value="active">نشط</option>
                                            <option value="inactive">غير نشط</option>
                                        </>
                                    )}
                                    {activeTab === 'billing' && (
                                        <>
                                            <option value="paid">مدفوع بالكامل</option>
                                            <option value="partially_paid">مدفوع جزئياً</option>
                                            <option value="unpaid">غير مدفوع</option>
                                            <option value="overdue">متأخر السداد</option>
                                            <option value="draft">مسودة</option>
                                        </>
                                    )}
                                    {activeTab === 'tasks' && (
                                        <>
                                            <option value="completed">مكتمل</option>
                                            <option value="in_progress">قيد التنفيذ</option>
                                            <option value="pending">معلق</option>
                                            <option value="on_hold">متوقف مؤقتاً</option>
                                            <option value="cancelled">ملغي</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Priority Filter (Matters & Tasks) */}
                            {(activeTab === 'matters' || activeTab === 'tasks') && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">الأولوية</label>
                                    <select
                                        value={localFilters.priority}
                                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">جميع الأولويات</option>
                                        <option value="urgent">عاجلة / حرجة</option>
                                        <option value="high">عالية</option>
                                        <option value="medium">متوسطة</option>
                                        <option value="low">منخفضة</option>
                                    </select>
                                </div>
                            )}

                            {/* Matter Type Filter (Matters) */}
                            {activeTab === 'matters' && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">نوع الملف</label>
                                    <select
                                        value={localFilters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">جميع الأنواع</option>
                                        <option value="litigation">نزاع قضائي</option>
                                        <option value="advisory">استشارات قانونية</option>
                                        <option value="corporate">شركات / تجاري</option>
                                        <option value="arbitration">تحكيم</option>
                                        <option value="labor">عمالي</option>
                                        <option value="real_estate">عقاري</option>
                                        <option value="enforcement">تنفيذ</option>
                                    </select>
                                </div>
                            )}

                            {/* Client Filter (Matters & Billing) */}
                            {(activeTab === 'matters' || activeTab === 'billing') && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">العميل</label>
                                    <select
                                        value={localFilters.client_id}
                                        onChange={(e) => handleFilterChange('client_id', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">جميع العملاء</option>
                                        {options?.clients?.map((c) => (
                                             <option key={c.id} value={c.id}>
                                                 {c.name}
                                             </option>
                                         ))}
                                    </select>
                                </div>
                            )}

                            {/* Lawyer/User Filter (Matters & Tasks) */}
                            {activeTab === 'matters' && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">المحامي المسؤول</label>
                                    <select
                                        value={localFilters.lawyer_id}
                                        onChange={(e) => handleFilterChange('lawyer_id', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">جميع المحامين</option>
                                        {options?.users?.map((u) => (
                                             <option key={u.id} value={u.id}>
                                                 {u.name}
                                             </option>
                                         ))}
                                    </select>
                                </div>
                            )}

                            {activeTab === 'tasks' && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">المسؤول عن المهمة</label>
                                    <select
                                        value={localFilters.assigned_to}
                                        onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">جميع الأعضاء</option>
                                        {options?.users?.map((u) => (
                                             <option key={u.id} value={u.id}>
                                                 {u.name}
                                             </option>
                                         ))}
                                    </select>
                                </div>
                            )}

                            {/* Client Balance filter */}
                            {activeTab === 'clients' && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">المستحقات المالية</label>
                                    <select
                                        value={localFilters.has_balance}
                                        onChange={(e) => handleFilterChange('has_balance', e.target.value)}
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">الجميع</option>
                                        <option value="yes">عملاء لديهم رصيد مستحق</option>
                                        <option value="no">عملاء بدون مستحقات</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-xs text-muted-foreground">
                                <RotateCcw className="h-3.5 w-3.5" />
                                إعادة ضبط
                            </Button>
                            <Button size="sm" onClick={applyFilters} className="gap-1.5 text-xs">
                                <Filter className="h-3.5 w-3.5" />
                                تطبيق الفلاتر
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Tab-Specific KPI Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {activeTab === 'matters' && (
                        <>
                            <Card className="bg-slate-50 dark:bg-slate-900/40">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">إجمالي الملفات (بالفلتر)</p>
                                    <strong className="mt-1 block text-xl font-bold">{reportData?.kpis?.total_matters ?? 0}</strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-emerald-800 dark:text-emerald-300">الملفات النشطة / المفتوحة</p>
                                    <strong className="mt-1 block text-xl font-bold text-emerald-900 dark:text-emerald-200">
                                        {reportData?.kpis?.active_matters ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-50 dark:bg-slate-900/40">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">ملفات مغلقة أو مؤرشفة</p>
                                    <strong className="mt-1 block text-xl font-bold">{reportData?.kpis?.closed_matters ?? 0}</strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-amber-50 dark:bg-amber-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-amber-800 dark:text-amber-300">جلسات قضائية قادمة</p>
                                    <strong className="mt-1 block text-xl font-bold text-amber-900 dark:text-amber-200">
                                        {reportData?.kpis?.upcoming_hearings ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-rose-50 dark:bg-rose-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-rose-800 dark:text-rose-300">ملفات متوقفة (+30 يوم)</p>
                                    <strong className="mt-1 block text-xl font-bold text-rose-900 dark:text-rose-200">
                                        {reportData?.kpis?.stalled_matters ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'clients' && (
                        <>
                            <Card className="bg-slate-50 dark:bg-slate-900/40">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">إجمالي العملاء</p>
                                    <strong className="mt-1 block text-xl font-bold">{reportData?.kpis?.total_clients ?? 0}</strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-emerald-800 dark:text-emerald-300">عملاء نشطون</p>
                                    <strong className="mt-1 block text-xl font-bold text-emerald-900 dark:text-emerald-200">
                                        {reportData?.kpis?.active_clients ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 dark:bg-blue-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">إجمالي المفوتر</p>
                                    <strong className="mt-1 block text-xl font-bold text-blue-900 dark:text-blue-200">
                                        {Number(reportData?.kpis?.total_invoiced ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-amber-50 dark:bg-amber-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-amber-800 dark:text-amber-300">المستحقات القائمة</p>
                                    <strong className="mt-1 block text-xl font-bold text-amber-900 dark:text-amber-200">
                                        {Number(reportData?.kpis?.total_outstanding ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-rose-50 dark:bg-rose-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-rose-800 dark:text-rose-300">عملاء بمتأخرات سداد</p>
                                    <strong className="mt-1 block text-xl font-bold text-rose-900 dark:text-rose-200">
                                        {reportData?.kpis?.clients_with_overdue ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'billing' && (
                        <>
                            <Card className="bg-slate-50 dark:bg-slate-900/40">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">إجمالي الفواتير الصادرة</p>
                                    <strong className="mt-1 block text-xl font-bold">
                                        {Number(reportData?.kpis?.total_invoiced ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-emerald-800 dark:text-emerald-300">إجمالي المحصل</p>
                                    <strong className="mt-1 block text-xl font-bold text-emerald-900 dark:text-emerald-200">
                                        {Number(reportData?.kpis?.total_collected ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-amber-50 dark:bg-amber-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-amber-800 dark:text-amber-300">الرصيد المستحق القائم</p>
                                    <strong className="mt-1 block text-xl font-bold text-amber-900 dark:text-amber-200">
                                        {Number(reportData?.kpis?.total_outstanding ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-rose-50 dark:bg-rose-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-rose-800 dark:text-rose-300">إجمالي المتأخرات</p>
                                    <strong className="mt-1 block text-xl font-bold text-rose-900 dark:text-rose-200">
                                        {Number(reportData?.kpis?.total_overdue ?? 0).toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 dark:bg-blue-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">معدل التحصيل الفعلي</p>
                                    <strong className="mt-1 block text-xl font-bold text-blue-900 dark:text-blue-200">
                                        {reportData?.kpis?.collection_rate ?? 0} %
                                    </strong>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'tasks' && (
                        <>
                            <Card className="bg-slate-50 dark:bg-slate-900/40">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">إجمالي المهام</p>
                                    <strong className="mt-1 block text-xl font-bold">{reportData?.kpis?.total_tasks ?? 0}</strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-emerald-800 dark:text-emerald-300">المهام المكتملة</p>
                                    <strong className="mt-1 block text-xl font-bold text-emerald-900 dark:text-emerald-200">
                                        {reportData?.kpis?.completed_tasks ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 dark:bg-blue-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">المهام المفتوحة</p>
                                    <strong className="mt-1 block text-xl font-bold text-blue-900 dark:text-blue-200">
                                        {reportData?.kpis?.open_tasks ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-rose-50 dark:bg-rose-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-rose-800 dark:text-rose-300">المهام المتأخرة</p>
                                    <strong className="mt-1 block text-xl font-bold text-rose-900 dark:text-rose-200">
                                        {reportData?.kpis?.overdue_tasks ?? 0}
                                    </strong>
                                </CardContent>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-purple-950/30">
                                <CardContent className="p-4">
                                    <p className="text-xs text-purple-800 dark:text-purple-300">نسبة الإنجاز</p>
                                    <strong className="mt-1 block text-xl font-bold text-purple-900 dark:text-purple-200">
                                        {reportData?.kpis?.completion_rate ?? 0} %
                                    </strong>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* 6. Visual Analytical Summaries & Action Items */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Distribution Summary (Left/Col 1) */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-semibold">توزيع الحالات والنسب</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 pt-2">
                            {reportData?.analytics?.status_distribution?.length ? (
                                reportData.analytics.status_distribution.map((item, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-foreground">{item.label}</span>
                                            <span className="text-muted-foreground">
                                                {item.count} ({item.percentage}%)
                                            </span>
                                        </div>
                                        <Progress value={item.percentage} className="h-1.5" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">لا توجد بيانات كافية لعرض التوزيع.</p>
                            )}

                            {/* Additional distribution for matters (type) */}
                            {activeTab === 'matters' && Boolean(reportData?.analytics?.type_distribution?.length) && (
                                <div className="mt-4 border-t pt-3">
                                    <p className="mb-2 text-xs font-semibold text-muted-foreground">توزيع أنواع الملفات:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {reportData?.analytics?.type_distribution?.slice(0, 5).map((t, idx) => (
                                            <Badge key={idx} variant="outline" className="text-[11px]">
                                                {t.label}: {t.count}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Middle Column: Aging or Workload or Top Clients */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-semibold">
                                {activeTab === 'billing' && 'تحليل أعمار الديون (Aging)'}
                                {activeTab === 'matters' && 'توزيع عبء العمل حسب المحامي'}
                                {activeTab === 'tasks' && 'أعباء عمل الفريق والمهام'}
                                {activeTab === 'clients' && 'أبرز العملاء نشاطاً وفوترة'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4 pt-2">
                            {activeTab === 'billing' && (
                                <div className="space-y-2">
                                    {reportData?.analytics?.aging?.map((b, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-md border p-2 text-xs">
                                            <span className="font-medium text-foreground">{b.label}</span>
                                            <div className="text-left font-mono">
                                                <span className="font-semibold text-amber-700 dark:text-amber-300">
                                                    {Number(b.amount).toLocaleString('ar-SA')} ر.س
                                                </span>{' '}
                                                <span className="text-[10px] text-muted-foreground">({b.count})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'matters' && (
                                <div className="space-y-2">
                                    {reportData?.analytics?.workload?.length ? (
                                        reportData.analytics.workload.slice(0, 5).map((w, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-md border p-2 text-xs">
                                                <span className="font-medium">{w.name}</span>
                                                <Badge variant="secondary">{w.count} ملفات</Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">لا توجد بيانات محامين مسجلة بالملفات.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'tasks' && (
                                <div className="space-y-2">
                                    {reportData?.analytics?.workload?.length ? (
                                        reportData.analytics.workload.slice(0, 5).map((w, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-md border p-2 text-xs">
                                                <span className="font-medium">{w.name}</span>
                                                <div className="flex gap-1.5">
                                                    <Badge variant="outline">{w.total} مهام</Badge>
                                                    {Boolean(w.overdue) && <Badge variant="destructive">{w.overdue} متأخرة</Badge>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">لا توجد مهام موزعة على مسؤولين.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'clients' && (
                                <div className="space-y-2">
                                    {reportData?.analytics?.top_clients?.length ? (
                                        reportData.analytics.top_clients.map((c, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-md border p-2 text-xs">
                                                <div>
                                                    <p className="font-medium">{c.name}</p>
                                                    <span className="text-[10px] text-muted-foreground">{c.matters_count} ملفات</span>
                                                </div>
                                                <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                                    {Number(c.invoiced).toLocaleString('ar-SA')} ر.س
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">لا توجد بيانات فواتير كافية.</p>
                                    )}
                                </div>
                            )}

                            {/* Projections for Billing */}
                            {activeTab === 'billing' && reportData?.analytics?.projections && (
                                <div className="mt-4 rounded-lg bg-blue-50/50 p-3 dark:bg-blue-950/20">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 dark:text-blue-200">
                                        <TrendingUp className="h-4 w-4" />
                                        تقديرات التحصيلات المتوقعة
                                    </div>
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        {reportData.analytics.projections.disclaimer}
                                    </p>
                                    <div className="mt-2.5 space-y-1.5">
                                        {reportData.analytics.projections.data.map((p, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">{p.label}:</span>
                                                <span className="font-mono font-semibold text-foreground">
                                                    {Number(p.amount).toLocaleString('ar-SA')} ر.س
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column: Action Needed List */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                عناصر تتطلب متابعة / إجراء
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 p-4 pt-2">
                            {reportData?.analytics?.action_needed?.length ? (
                                reportData.analytics.action_needed.map((item, idx) => (
                                    <div key={idx} className="rounded-lg border bg-muted/30 p-2.5 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground">{item.title}</span>
                                            <Badge
                                                variant={
                                                    item.badge_type === 'destructive'
                                                        ? 'destructive'
                                                        : item.badge_type === 'warning'
                                                        ? 'secondary'
                                                        : 'default'
                                                }
                                                className="text-[10px]"
                                            >
                                                {item.badge}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-muted-foreground">{item.reason}</p>
                                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span>{item.client_name}</span>
                                            {activeTab === 'matters' && (
                                                <Link href={`/matters/${item.id}`} className="text-primary hover:underline inline-flex items-center gap-0.5">
                                                    عرض الملف <ExternalLink className="h-2.5 w-2.5" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-32 flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
                                    <p className="mt-2 text-xs font-medium text-muted-foreground">لا توجد حالات حرجة أو متأخرة حالياً.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 7. Detailed Interactive Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div>
                            <CardTitle className="text-base font-semibold">السجلات التفصيلية للتقرير</CardTitle>
                            <CardDescription className="text-xs">
                                استعراض مباشر لبيانات {currentTabMeta.label} مع روابط الانتقال المباشر.
                            </CardDescription>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            عرض {reportData?.items?.length ?? 0} سجل
                        </span>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-xs">
                                <thead className="border-y bg-muted/40 text-muted-foreground">
                                    {activeTab === 'matters' && (
                                        <tr>
                                            <th className="p-3 font-semibold">رقم الملف</th>
                                            <th className="p-3 font-semibold">عنوان الملف</th>
                                            <th className="p-3 font-semibold">العميل</th>
                                            <th className="p-3 font-semibold">النوع</th>
                                            <th className="p-3 font-semibold">الأولوية</th>
                                            <th className="p-3 font-semibold">الحالة</th>
                                            <th className="p-3 font-semibold">المحامي المسؤول</th>
                                            <th className="p-3 font-semibold">القضايا / العقود</th>
                                            <th className="p-3 font-semibold">الجلسة القادمة</th>
                                            <th className="p-3 font-semibold">التاريخ</th>
                                        </tr>
                                    )}
                                    {activeTab === 'clients' && (
                                        <tr>
                                            <th className="p-3 font-semibold">رقم العميل</th>
                                            <th className="p-3 font-semibold">اسم العميل</th>
                                            <th className="p-3 font-semibold">الحالة</th>
                                            <th className="p-3 font-semibold">التواصل</th>
                                            <th className="p-3 font-semibold">الملفات / القضايا</th>
                                            <th className="p-3 font-semibold">إجمالي المفوتر</th>
                                            <th className="p-3 font-semibold">المبالغ المحصلة</th>
                                            <th className="p-3 font-semibold">الرصيد المستحق</th>
                                            <th className="p-3 font-semibold">تاريخ التسجيل</th>
                                        </tr>
                                    )}
                                    {activeTab === 'billing' && (
                                        <tr>
                                            <th className="p-3 font-semibold">رقم الفاتورة</th>
                                            <th className="p-3 font-semibold">العميل</th>
                                            <th className="p-3 font-semibold">القضية</th>
                                            <th className="p-3 font-semibold">تاريخ الإصدار</th>
                                            <th className="p-3 font-semibold">تاريخ الاستحقاق</th>
                                            <th className="p-3 font-semibold">الإجمالي</th>
                                            <th className="p-3 font-semibold">المحصل</th>
                                            <th className="p-3 font-semibold">الرصيد المتبقي</th>
                                            <th className="p-3 font-semibold">الحالة</th>
                                            <th className="p-3 font-semibold">أيام التأخير</th>
                                        </tr>
                                    )}
                                    {activeTab === 'tasks' && (
                                        <tr>
                                            <th className="p-3 font-semibold">رقم المهمة</th>
                                            <th className="p-3 font-semibold">عنوان المهمة</th>
                                            <th className="p-3 font-semibold">الملف القانوني</th>
                                            <th className="p-3 font-semibold">المسؤول</th>
                                            <th className="p-3 font-semibold">الأولوية</th>
                                            <th className="p-3 font-semibold">الحالة</th>
                                            <th className="p-3 font-semibold">تاريخ الاستحقاق</th>
                                            <th className="p-3 font-semibold">حالة الموعد</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y">
                                    {(reportData?.items?.length ?? 0) > 0 ? (
                                        reportData.items.map((row) => (
                                            <tr key={row.id} className="transition-colors hover:bg-muted/20">
                                                {/* Matters Row */}
                                                {activeTab === 'matters' && (
                                                    <>
                                                        <td className="p-3 font-mono font-medium text-primary">
                                                            <Link href={`/matters/${row.id}`} className="hover:underline">
                                                                {row.matter_number}
                                                            </Link>
                                                        </td>
                                                        <td className="p-3 font-medium text-foreground">{row.title}</td>
                                                        <td className="p-3 text-muted-foreground">{row.client?.name || '—'}</td>
                                                        <td className="p-3">{row.matter_type_ar}</td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={
                                                                    row.priority === 'urgent' || row.priority === 'critical'
                                                                        ? 'destructive'
                                                                        : row.priority === 'high'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                                }
                                                                className="text-[10px]"
                                                            >
                                                                {row.priority_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={row.status === 'open' || row.status === 'active' ? 'default' : 'secondary'}
                                                                className="text-[10px]"
                                                            >
                                                                {row.status_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">{row.responsible_lawyer?.name || '—'}</td>
                                                        <td className="p-3 text-muted-foreground">
                                                            {row.cases_count} قضايا / {row.contracts_count} عقود
                                                        </td>
                                                        <td className="p-3 font-mono text-muted-foreground">
                                                            {row.next_hearing_date || '—'}
                                                        </td>
                                                        <td className="p-3 font-mono text-muted-foreground">{row.created_at}</td>
                                                    </>
                                                )}

                                                {/* Clients Row */}
                                                {activeTab === 'clients' && (
                                                    <>
                                                        <td className="p-3 font-mono font-medium text-primary">
                                                            <Link href={`/clients/${row.id}`} className="hover:underline">
                                                                {row.client_id}
                                                            </Link>
                                                        </td>
                                                        <td className="p-3 font-medium text-foreground">{row.name}</td>
                                                        <td className="p-3">
                                                            <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                                                                {row.status_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">{row.phone || row.email || '—'}</td>
                                                        <td className="p-3 text-muted-foreground">
                                                            {row.matters_count} ملفات ({row.cases_count} قضايا)
                                                        </td>
                                                        <td className="p-3 font-mono text-foreground">
                                                            {Number(row.total_invoiced).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3 font-mono text-emerald-700 dark:text-emerald-300">
                                                            {Number(row.total_paid).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3 font-mono font-semibold text-amber-700 dark:text-amber-300">
                                                            {Number(row.balance_amount).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3 font-mono text-muted-foreground">{row.created_at}</td>
                                                    </>
                                                )}

                                                {/* Billing Row */}
                                                {activeTab === 'billing' && (
                                                    <>
                                                        <td className="p-3 font-mono font-medium text-primary">
                                                            <Link href={`/invoices/${row.id}`} className="hover:underline">
                                                                {row.invoice_number}
                                                            </Link>
                                                        </td>
                                                        <td className="p-3 font-medium text-foreground">{row.client?.name || '—'}</td>
                                                        <td className="p-3 text-muted-foreground">{row.case?.title || '—'}</td>
                                                        <td className="p-3 font-mono text-muted-foreground">{row.issue_date}</td>
                                                        <td className="p-3 font-mono text-muted-foreground">{row.due_date}</td>
                                                        <td className="p-3 font-mono font-medium text-foreground">
                                                            {Number(row.total_amount).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3 font-mono text-emerald-700 dark:text-emerald-300">
                                                            {Number(row.paid_amount).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-300">
                                                            {Number(row.balance_amount).toLocaleString('ar-SA')} ر.س
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={
                                                                    row.status === 'paid'
                                                                        ? 'default'
                                                                        : row.status === 'partially_paid'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                                }
                                                                className="text-[10px]"
                                                            >
                                                                {row.status_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 font-mono">
                                                            {row.days_overdue > 0 ? (
                                                                <span className="font-semibold text-rose-600">
                                                                    {row.days_overdue} يوم
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}

                                                {/* Tasks Row */}
                                                {activeTab === 'tasks' && (
                                                    <>
                                                        <td className="p-3 font-mono font-medium text-primary">
                                                            <Link href={`/tasks/${row.id}`} className="hover:underline">
                                                                {row.task_id}
                                                            </Link>
                                                        </td>
                                                        <td className="p-3 font-medium text-foreground">{row.title}</td>
                                                        <td className="p-3 text-muted-foreground">
                                                            {row.matter?.matter_number || row.case?.title || '—'}
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">{row.assigned_user?.name || '—'}</td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={
                                                                    row.priority === 'urgent'
                                                                        ? 'destructive'
                                                                        : row.priority === 'high'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                                }
                                                                className="text-[10px]"
                                                            >
                                                                {row.priority_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={row.status === 'completed' ? 'default' : 'secondary'}
                                                                className="text-[10px]"
                                                            >
                                                                {row.status_ar}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 font-mono text-muted-foreground">{row.due_date}</td>
                                                        <td className="p-3">
                                                            {row.is_overdue ? (
                                                                <Badge variant="destructive" className="text-[10px]">
                                                                    متأخرة
                                                                </Badge>
                                                            ) : row.status === 'completed' ? (
                                                                <Badge variant="outline" className="text-[10px] text-emerald-600">
                                                                    منجزة
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">في الموعد</span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="p-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="h-8 w-8 text-muted-foreground/40" />
                                                    <p className="mt-2 text-sm font-medium">لا توجد سجلات تطابق معايير الفلترة المحددة.</p>
                                                    <p className="text-xs text-muted-foreground">جرب تغيير الفترة الزمنية أو إعادة ضبط الفلاتر.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
