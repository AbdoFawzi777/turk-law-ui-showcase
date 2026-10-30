import { type FormEvent, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileSignature,
  FileText,
  FolderPlus,
  Gavel,
  Landmark,
  Plus,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  User,
  UserCheck,
  UserPlus,
  Users,
  Trash2,
  X,
} from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

// Utility formatters
const formatDateAr = (value: any) => {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return String(value);
  }
};

const formatCurrencyAr = (value: any, currency = 'ر.س') => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (isNaN(num)) return `${value} ${currency}`;
  return `${num.toLocaleString('en-US')} ${currency}`;
};

// Translators & Mappers
const getMatterTypeLabel = (type?: string) => {
  switch (type) {
    case 'litigation':
      return 'تقاضي ونزاع قضائي';
    case 'advisory':
      return 'استشارة ورأي قانوني';
    case 'corporate':
      return 'شركات وتأسيس';
    case 'contract':
      return 'صياغة وتدقيق عقود';
    case 'legal_consultation':
      return 'استشارة قانونية';
    case 'arbitration':
      return 'تحكيم';
    case 'enforcement':
      return 'تنفيذ الأحكام';
    case 'debt_collection':
      return 'تحصيل الديون';
    case 'legal_research':
      return 'بحث قانوني';
    case 'other':
      return 'أخرى';
    default:
      return type || 'ملف قانوني عام';
  }
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'open':
      return { label: 'قيد المتابعة والعمل', className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' };
    case 'intake_approved':
      return { label: 'تمت الموافقة على الاستقبال', className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' };
    case 'active':
      return { label: 'نشط', className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' };
    case 'on_hold':
      return { label: 'معلق', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
    case 'awaiting_client':
      return { label: 'بانتظار العميل', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
    case 'awaiting_external_party':
      return { label: 'بانتظار طرف خارجي', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
    case 'closing':
      return { label: 'قيد الإغلاق', className: 'bg-muted text-muted-foreground border-border' };
    case 'in_progress':
      return { label: 'جارٍ التنفيذ', className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' };
    case 'pending':
      return { label: 'معلق بانتظار إجراء', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
    case 'closed':
      return { label: 'مغلق ومحفوظ', className: 'bg-muted text-muted-foreground border-border' };
    case 'archived':
      return { label: 'مؤرشف', className: 'bg-muted text-muted-foreground border-border' };
    default:
      return { label: status || 'نشط', className: 'bg-muted text-muted-foreground border-border' };
  }
};

const getPriorityBadge = (priority?: string) => {
  switch (priority) {
    case 'critical':
      return { label: 'حرجة', className: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300' };
    case 'high':
      return { label: 'عالية', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
    case 'medium':
      return { label: 'متوسطة', className: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300' };
    case 'low':
      return { label: 'منخفضة', className: 'bg-muted text-muted-foreground border-border' };
    default:
      return { label: priority || 'غير محددة', className: 'bg-muted text-muted-foreground border-border' };
  }
};

const translateHealthFactor = (reason: string) => {
  const map: Record<string, string> = {
    'Overdue deadline': 'وجود موعد نهائي متأخر وغير منجز',
    'No update in the last 14 days': 'لم يتم تحديث الملف خلال آخر 14 يوماً',
    'No responsible lawyer': 'لم يتم تعيين محامٍ مسؤول للملف',
    'No hearing scheduled': 'لا توجد جلسات مجدولة قادمة',
    'High risk assessment': 'تقييم مخاطر مرتفع',
  };
  return map[reason] || reason;
};

const getSideBadge = (side?: string) => {
  switch (side) {
    case 'our_side':
      return { label: 'طرفنا (الموكل)', className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300' };
    case 'opposing_side':
      return { label: 'الطرف الخصم', className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300' };
    case 'neutral':
      return { label: 'طرف محايد', className: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300' };
    default:
      return { label: 'طرف خارجي', className: 'bg-muted text-muted-foreground border-border' };
  }
};

const getMatterRoleLabel = (role?: string) => {
  switch (role) {
    case 'responsible_lawyer':
      return 'المحامي المسؤول';
    case 'partner':
      return 'الشريك المشرف';
    case 'supporting_lawyer':
      return 'محامٍ مساند';
    case 'paralegal':
      return 'مساعد / باحث قانوني';
    default:
      return role || 'عضو فريق';
  }
};

const getStageLabel = (stage?: string) => {
  if (!stage) return 'قيد النظر';
  switch (stage) {
    case 'expert_review':
      return 'دراسة واستجواب الخبير الهندسي';
    case 'pleadings':
      return 'تبادل المذكرات والمرافعة';
    case 'first_instance':
      return 'المرحلة الابتدائية';
    case 'appeal':
      return 'مرحلة الاستئناف';
    case 'supreme_court':
      return 'المحكمة العليا';
    case 'verdict':
      return 'صدور الحكم';
    case 'execution':
      return 'مرحلة التنفيذ';
    default:
      return stage;
  }
};

const getHealthInfo = (level?: string, score?: number) => {
  if (level === 'critical' || (score !== undefined && score < 50)) {
    return {
      label: 'حالة حرجة تتطلب تدخلاً',
      borderClass: 'border-red-500/30',
      bgClass: 'bg-red-50/70 dark:bg-red-950/30',
      textClass: 'text-red-700 dark:text-red-400',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
    };
  }
  if (level === 'attention' || (score !== undefined && score < 75)) {
    return {
      label: 'يحتاج متابعة وتحديث',
      borderClass: 'border-amber-500/30',
      bgClass: 'bg-amber-50/70 dark:bg-amber-950/30',
      textClass: 'text-amber-700 dark:text-amber-400',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
    };
  }
  return {
    label: 'مؤشر ممتاز ومستقر',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  };
};

export default function MatterShow() {
  const { t } = useTranslation();
  const {
    matter,
    timeline,
    health,
    users = [],
    parties = [],
    caseTypes = [],
    caseStatuses = [],
    courts = [],
    documentCategories = [],
    matterTypes = [],
    matterStatuses = [],
    priorities = [],
    can = {},
  } = usePage().props as any;
  const [tab, setTab] = useState('overview');
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Edit Matter Form State
  const [editForm, setEditForm] = useState({
    title: matter.title || '',
    matter_type: matter.matter_type || 'litigation',
    status: matter.status || 'open',
    priority: matter.priority || 'medium',
    estimated_value: matter.estimated_value || '',
    responsible_lawyer_id: matter.responsible_lawyer_id || '',
    responsible_partner_id: matter.responsible_partner_id || '',
    description: matter.description || '',
  });

  // Operational Document Form State
  const [docForm, setDocForm] = useState<{
    title: string;
    category: string;
    file: File | null;
  }>({
    title: '',
    category: 'pleading',
    file: null,
  });

  // Quick Action Forms State
  const [teamForm, setTeamForm] = useState({
    user_id: '',
    matter_role: 'supporting_lawyer',
    hourly_rate: '',
  });

  const [partyForm, setPartyForm] = useState({
    party_id: '',
    role: '',
    side: 'opposing_side',
    is_primary: false,
  });

  const [caseForm, setCaseForm] = useState({
    title: '',
    representation_capacity: 'وكيل المدعية',
    case_type_id: '',
    case_status_id: '',
    court_id: '',
    internal_case_number: '',
    court_case_number: '',
    filed_date: new Date().toISOString().slice(0, 10),
  });

  const submitEditMatter = (e: FormEvent) => {
    e.preventDefault();
    router.patch(route('matters.update', matter.id), editForm, {
      preserveScroll: true,
      onSuccess: () => setOpenAction(null),
    });
  };

  const handleArchive = () => {
    if (confirm('هل أنت متأكد من رغبتك في أرشفة هذا الملف القانوني بأمان؟ سيبقى محفوظاً في السجلات.')) {
      router.post(route('matters.archive', matter.id), {}, { preserveScroll: true });
    }
  };

  const handleRestore = () => {
    if (confirm('هل ترغب في استعادة هذا الملف القانوني من الأرشيف وتفعيله مجدداً؟')) {
      router.post(route('matters.restore', matter.id), {}, { preserveScroll: true });
    }
  };

  const handleDelete = () => {
    if (confirm(`هل أنت متأكد من رغبتك في أرشفة الملف القانوني (${matter.matter_number})؟\nسيتم حفظ ونقل الملف إلى الأرشيف مع الحفاظ الكامل على كافة المستندات والعقود والجلسات والسجلات المالية المرتبطة به.`)) {
      router.delete(route('matters.destroy', matter.id));
    }
  };

  const submitDocument = (e: FormEvent) => {
    e.preventDefault();
    if (!docForm.file) {
      alert('الرجاء اختيار ملف المستند للرفع.');
      return;
    }
    const formData = new FormData();
    formData.append('title', docForm.title);
    formData.append('category', docForm.category);
    formData.append('file', docForm.file);

    router.post(route('matters.documents.store', matter.id), formData, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenAction(null);
        setDocForm({ title: '', category: 'pleading', file: null });
      },
    });
  };

  const statusInfo = getStatusBadge(matter.status);
  const priorityInfo = getPriorityBadge(matter.priority);
  const healthInfo = getHealthInfo(health?.level, health?.score);
  const nextHearing =
    matter.next_hearing ||
    (matter.hearings || []).find((h: any) => h.status === 'scheduled' || h.status === 'active') ||
    matter.hearings?.[0];

  const nextDeadline =
    matter.next_deadline ||
    (matter.deadlines || []).find((d: any) => d.status !== 'completed' && d.status !== 'cancelled') ||
    matter.deadlines?.[0];

  const copyMatterNumber = () => {
    if (matter.matter_number) {
      navigator.clipboard.writeText(matter.matter_number);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const submitTeam = (e: FormEvent) => {
    e.preventDefault();
    router.post(route('matters.team.store', matter.id), teamForm, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenAction(null);
        setTeamForm({ user_id: '', matter_role: 'supporting_lawyer', hourly_rate: '' });
      },
    });
  };

  const submitParty = (e: FormEvent) => {
    e.preventDefault();
    router.post(route('matters.parties.store', matter.id), partyForm, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenAction(null);
        setPartyForm({ party_id: '', role: '', side: 'opposing_side', is_primary: false });
      },
    });
  };

  const submitCase = (e: FormEvent) => {
    e.preventDefault();
    router.post(route('matters.cases.store', matter.id), caseForm, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenAction(null);
        setCaseForm({
          title: '',
          representation_capacity: 'وكيل المدعية',
          case_type_id: '',
          case_status_id: '',
          court_id: '',
          internal_case_number: '',
          court_case_number: '',
          filed_date: new Date().toISOString().slice(0, 10),
        });
      },
    });
  };

  return (
    <PageTemplate
      title={matter.title}
      description={`رقم الملف: ${matter.matter_number} · العميل: ${matter.client?.name ?? 'غير محدد'}`}
      url={route('matters.show', matter.id)}
      breadcrumbs={[
        { title: 'الملفات القانونية', href: route('matters.index') },
        { title: matter.matter_number, href: route('matters.show', matter.id) },
      ]}
      actions={[
        ...(can.update ? [{
          label: 'تعديل الملف',
          icon: <Edit3 className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: () => setOpenAction(openAction === 'edit_matter' ? null : 'edit_matter'),
        }] : []),
        ...(matter.status === 'archived' && can.restore ? [{
          label: 'استعادة من الأرشيف',
          icon: <RotateCcw className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: handleRestore,
        }] : []),
        ...(matter.status !== 'archived' && can.archive ? [{
          label: 'أرشفة الملف',
          icon: <Archive className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: handleArchive,
        }] : []),
        ...(can.delete ? [{
          label: 'حذف الملف',
          icon: <Trash2 className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: handleDelete,
        }] : []),
        {
          label: 'العودة للملفات',
          icon: <ArrowLeft className="h-4 w-4" />,
          variant: 'outline',
          onClick: () => router.get(route('matters.index')),
        },
      ]}
      noPadding
    >
      <div className="space-y-5" dir="rtl">
        {/* 1. الواجهة الرئيسية Summary Card & Fast Actions */}
        <div className="rounded-xl border border-border/70 bg-gradient-to-b from-card via-card to-muted/20 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Badges & Client Meta */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyMatterNumber}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-muted text-foreground border border-border hover:bg-accent transition-colors cursor-pointer"
                  title="نسخ رقم الملف"
                >
                  <span dir="ltr">{matter.matter_number}</span>
                  {copiedCode ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-60" />}
                </button>

                <Badge variant="outline" className="gap-1 font-medium border-primary/20 text-primary bg-primary/5">
                  <Scale className="h-3.5 w-3.5" />
                  {getMatterTypeLabel(matter.matter_type)}
                </Badge>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.className}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusInfo.label}
                </span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.className}`}>
                  {priorityInfo.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-muted-foreground/70" />
                  <span>الموكل:</span>
                  <strong className="text-foreground font-semibold">{matter.client?.name || '—'}</strong>
                  {matter.client?.phone && <span className="text-xs text-muted-foreground">({matter.client.phone})</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-muted-foreground/70" />
                  <span>المطالبة التقديرية:</span>
                  <span className="text-primary font-bold num" dir="ltr">
                    {formatCurrencyAr(matter.estimated_value, matter.currency)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground/70" />
                  <span>تاريخ الفتح:</span>
                  <span dir="rtl" className="text-foreground font-medium">{formatDateAr(matter.open_date)}</span>
                </div>
              </div>
            </div>

            {/* Right: Health Score Widget & Fast Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Health Score Pill */}
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${healthInfo.bgClass} ${healthInfo.borderClass}`}>
                <div className="text-2xl font-extrabold num text-foreground leading-none" dir="ltr">
                  {health?.score ?? '—'}
                  <span className="text-xs font-normal text-muted-foreground ms-0.5">%</span>
                </div>
                <div className="border-s border-border/60 ps-3">
                  <div className="text-[11px] font-bold text-muted-foreground">سلامة الملف</div>
                  <div className={`text-xs font-bold ${healthInfo.textClass}`}>
                    {healthInfo.label}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {can.assign && (
                  <Button
                    type="button"
                    size="sm"
                    variant={openAction === 'team' ? 'default' : 'outline'}
                    onClick={() => setOpenAction(openAction === 'team' ? null : 'team')}
                    className="gap-1.5 cursor-pointer text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>إضافة عضو فريق</span>
                  </Button>
                )}

                {can.partyEdit && (
                  <Button
                    type="button"
                    size="sm"
                    variant={openAction === 'party' ? 'default' : 'outline'}
                    onClick={() => setOpenAction(openAction === 'party' ? null : 'party')}
                    className="gap-1.5 cursor-pointer text-xs"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>إضافة طرف</span>
                  </Button>
                )}

                {can.uploadDocument && (
                  <Button
                    type="button"
                    size="sm"
                    variant={openAction === 'doc' ? 'default' : 'outline'}
                    onClick={() => setOpenAction(openAction === 'doc' ? null : 'doc')}
                    className="gap-1.5 cursor-pointer text-xs"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>رفع مستند</span>
                  </Button>
                )}

                {can.caseCreate && matter.matter_type === 'litigation' && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setOpenAction(openAction === 'case' ? null : 'case')}
                    className="gap-1.5 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer text-xs"
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    <span>تسجيل قضية</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Action Drawer */}
        {openAction && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                {openAction === 'team' && <UserPlus className="h-4 w-4 text-primary" />}
                {openAction === 'party' && <Users className="h-4 w-4 text-primary" />}
                {openAction === 'case' && <Gavel className="h-4 w-4 text-primary" />}
                {openAction === 'doc' && <UploadCloud className="h-4 w-4 text-primary" />}
                {openAction === 'edit_matter' && <Edit3 className="h-4 w-4 text-primary" />}
                <span>
                  {openAction === 'team' && 'تعيين عضو جديد في فريق العمل على الملف'}
                  {openAction === 'party' && 'إضافة طرف جديد إلى أطراف النزاع'}
                  {openAction === 'case' && 'تسجيل قضية جديدة بالمحكمة وربطها بهذا الملف'}
                  {openAction === 'doc' && 'رفع مستند تشغيلي جديد للملف'}
                  {openAction === 'edit_matter' && 'تعديل بيانات الملف القانوني'}
                </span>
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpenAction(null)} className="cursor-pointer">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {openAction === 'team' && (
              <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={submitTeam}>
                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">المحامي / الموظف المسند إليه *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={teamForm.user_id}
                    onChange={(e) => setTeamForm({ ...teamForm, user_id: e.target.value })}
                  >
                    <option value="">اختر عضواً من الفريق...</option>
                    {users.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.job_title ? ` · (${user.job_title})` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">الدور والمسؤولية في الملف *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={teamForm.matter_role}
                    onChange={(e) => setTeamForm({ ...teamForm, matter_role: e.target.value })}
                  >
                    <option value="responsible_lawyer">المحامي المسؤول</option>
                    <option value="supporting_lawyer">محامٍ مساند</option>
                    <option value="paralegal">مساعد / باحث قانوني</option>
                    <option value="partner">شريك مشرف</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <Button type="submit" className="gap-1.5 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>تأكيد الإسناد</span>
                  </Button>
                </div>
              </form>
            )}

            {openAction === 'party' && (
              <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={submitParty}>
                <label className="space-y-1.5 text-sm lg:col-span-2">
                  <span className="text-xs font-medium text-foreground">اختر الطرف (جهة / فرد) *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={partyForm.party_id}
                    onChange={(e) => setPartyForm({ ...partyForm, party_id: e.target.value })}
                  >
                    <option value="">اختر من دليل الأطراف...</option>
                    {parties.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.legal_name || p.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">صفة التمثيل *</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    placeholder="مثال: المدعى عليه، المقاول"
                    value={partyForm.role}
                    onChange={(e) => setPartyForm({ ...partyForm, role: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">موقع النزاع *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={partyForm.side}
                    onChange={(e) => setPartyForm({ ...partyForm, side: e.target.value })}
                  >
                    <option value="opposing_side">الطرف الخصم</option>
                    <option value="our_side">طرفنا (الموكل)</option>
                    <option value="neutral">جهة محايدة / خبير</option>
                  </select>
                </label>

                <div className="lg:col-span-4 flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={partyForm.is_primary}
                      onChange={(e) => setPartyForm({ ...partyForm, is_primary: e.target.checked })}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span>تعيين كطرف رئيسي في النزاع</span>
                  </label>

                  <Button type="submit" className="gap-1.5 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>إضافة الطرف</span>
                  </Button>
                </div>
              </form>
            )}

            {openAction === 'case' && (
              <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={submitCase}>
                <label className="space-y-1.5 text-sm lg:col-span-2">
                  <span className="text-xs font-medium text-foreground">مسمى القضية *</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={caseForm.title}
                    onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">صفة التمثيل القضائي</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={caseForm.representation_capacity}
                    onChange={(e) => setCaseForm({ ...caseForm, representation_capacity: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">نوع الدعوى / القضية *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={caseForm.case_type_id}
                    onChange={(e) => setCaseForm({ ...caseForm, case_type_id: e.target.value })}
                  >
                    <option value="">اختر نوع القضية...</option>
                    {caseTypes.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">حالة القضية *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={caseForm.case_status_id}
                    onChange={(e) => setCaseForm({ ...caseForm, case_status_id: e.target.value })}
                  >
                    <option value="">اختر حالة القضية...</option>
                    {caseStatuses.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">المحكمة المختصة</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={caseForm.court_id}
                    onChange={(e) => setCaseForm({ ...caseForm, court_id: e.target.value })}
                  >
                    <option value="">اختر المحكمة...</option>
                    {courts.map((court: any) => (
                      <option key={court.id} value={court.id}>
                        {court.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">رقم القيد بالمحكمة</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="مثال: 1446/ت/1085"
                    value={caseForm.court_case_number}
                    onChange={(e) => setCaseForm({ ...caseForm, court_case_number: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">تاريخ القيد</span>
                  <input
                    type="date"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={caseForm.filed_date}
                    onChange={(e) => setCaseForm({ ...caseForm, filed_date: e.target.value })}
                  />
                </label>

                <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenAction(null)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    <span>حفظ وتسجيل القضية</span>
                  </Button>
                </div>
              </form>
            )}

            {openAction === 'doc' && (
              <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={submitDocument}>
                <label className="space-y-1.5 text-sm lg:col-span-2">
                  <span className="text-xs font-medium text-foreground">عنوان أو وصف المستند *</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    placeholder="مثال: مذكرة جوابية أولى / عقد المقاولة / صك الحكم"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">تصنيف المستند *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                  >
                    {documentCategories.length > 0 ? (
                      documentCategories.map((c: any) => (
                        <option key={c.id || c.code} value={c.code || c.id}>
                          {c.name_ar || c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="pleading">مذكرات ولائحة دعوى</option>
                        <option value="evidence">بينات ومستندات إثبات</option>
                        <option value="judgment">أحكام وقرارات قضائية</option>
                        <option value="contract">عقود واتفاقيات</option>
                        <option value="power_of_attorney">وكالات وتفاويض</option>
                        <option value="other">مستندات أخرى</option>
                      </>
                    )}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm lg:col-span-3">
                  <span className="text-xs font-medium text-foreground">الملف المرفق (PDF, Word, صور) *</span>
                  <input
                    type="file"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    required
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setDocForm({ ...docForm, file: e.target.files?.[0] || null })}
                  />
                </label>

                <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenAction(null)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="gap-1.5">
                    <UploadCloud className="h-4 w-4" />
                    <span>رفع المستند وحفظه</span>
                  </Button>
                </div>
              </form>
            )}

            {openAction === 'edit_matter' && (
              <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={submitEditMatter}>
                <label className="space-y-1.5 text-sm lg:col-span-2">
                  <span className="text-xs font-medium text-foreground">عنوان الملف القانوني *</span>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">نوع الملف *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={editForm.matter_type}
                    onChange={(e) => setEditForm({ ...editForm, matter_type: e.target.value })}
                  >
                    <option value="litigation">تقاضي ونزاع قضائي</option>
                    <option value="advisory">استشارة ورأي قانوني</option>
                    <option value="corporate">شركات وتأسيس</option>
                    <option value="contract">صياغة وتدقيق عقود</option>
                    <option value="arbitration">تحكيم</option>
                    <option value="enforcement">تنفيذ الأحكام</option>
                    <option value="debt_collection">تحصيل الديون</option>
                    <option value="legal_research">بحث قانوني</option>
                    <option value="other">أخرى</option>
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">الحالة التشغيلية *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="open">قيد المتابعة والعمل</option>
                    <option value="in_progress">جارٍ التنفيذ</option>
                    <option value="pending">معلق بانتظار إجراء</option>
                    <option value="on_hold">معلق</option>
                    <option value="awaiting_client">بانتظار العميل</option>
                    <option value="closed">مغلق ومحفوظ</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">مستوى الأولوية *</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="critical">حرجة</option>
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">قيمة المطالبة التقديرية (ر.س)</span>
                  <input
                    type="number"
                    step="0.01"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={editForm.estimated_value}
                    onChange={(e) => setEditForm({ ...editForm, estimated_value: e.target.value })}
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">المحامي المسؤول</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={editForm.responsible_lawyer_id}
                    onChange={(e) => setEditForm({ ...editForm, responsible_lawyer_id: e.target.value })}
                  >
                    <option value="">غير محدد</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.job_title ? ` · (${u.job_title})` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="text-xs font-medium text-foreground">الشريك المشرف</span>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={editForm.responsible_partner_id}
                    onChange={(e) => setEditForm({ ...editForm, responsible_partner_id: e.target.value })}
                  >
                    <option value="">غير محدد</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.job_title ? ` · (${u.job_title})` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm lg:col-span-3">
                  <span className="text-xs font-medium text-foreground">وصف وموجز موضوع النزاع</span>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </label>

                <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenAction(null)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="gap-1.5">
                    <Edit3 className="h-4 w-4" />
                    <span>حفظ التعديلات</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. Four Core Strategic KPI Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Responsible Lawyer */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 border-t-4 border-t-primary shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-medium">المحامي المسؤول</span>
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="text-base font-bold text-foreground truncate">
              {matter.responsible_lawyer?.name || 'غير محدد'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {matter.responsible_lawyer?.job_title || 'إدارة ومتابعة النزاع'}
            </div>
          </div>

          {/* Card 2: Responsible Partner */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 border-t-4 border-t-sky-600 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-medium">الشريك المشرف</span>
              <BriefcaseBusiness className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-base font-bold text-foreground truncate">
              {matter.responsible_partner?.name || 'غير محدد'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              إشراف استراتيجي ومراجعة
            </div>
          </div>

          {/* Card 3: Next Hearing */}
          <div className={`rounded-xl border p-4 space-y-1.5 shadow-2xs hover:shadow-xs transition-shadow border-t-4 ${nextHearing ? 'border-amber-500/40 border-t-amber-500 bg-amber-50/20 dark:bg-amber-950/10' : 'border-border border-t-border bg-card'}`}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">الجلسة القضائية القادمة</span>
              <Landmark className="h-4 w-4 text-amber-600" />
            </div>
            {nextHearing ? (
              <Link href={route('legal-hearings.show', nextHearing.id)} className="block group">
                <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span dir="rtl">{formatDateAr(nextHearing.hearing_date)}</span>
                  <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-[-2px] transition-transform" />
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {nextHearing.court?.name || nextHearing.title}
                </div>
              </Link>
            ) : (
              <div>
                <div className="text-base font-bold text-muted-foreground">—</div>
                <div className="text-xs text-muted-foreground">لا توجد جلسات مجدولة حالياً</div>
              </div>
            )}
          </div>

          {/* Card 4: Next Deadline */}
          <div className={`rounded-xl border p-4 space-y-1.5 shadow-2xs hover:shadow-xs transition-shadow border-t-4 ${nextDeadline ? 'border-rose-500/40 border-t-rose-500 bg-rose-50/20 dark:bg-rose-950/10' : 'border-border border-t-border bg-card'}`}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">الموعد النظامي القادم</span>
              <CalendarClock className="h-4 w-4 text-rose-600" />
            </div>
            {nextDeadline ? (
              <Link href={route('legal-deadlines.index', { matter_id: matter.id })} className="block group">
                <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span dir="rtl">{formatDateAr(nextDeadline.due_date)}</span>
                  <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-[-2px] transition-transform" />
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {nextDeadline.title}
                </div>
              </Link>
            ) : (
              <div>
                <div className="text-base font-bold text-muted-foreground">—</div>
                <div className="text-xs text-muted-foreground">لا توجد مواعيد استحقاق قريبة</div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Health Deduction Notice Banner */}
        {(health?.factors || []).length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-900 dark:text-amber-200">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <span className="font-bold text-xs sm:text-sm">أسباب حسم النقاط من مؤشر سلامة الملف:</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {health.factors.slice(0, 3).map((factor: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                  >
                    <span className="font-bold text-rose-600 num" dir="ltr">{factor.points}</span>
                    <span>{translateHealthFactor(factor.reason)}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Matter Tabs Workspace (Full RTL Radix Tabs) */}
        <Tabs value={tab} onValueChange={setTab} dir="rtl" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto h-11 p-1 bg-muted/60 rounded-xl border border-border">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <FileText className="h-3.5 w-3.5" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <Gavel className="h-3.5 w-3.5" />
              <span>القضايا المرتبطة</span>
              <span className="ms-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                {matter.cases?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="parties" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <Users className="h-3.5 w-3.5" />
              <span>أطراف النزاع</span>
              <span className="ms-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                {matter.parties?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <UserCheck className="h-3.5 w-3.5" />
              <span>فريق العمل</span>
              <span className="ms-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                {matter.team_members?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <Clock className="h-3.5 w-3.5" />
              <span>السجل الزمني</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <FolderPlus className="h-3.5 w-3.5" />
              <span>المستندات التشغيلية</span>
              <span className="ms-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                {matter.documents?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <FileSignature className="h-3.5 w-3.5" />
              <span>العقود والاتفاقيات</span>
              <span className="ms-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                {matter.contracts?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="rounded-lg text-xs font-semibold gap-1.5 py-2 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>تقييم المخاطر والتدقيق</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-4 mt-0">
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              {/* Matter Brief Panel */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Scale className="h-4.5 w-4.5 text-primary" />
                    <span>موجز الملف وموضوع النزاع</span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {getMatterTypeLabel(matter.matter_type)}
                  </Badge>
                </div>

                <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-normal">
                  {matter.description
                    ? matter.description.replace('الإنشائيوالتعويض', 'الإنشائي والتعويض')
                    : 'لا يوجد وصف تفصيلي مسجل لهذا الملف.'}
                </p>

                <div className="grid gap-3 pt-3 border-t border-border sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 bg-muted/20 p-3 space-y-1">
                    <div className="text-xs text-muted-foreground">تاريخ فتح الملف</div>
                    <div className="text-sm font-semibold text-foreground" dir="rtl">{formatDateAr(matter.open_date)}</div>
                  </div>

                  <div className="rounded-lg border border-border/70 bg-muted/20 p-3 space-y-1">
                    <div className="text-xs text-muted-foreground">قيمة المطالبة التقديرية</div>
                    <div className="text-sm font-bold text-primary num" dir="ltr">
                      {formatCurrencyAr(matter.estimated_value, matter.currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Signals Panel */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <CalendarClock className="h-4.5 w-4.5 text-amber-600" />
                    <span>الإشارات التشغيلية والمواعيد</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {nextHearing ? (
                    <Link
                      href={route('legal-hearings.show', nextHearing.id)}
                      className="block rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 hover:bg-amber-500/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Landmark className="h-3.5 w-3.5 text-amber-600" />
                          <span>جلسة استماع قادمة</span>
                        </span>
                        <span dir="rtl">{formatDateAr(nextHearing.hearing_date)}</span>
                      </div>
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {nextHearing.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                        <span>{nextHearing.court?.name || '—'}</span>
                        <span className="text-primary font-medium flex items-center gap-1">
                          <span>عرض الجلسة</span>
                          <ChevronLeft className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      لا توجد جلسات قادمة مسجلة لهذا الملف.
                    </div>
                  )}

                  {nextDeadline ? (
                    <Link
                      href={route('legal-deadlines.index', { matter_id: matter.id })}
                      className="block rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5 hover:bg-rose-500/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                          <span>موعد نهائي للإيداع</span>
                        </span>
                        <span dir="rtl">{formatDateAr(nextDeadline.due_date)}</span>
                      </div>
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {nextDeadline.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {getPriorityBadge(nextDeadline.priority).label}
                        </span>
                        <span className="text-primary font-medium flex items-center gap-1">
                          <span>سجل المواعيد</span>
                          <ChevronLeft className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      لا توجد مواعيد استحقاق عاجلة مسجلة.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Cases */}
          <TabsContent value="cases" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">القضايا والدعاوى القضائية المرتبطة</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">القضايا المسجلة في المحاكم تحت هذا الملف القانوني</p>
                </div>
                {can.caseCreate && matter.matter_type === 'litigation' && (
                  <Button size="sm" onClick={() => setOpenAction('case')} className="gap-1.5 cursor-pointer text-xs">
                    <Plus className="h-3.5 w-3.5" />
                    <span>تسجيل دعوى جديدة</span>
                  </Button>
                )}
              </div>

              {(matter.cases || []).length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {matter.cases.map((item: any) => (
                    <Link
                      key={item.id}
                      href={route('matters.cases.show', item.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                          <Gavel className="h-4 w-4 text-primary shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {item.court_case_number && (
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-foreground" dir="ltr">
                              رقم القيد: {item.court_case_number}
                            </span>
                          )}
                          <span>المحكمة: {item.court?.name || 'غير محدد'}</span>
                          {item.circuit?.name && <span>الدائرة: {item.circuit.name}</span>}
                          {item.case_type?.name && <span>النوع: {item.case_type.name}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {getStageLabel(item.current_stage || item.status)}
                        </Badge>
                        <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-[-3px] transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <Gavel className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لا توجد قضايا قضائية مسجلة مرتبطة بهذا الملف</p>
                  <p className="text-xs text-muted-foreground">يمكنك إضافة قيد دعوى جديدة بالمحكمة بالنقر على زر "تسجيل دعوى جديدة".</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 3: Parties */}
          <TabsContent value="parties" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">أطراف النزاع والتمثيل</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">سجل أطراف الدعوى والخصوم والجهات المحايدة</p>
                </div>
                {can.partyEdit && (
                  <Button size="sm" variant="outline" onClick={() => setOpenAction('party')} className="gap-1.5 cursor-pointer text-xs">
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة طرف</span>
                  </Button>
                )}
              </div>

              {(matter.parties || []).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {matter.parties.map((row: any) => {
                    const sideInfo = getSideBadge(row.side);
                    return (
                      <div key={row.id} className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-foreground text-sm">
                            {row.party?.legal_name || row.party?.name || 'طرف مجهول'}
                          </div>
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${sideInfo.className}`}>
                            {sideInfo.label}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                          <span>الصفة: <strong className="text-foreground font-medium">{row.role || '—'}</strong></span>
                          {row.is_primary && (
                            <span className="text-primary font-bold text-[11px]">طرف رئيسي</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لم يتم إضافة أطراف لهذا الملف حتى الآن</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 4: الفريق */}
          <TabsContent value="team" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">فريق العمل والمحامون المسند إليهم</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">أعضاء الفريق المسؤولون عن دراسة ومتابعة الملف</p>
                </div>
                {can.assign && (
                  <Button size="sm" variant="outline" onClick={() => setOpenAction('team')} className="gap-1.5 cursor-pointer text-xs">
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>إضافة محامٍ للفريق</span>
                  </Button>
                )}
              </div>

              {(matter.team_members || []).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {matter.team_members.map((row: any) => (
                    <div key={row.id} className="rounded-xl border border-border p-4 bg-muted/10 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="font-bold text-sm text-foreground truncate">
                          {row.user?.name || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {row.user?.job_title || 'محامٍ'}
                        </div>
                        <Badge variant="outline" className="text-[10px] py-0 mt-1 border-primary/20 text-primary">
                          {getMatterRoleLabel(row.matter_role)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <UserCheck className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لم يتم تعيين فريق عمل لهذا الملف بعد</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 5: Timeline */}
          <TabsContent value="timeline" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground">السجل الزمني للإجراءات والوقائع</h3>
                <p className="text-xs text-muted-foreground mt-0.5">تتبع زمني لكافة المحطات والأحداث المسجلة على هذا الملف</p>
              </div>

              {(timeline?.data || []).length > 0 ? (
                <div className="relative space-y-6 border-s-2 border-primary/20 ps-6 ms-2 py-2">
                  {timeline.data.map((event: any) => (
                    <div key={event.id} className="relative group">
                      <span className="absolute -start-[1.95rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary shadow-xs" />
                      <div className="rounded-xl border border-border p-4 bg-muted/15 hover:bg-muted/30 transition-colors space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-bold text-foreground">{event.title}</div>
                          <time className="text-xs font-semibold text-primary" dir="rtl">
                            {formatDateAr(event.event_date)}
                          </time>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {event.description || event.event_type}
                        </p>
                        {event.creator?.name && (
                          <div className="text-[11px] text-muted-foreground/80 pt-1">
                            بواسطة: <span className="font-medium text-foreground">{event.creator.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لا توجد أحداث زمنية مسجلة بعد</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Documents */}
          <TabsContent value="documents" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">المستندات التشغيلية والوثائق</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">كافة اللوائح والمذكرات والأحكام المرفوعة في هذا الملف</p>
                </div>
                {can.uploadDocument && (
                  <Button size="sm" onClick={() => setOpenAction('doc')} className="gap-1.5 cursor-pointer text-xs">
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>رفع مستند جديد</span>
                  </Button>
                )}
              </div>

              {(matter.documents || []).length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {matter.documents.map((doc: any) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-foreground">{doc.title}</div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[11px] font-normal">
                              {doc.category === 'pleading' ? 'مذكرة / لائحة' :
                               doc.category === 'evidence' ? 'بينة إثبات' :
                               doc.category === 'judgment' ? 'حكم قضائي' :
                               doc.category === 'contract' ? 'عقد' :
                               doc.category === 'power_of_attorney' ? 'وكالة شرعية' : 'أخرى'}
                            </Badge>
                            {doc.file_size && (
                              <span>{(doc.file_size / 1024).toFixed(1)} ك.ب</span>
                            )}
                            {doc.created_at && (
                              <span dir="rtl">{formatDateAr(doc.created_at)}</span>
                            )}
                            {doc.uploader?.name && (
                              <span>بواسطة: {doc.uploader.name}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={route('matters.documents.download', [matter.id, doc.id])}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>تحميل</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <FolderPlus className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لا توجد مستندات تشغيلية مرفوعة لهذا الملف بعد</p>
                  <p className="text-xs text-muted-foreground">يمكنك أرشفة المذكرات والبينات بصيغة PDF بالضغط على "رفع مستند جديد".</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Legal Contracts */}
          <TabsContent value="contracts" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">العقود والاتفاقيات القانونية المرتبطة</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">عقود الأتعاب والاتفاقيات المحررة تحت مظلة هذا الملف</p>
                </div>
                <Link
                  href={route('contracts.index', { matter_id: matter.id })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-accent text-foreground border border-border transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>إدارة العقود والاتفاقيات</span>
                </Link>
              </div>

              {(matter.contracts || []).length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {matter.contracts.map((c: any) => (
                    <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                          <FileSignature className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-foreground flex items-center gap-2">
                            <span>{c.title}</span>
                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground" dir="ltr">{c.contract_number}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>النوع: {c.contract_type || 'عقد خدمات قانونية'}</span>
                            <span className="text-primary font-bold num" dir="ltr">{formatCurrencyAr(c.contract_value)}</span>
                            {c.start_date && <span>من: {formatDateAr(c.start_date)}</span>}
                            {c.end_date && <span>إلى: {formatDateAr(c.end_date)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={
                          c.status === 'active' || c.status === 'signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                          c.status === 'sent' ? 'bg-sky-50 text-sky-700 border-sky-300' :
                          c.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                          'bg-muted text-muted-foreground'
                        }>
                          {c.status === 'active' ? 'سارٍ' :
                           c.status === 'signed' ? 'موقع' :
                           c.status === 'sent' ? 'مرسل للتوقيع' :
                           c.status === 'draft' ? 'مسودة' :
                           c.status === 'terminated' ? 'منتهٍ' : c.status}
                        </Badge>
                        <a
                          href={route('contracts.download', c.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>المستند</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <FileSignature className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-foreground">لا توجد عقود مسجلة لهذا الملف حتى الآن</p>
                  <p className="text-xs text-muted-foreground">يمكنك إنشاء وتوقيع عقود الأتعاب والاتفاقيات عبر قسم إدارة العقود.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 6: Risk & Audit */}
          <TabsContent value="risk" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">تقرير سلامة الملف ومؤشرات المخاطر</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">تحليل العوامل المؤثرة على نقاط جودة إدارة الملف القانوني</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${healthInfo.badgeClass}`}>
                  المؤشر الإجمالي: {health?.score ?? 0}%
                </div>
              </div>

              {(health?.factors || []).length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {health.factors.map((factor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3.5 bg-muted/10 hover:bg-muted/20 text-sm">
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>{translateHealthFactor(factor.reason)}</span>
                      </span>
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded text-xs" dir="ltr">
                        {factor.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-50/20 p-6 text-center space-y-1">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">الملف في أفضل حالاته</p>
                  <p className="text-xs text-muted-foreground">لم يتم رصد أي عوامل خطورة أو تأخير في مواعيد هذا الملف.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* 6. Bottom Sticky Quick Actions Bar */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            ملف رقم <span className="font-mono font-bold text-foreground" dir="ltr">{matter.matter_number}</span> · تم الفتح في <span dir="rtl">{formatDateAr(matter.open_date)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {can.strategy && matter.cases?.[0] && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.get(route('matters.cases.strategy', matter.cases[0].id))}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Scale className="h-3.5 w-3.5 text-primary" />
                <span>استراتيجية القضية</span>
              </Button>
            )}

            {matter.status !== 'closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('هل أنت متأكد من رغبتك في نقل هذا الملف إلى الأرشيف والإغلاق؟')) {
                    router.patch(route('matters.update', matter.id), { status: 'closed' });
                  }
                }}
                className="gap-1.5 text-muted-foreground hover:text-rose-600 hover:border-rose-300 cursor-pointer text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>نقل الملف إلى مرحلة الإغلاق</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
