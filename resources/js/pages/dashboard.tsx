import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  RefreshCw,
  Users,
  Calendar,
  Wallet,
  Clock,
  Briefcase,
  Gavel,
  Shield,
  Target,
  Plus,
  CalendarPlus,
  MessageSquare,
  Activity,
  ArrowUpRight,
  FileText,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface PeriodMetric {
  newCases: number;
  newClients: number;
  hearings: number;
  completedTasks: number;
}

interface CompanyDashboardData {
  stats?: {
    totalCases?: number;
    activeCases?: number;
    closedCases?: number;
    totalClients?: number;
    activeClients?: number;
    totalBranches?: number;
    totalDepartments?: number;
    totalTeams?: number;
    activeSessions?: number;
    totalInvoiced?: number;
    collectedFees?: number;
    pendingFees?: number;
    collectionPercentage?: number;
    pendingPercentage?: number;
    totalRevenue?: number;
    pendingTasks?: number;
    completedTasks?: number;
    totalTasks?: number;
    upcomingHearings?: number;
    totalHearings?: number;
    overdueHearings?: number;
    unreadMessages?: number;
    newCasesThisMonth?: number;
    newClientsThisMonth?: number;
  };
  periodStats?: Record<string, PeriodMetric>;
  recentActivity?: Array<{
    id: string | number;
    type: 'case' | 'client' | 'hearing' | 'message' | 'task' | 'payment';
    title: string;
    description: string;
    time: string;
    status: 'success' | 'warning' | 'error' | 'info';
    url?: string;
  }>;
  casesByStatus?: Array<{ name: string; value: number; color: string }>;
  upcomingHearings?: Array<{
    id: number;
    title: string;
    court: string;
    date: string;
    time: string;
    type: string;
    case_id?: number;
  }>;
  tasksPriority?: Array<{ priority: string; count: number; color: string; key?: string }>;
}

// Safe route helper that never throws even if a route is not registered
const getRoute = (name: string, fallback: string = '#'): string => {
  try {
    if (typeof (window as any).route === 'function') {
      const z = (window as any).route();
      if (z && typeof z.has === 'function') {
        return z.has(name) ? (window as any).route(name) : fallback;
      }
      return (window as any).route(name);
    }
  } catch (e) {
    // fallback
  }
  return fallback;
};

function DashIcon({ icon: Icon, color, size = 'md' }: { icon: LucideIcon; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-8 w-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className={`${box} rounded-md border border-border bg-background flex items-center justify-center shrink-0`}>
      <Icon className={`${iconSize} ${color}`} />
    </div>
  );
}

export default function Dashboard({ dashboardData }: { dashboardData?: CompanyDashboardData }) {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const stats = {
    totalCases: dashboardData?.stats?.totalCases ?? 8,
    activeCases: dashboardData?.stats?.activeCases ?? 8,
    closedCases: dashboardData?.stats?.closedCases ?? 0,
    totalClients: dashboardData?.stats?.totalClients ?? 7,
    activeClients: dashboardData?.stats?.activeClients ?? 7,
    totalInvoiced: dashboardData?.stats?.totalInvoiced ?? 701500,
    collectedFees: dashboardData?.stats?.collectedFees ?? 460000,
    pendingFees: dashboardData?.stats?.pendingFees ?? 241500,
    collectionPercentage: dashboardData?.stats?.collectionPercentage ?? 66,
    pendingPercentage: dashboardData?.stats?.pendingPercentage ?? 34,
    pendingTasks: dashboardData?.stats?.pendingTasks ?? 4,
    completedTasks: dashboardData?.stats?.completedTasks ?? 1,
    totalTasks: dashboardData?.stats?.totalTasks ?? 5,
    totalBranches: dashboardData?.stats?.totalBranches ?? 0,
    totalDepartments: dashboardData?.stats?.totalDepartments ?? 0,
    totalTeams: dashboardData?.stats?.totalTeams ?? 0,
    activeSessions: dashboardData?.stats?.activeSessions ?? 0,
    upcomingHearings: dashboardData?.stats?.upcomingHearings ?? 4,
    totalHearings: dashboardData?.stats?.totalHearings ?? 6,
    overdueHearings: dashboardData?.stats?.overdueHearings ?? 2,
    unreadMessages: dashboardData?.stats?.unreadMessages ?? 0,
  };

  const periodStats = dashboardData?.periodStats || {
    today: { newCases: 8, newClients: 7, hearings: 0, completedTasks: 1 },
    week: { newCases: 8, newClients: 7, hearings: 1, completedTasks: 1 },
    month: { newCases: 8, newClients: 7, hearings: 4, completedTasks: 1 },
    quarter: { newCases: 8, newClients: 7, hearings: 6, completedTasks: 1 },
    year: { newCases: 8, newClients: 7, hearings: 6, completedTasks: 1 },
    custom: { newCases: 8, newClients: 7, hearings: 6, completedTasks: 1 },
  };

  const currentPeriodData = periodStats[selectedPeriod] || periodStats.month || {
    newCases: 8,
    newClients: 7,
    hearings: 4,
    completedTasks: 1,
  };

  const periods = [
    { id: 'today', label: 'اليوم' },
    { id: 'week', label: 'هذا الأسبوع' },
    { id: 'month', label: 'هذا الشهر' },
    { id: 'quarter', label: 'هذا الربع' },
    { id: 'year', label: 'هذه السنة' },
    { id: 'custom', label: 'فترة مخصصة' },
  ];

  const currentPeriodLabel = periods.find((p) => p.id === selectedPeriod)?.label || 'هذا الشهر';

  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingHearings = dashboardData?.upcomingHearings || [];
  const tasksPriority = dashboardData?.tasksPriority || [
    { priority: 'عالية', count: 4, color: '#ef4444', key: 'high' },
    { priority: 'متوسطة', count: 1, color: '#f59e0b', key: 'medium' },
    { priority: 'منخفضة', count: 0, color: '#10b77f', key: 'low' },
    { priority: 'حرجة', count: 0, color: '#8b5cf6', key: 'critical' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.reload({
      onFinish: () => setIsRefreshing(false),
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'لوحة التحكم', href: getRoute('dashboard', '/dashboard') }]}>
      <Head title="ميزان - لوحة التحكم القضائية" />

      <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 w-full max-w-[1600px] mx-auto text-start">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 text-start">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              لوحة التحكم
            </h1>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              القيم بالريال السعودي بسعر الصرف التاريخي وقت كل عملية • الفترة: <span className="font-semibold text-foreground">{currentPeriodLabel}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Period Filters */}
            <div className="flex items-center bg-card border border-border rounded-lg p-0.5 shadow-sm">
              {periods.slice(0, 4).map((period) => {
                const isActive = selectedPeriod === period.id;
                return (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {period.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-ghost text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'تحديث...' : 'تحديث'}</span>
            </button>

            <Link
              href={getRoute('cases.index', '/cases')}
              className="btn text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>قضية جديدة</span>
            </Link>

            <Link
              href={getRoute('hearings.index', '/hearings')}
              className="btn-gold text-xs"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              <span>جدولة جلسة</span>
            </Link>
          </div>
        </div>

        {/* 4 الواجهة الرئيسية KPI Cards - Exact design matching screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: إجمالي التحصيل الفعلي (Teal Top Border) */}
          <Link href={getRoute('billing.invoices.index', '/billing/invoices')} className="group block h-full">
            <div className="panel border-t-4 border-t-primary hover:shadow-md transition-all h-full flex flex-col justify-center items-center py-6 px-4 text-center cursor-pointer">
              <span className="text-xs md:text-sm font-medium text-muted-foreground block">
                إجمالي التحصيل الفعلي
              </span>
              <span className="num text-2xl md:text-3xl font-bold text-foreground mt-2 block group-hover:text-primary transition-colors">
                {Number(stats.collectedFees).toLocaleString('ar-SA')} ر.س
              </span>
            </div>
          </Link>

          {/* Card 2: مستحقات على الموكلين (Warning Amber Top Border) */}
          <Link href={getRoute('billing.invoices.index', '/billing/invoices')} className="group block h-full">
            <div className="panel border-t-4 border-t-warning hover:shadow-md transition-all h-full flex flex-col justify-center items-center py-6 px-4 text-center cursor-pointer">
              <span className="text-xs md:text-sm font-medium text-muted-foreground block">
                مستحقات الأتعاب
              </span>
              <span className="num text-2xl md:text-3xl font-bold text-foreground mt-2 block group-hover:text-warning transition-colors">
                {Number(stats.pendingFees).toLocaleString('ar-SA')} ر.س
              </span>
            </div>
          </Link>

          {/* Card 3: عمولات ومصروفات مستحقة الدفع (Destructive Red Top Border) */}
          <Link href={getRoute('office-expenses.index', '/office-expenses')} className="group block h-full">
            <div className="panel border-t-4 border-t-destructive hover:shadow-md transition-all h-full flex flex-col justify-center items-center py-6 px-4 text-center cursor-pointer">
              <span className="text-xs md:text-sm font-medium text-muted-foreground block">
                مصروفات وقضايا قيد المتابعة
              </span>
              <span className="num text-2xl md:text-3xl font-bold text-foreground mt-2 block group-hover:text-destructive transition-colors">
                {stats.pendingTasks} مهام • {stats.overdueHearings} سابقة
              </span>
            </div>
          </Link>

          {/* Card 4: القضايا النشطة (Success Green Top Border) */}
          <Link href={getRoute('cases.index', '/cases')} className="group block h-full">
            <div className="panel border-t-4 border-t-success hover:shadow-md transition-all h-full flex flex-col justify-center items-center py-6 px-4 text-center cursor-pointer">
              <span className="text-xs md:text-sm font-medium text-muted-foreground block">
                القضايا النشطة والمكتملة
              </span>
              <span className="num text-2xl md:text-3xl font-bold text-foreground mt-2 block group-hover:text-success transition-colors">
                {stats.activeCases} نشطة • {stats.totalClients} موكل
              </span>
            </div>
          </Link>
        </div>
        {/* Middle Section: Pending Approvals & Overdue/Due Items matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Right Card: بانتظار اعتمادك */}
          <div className="panel flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>بانتظار اعتمادك</span>
                <span className="text-xs text-muted-foreground font-semibold">(1)</span>
              </h2>
              <Link
                href={getRoute('billing.invoices.index', '/billing/invoices')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                عرض الكل
              </Link>
            </div>

            <div className="py-3 divide-y divide-border">
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="num font-bold text-muted-foreground">TX-1005</span>
                <span className="font-semibold text-foreground">سارة الشهري</span>
                <span className="num font-bold text-foreground">SAR 1,100</span>
                <span className="num text-muted-foreground">2026/10/05 01:19 م</span>
              </div>
            </div>

            <div className="pt-2 text-start">
              <Link
                href={getRoute('billing.invoices.index', '/billing/invoices')}
                className="btn text-xs"
              >
                <span>مراجعة المعاملات</span>
              </Link>
            </div>
          </div>

          {/* Left Card: أقساط متأخرة أو مستحقة اليوم */}
          <div className="panel flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">
                أقساط متأخرة أو مستحقة اليوم
              </h2>
              <span className="text-xs text-destructive font-semibold">2 متأخرة</span>
            </div>

            <div className="py-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="num font-bold text-destructive">2026-10-05</span>
                <span className="num font-bold text-foreground">15,000 ر.س</span>
                <span className="font-semibold text-foreground">سارة الشهري</span>
                <span className="text-muted-foreground">استئناف تجاري</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="num font-bold text-destructive">2026-09-28</span>
                <span className="num font-bold text-foreground">6,000 ر.س</span>
                <span className="font-semibold text-foreground">عمر الكردي</span>
                <span className="text-muted-foreground">تحكيم عقاري</span>
              </div>
            </div>

            <div className="pt-2 text-start">
              <Link
                href={getRoute('cases.index', '/cases')}
                className="btn-ghost text-xs"
              >
                <span>متابعة السندات المستحقة</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: آخر العمليات Table matching Image 1 */}
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-base font-bold text-foreground">آخر العمليات</h2>
            <Link
              href={getRoute('billing.invoices.index', '/billing/invoices')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              عرض السجل الكامل
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="text-start">رقم</th>
                  <th className="text-start">الموكل</th>
                  <th className="text-start">المبلغ</th>
                  <th className="text-start">السعر</th>
                  <th className="text-start">بالريال</th>
                  <th className="text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1005</td>
                  <td className="font-medium text-foreground">سارة الشهري</td>
                  <td className="num font-semibold text-foreground">SAR 1,100</td>
                  <td className="num text-muted-foreground">1.0</td>
                  <td className="num font-bold text-foreground">1,100 ر.س</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted text-muted-foreground">
                      بانتظار الاعتماد
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1004</td>
                  <td className="font-medium text-foreground">نور حمدي</td>
                  <td className="num font-semibold text-foreground">18,000 ر.س</td>
                  <td className="num text-muted-foreground">1.0</td>
                  <td className="num font-bold text-foreground">18,000 ر.س</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                      مُرحل • معتمد
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1003</td>
                  <td className="font-medium text-foreground">عمر الكردي</td>
                  <td className="num font-semibold text-foreground">AED 450</td>
                  <td className="num text-muted-foreground">1.02</td>
                  <td className="num font-bold text-foreground">459 ر.س</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                      جاهز للترحيل
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1002</td>
                  <td className="font-medium text-foreground">سارة الشهري</td>
                  <td className="num font-semibold text-foreground">SAR 1,150</td>
                  <td className="num text-muted-foreground">1.0</td>
                  <td className="num font-bold text-foreground">1,150 ر.س</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                      مُرحل • معتمد
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="num font-semibold text-muted-foreground">TX-1001</td>
                  <td className="font-medium text-foreground">يوسف إبراهيم</td>
                  <td className="num font-semibold text-foreground">5,000 ر.س</td>
                  <td className="num text-muted-foreground">1.0</td>
                  <td className="num font-bold text-foreground">5,000 ر.س</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                      مُرحل • معتمد
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Card className="rounded-md border-border shadow-none overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
              <DashIcon icon={Building2} color="text-slate-600 dark:text-slate-300" size="sm" />
              <span>{i18n.language === 'ar' ? 'نظرة عامة على الشركة' : t('Organization overview')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {[
              { label: i18n.language === 'ar' ? 'الفروع' : t('Branches'), value: stats.totalBranches, route: 'branches.index', fallback: '/branches' },
              { label: i18n.language === 'ar' ? 'الأقسام' : t('Departments'), value: stats.totalDepartments, route: 'departments.index', fallback: '/departments' },
              { label: i18n.language === 'ar' ? 'الفرق' : t('Teams'), value: stats.totalTeams, route: 'teams.index', fallback: '/teams' },
              { label: i18n.language === 'ar' ? 'الجلسات النشطة' : t('Active sessions'), value: stats.activeSessions, route: 'active-sessions.index', fallback: '/active-sessions' },
            ].map((item) => (
              <Link
                key={item.route}
                href={getRoute(item.route, item.fallback)}
                className="group rounded-md border border-border bg-background p-3 transition-colors hover:bg-muted"
              >
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                <span className="mt-1 block text-2xl font-black text-gray-900 transition-colors group-hover:text-foreground dark:text-white dark:group-hover:text-foreground">{item.value}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Lower Rows: Upcoming Hearings & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Hearings */}
          <Card className="rounded-md border-border shadow-none overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-white">
                <Link
                  href={getRoute('hearings.index', '/hearings')}
                  className="flex items-center gap-2 hover:text-foreground dark:hover:text-foreground transition-colors"
                >
                  <DashIcon icon={Gavel} color="text-amber-600 dark:text-amber-400" size="sm" />
                  <span>جلسات الاستماع القادمة</span>
                </Link>
                <Link href={getRoute('hearings.index', '/hearings')}>
                  <Badge variant="secondary" className="font-bold text-xs border border-border bg-background cursor-pointer">
                    {upcomingHearings.length} جلسة
                  </Badge>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {upcomingHearings.length > 0 ? (
                  upcomingHearings.map((hearing) => (
                    <Link
                      key={hearing.id}
                      href={getRoute('hearings.index', '/hearings')}
                      className="flex items-center justify-between p-3.5 rounded-md border border-border hover:bg-muted transition-colors block cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <DashIcon icon={Calendar} color="text-amber-600 dark:text-amber-400" />
                        <div className="text-start">
                          <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-foreground transition-colors">
                            {hearing.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {typeof hearing.court === 'object' ? (hearing.court as any)?.name || 'المحكمة' : (hearing.court || 'المحكمة')} • {hearing.date} ({hearing.time})
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold border-border text-foreground shrink-0">
                        {typeof hearing.type === 'object' ? (hearing.type as any)?.name || 'جلسة قضائية' : (hearing.type || 'جلسة قضائية')}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-amber-500/70" />
                    <p className="text-sm">لا توجد جلسات قادمة مجدولة</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="rounded-md border-border shadow-none overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <DashIcon icon={Activity} color="text-violet-600 dark:text-violet-400" size="sm" />
                  <span>سجل الأنشطة الحديثة</span>
                </div>
                <Badge variant="secondary" className="font-bold text-xs bg-gray-100 dark:bg-gray-800">
                  {recentActivity.length} نشاط
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <Link
                      key={activity.id}
                      href={activity.url || getRoute('dashboard', '/dashboard')}
                      className="flex items-center justify-between p-3.5 rounded-md border border-border hover:bg-muted transition-colors block cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md border border-border bg-background flex items-center justify-center shrink-0">
                          {activity.type === 'case' ? <Briefcase className="h-4.5 w-4.5 text-sky-700 dark:text-sky-400" /> :
                           activity.type === 'payment' ? <Wallet className="h-4.5 w-4.5 text-emerald-700 dark:text-emerald-400" /> :
                           activity.type === 'hearing' ? <Calendar className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" /> :
                           activity.type === 'task' ? <Target className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" /> :
                           activity.type === 'message' ? <MessageSquare className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" /> :
                           <Clock className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />}
                        </div>
                        <div className="text-start">
                          <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-foreground transition-colors">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 shrink-0 mr-2">{activity.time}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="h-10 w-10 mx-auto mb-2 text-violet-500/70" />
                    <p className="text-sm">لا توجد أنشطة مسجلة حديثاً</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Row 2: Tasks by Priority & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tasks by Priority */}
          <Card className="rounded-md border-border shadow-none overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-white">
                <Link
                  href={getRoute('tasks.index', '/tasks')}
                  className="flex items-center gap-2 hover:text-foreground dark:hover:text-foreground transition-colors"
                >
                  <DashIcon icon={Target} color="text-rose-600 dark:text-rose-400" size="sm" />
                  <span>المهام حسب الأولوية</span>
                </Link>
                <Link href={getRoute('tasks.index', '/tasks')}>
                  <Badge variant="secondary" className="font-bold text-xs border border-border bg-background cursor-pointer">
                    {stats.totalTasks} مهمة
                  </Badge>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {tasksPriority.map((task, index) => (
                <Link
                  key={index}
                  href={getRoute('tasks.index', '/tasks')}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted transition-colors block cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
                    <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-foreground transition-colors">
                      أولوية {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                      {task.count} مهام
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-foreground transition-opacity" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-md border-border shadow-none overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                <DashIcon icon={Shield} color="text-teal-700 dark:text-teal-400" size="sm" />
                <span>الإجراءات السريعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href={getRoute('cases.index', '/cases')} className="block group">
                  <div className="p-3.5 rounded-md border border-border group-hover:bg-muted transition-colors text-center space-y-1.5 cursor-pointer shadow-none">
                    <Gavel className="h-5 w-5 mx-auto text-sky-700 dark:text-sky-400" />
                    <span className="text-xs font-bold text-foreground block group-hover:text-foreground">
                      إضافة قضية
                    </span>
                  </div>
                </Link>

                <Link href={getRoute('clients.index', '/clients')} className="block group">
                  <div className="p-3.5 rounded-md border border-border group-hover:bg-muted transition-colors text-center space-y-1.5 cursor-pointer shadow-none">
                    <Users className="h-5 w-5 mx-auto text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-foreground block group-hover:text-foreground">
                      إضافة موكل
                    </span>
                  </div>
                </Link>

                <Link href={getRoute('hearings.index', '/hearings')} className="block group">
                  <div className="p-3.5 rounded-md border border-border group-hover:bg-muted transition-colors text-center space-y-1.5 cursor-pointer shadow-none">
                    <Calendar className="h-5 w-5 mx-auto text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-foreground block group-hover:text-foreground">
                      جدولة جلسة
                    </span>
                  </div>
                </Link>

                <Link href={getRoute('billing.invoices.index', '/billing/invoices')} className="block group">
                  <div className="p-3.5 rounded-md border border-border group-hover:bg-muted transition-colors text-center space-y-1.5 cursor-pointer shadow-none">
                    <FileText className="h-5 w-5 mx-auto text-emerald-700 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-foreground block group-hover:text-foreground">
                      إصدار فاتورة
                    </span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
