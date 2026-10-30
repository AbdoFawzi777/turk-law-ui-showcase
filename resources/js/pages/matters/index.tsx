import { FormEvent, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Briefcase,
  Edit,
  Eye,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { formatStatusText } from '@/utils/helpers';

const formatDate = (value: any) =>
  value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';

const healthClass = (level: string) =>
  level === 'critical'
    ? 'text-red-700 bg-red-50 border-red-200'
    : level === 'attention'
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-emerald-700 bg-emerald-50 border-emerald-200';

const matterTypeLabelsAr: Record<string, string> = {
  litigation: 'تقاضٍ ونزاع قضائي',
  legal_consultation: 'استشارة قانونية',
  advisory: 'رأي قانوني',
  contract: 'عقود واتفاقيات',
  arbitration: 'تحكيم',
  enforcement: 'تنفيذ قضائي',
  debt_collection: 'تحصيل ديون',
  corporate: 'شركات وتأسيس',
  legal_research: 'بحث قانوني',
  other: 'أخرى',
};

const statusLabelsAr: Record<string, string> = {
  open: 'مفتوح',
  active: 'نشط',
  in_progress: 'قيد التنفيذ',
  pending: 'معلق',
  on_hold: 'متوقف مؤقتاً',
  awaiting_client: 'بانتظار العميل',
  awaiting_external_party: 'بانتظار طرف خارجي',
  closing: 'قيد الإغلاق',
  closed: 'مغلق',
  archived: 'مؤرشف',
};

const priorityLabelsAr: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  critical: 'حرجة',
};

export default function MattersIndex() {
  const { t } = useTranslation();
  const {
    matters,
    matterTypes = [],
    matterStatuses = [],
    priorities = [],
    users = [],
    filters = {},
    can = {}
  } = usePage().props as any;

  const [search, setSearch] = useState(filters.search || '');

  // Quick Edit Modal State
  const [editingMatter, setEditingMatter] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({
    title: '',
    matter_type: 'litigation',
    status: 'open',
    priority: 'medium',
    responsible_lawyer_id: '',
    responsible_partner_id: '',
    estimated_value: '',
    currency: 'SAR',
    description: '',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingMatter, setDeletingMatter] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    router.get(
      route('matters.index'),
      { search: search || undefined },
      { preserveState: true, preserveScroll: true }
    );
  };

  const openEditModal = (matter: any) => {
    setEditingMatter(matter);
    setEditForm({
      title: matter.title || '',
      matter_type: matter.matter_type || 'litigation',
      status: matter.status || 'open',
      priority: matter.priority || 'medium',
      responsible_lawyer_id: matter.responsible_lawyer_id || '',
      responsible_partner_id: matter.responsible_partner_id || '',
      estimated_value: matter.estimated_value || '',
      currency: matter.currency || 'SAR',
      description: matter.description || '',
      notes: matter.notes || '',
    });
  };

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingMatter) return;
    setIsUpdating(true);

    router.put(route('matters.update', editingMatter.id), editForm, {
      preserveScroll: true,
      onSuccess: () => {
        setIsUpdating(false);
        setEditingMatter(null);
        toast.success(t('Matter updated successfully.'));
      },
      onError: (errors) => {
        setIsUpdating(false);
        const msg = Object.values(errors).flat().join(', ') || t('Failed to update matter.');
        toast.error(msg);
      },
    });
  };

  const confirmDelete = (matter: any) => {
    setDeletingMatter(matter);
  };

  const handleDeleteSubmit = () => {
    if (!deletingMatter) return;
    setIsDeleting(true);

    router.delete(route('matters.destroy', deletingMatter.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleting(false);
        setDeletingMatter(null);
        toast.success(t('Matter deleted successfully.'));
      },
      onError: (errors) => {
        setIsDeleting(false);
        const msg = Object.values(errors).flat().join(', ') || t('Failed to delete matter.');
        toast.error(msg);
      },
    });
  };

  const handleArchive = (matterId: number) => {
    if (confirm(t('Are you sure you want to archive this matter?'))) {
      router.post(
        route('matters.archive', matterId),
        {},
        {
          preserveScroll: true,
          onSuccess: () => toast.success(t('Matter archived successfully.')),
        }
      );
    }
  };

  const handleRestore = (matterId: number) => {
    if (confirm(t('Are you sure you want to restore this matter from archive?'))) {
      router.post(
        route('matters.restore', matterId),
        {},
        {
          preserveScroll: true,
          onSuccess: () => toast.success(t('Matter restored successfully.')),
        }
      );
    }
  };

  return (
    <PageTemplate
      title={t('Legal Matters')}
      description={t('All legal files, assignments, health, and next actions in one operational view.')}
      url="/matters"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Legal Matters') },
      ]}
      actions={[
        {
          label: t('Open Matter'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => router.get(route('matters.create')),
        },
      ]}
    >
      <div className="space-y-4" dir="auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label={t('Search legal matters')}
              className="ps-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('Search matter, case, client, party, or court')}
            />
          </div>
          <Button variant="outline" type="submit">
            {t('Search')}
          </Button>
        </form>

        {/* Matters Register Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                {t('Matter register')}
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {matters?.total || 0} {t('records')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="border-b bg-muted/30">
                  <tr>
                    {[
                      t('Matter No.'),
                      t('Title'),
                      t('Client'),
                      t('Type'),
                      t('Responsible'),
                      t('Status'),
                      t('Priority'),
                      'مؤشر السلامة',
                      t('Next action'),
                      t('Last activity'),
                      'الإجراءات',
                    ].map((heading, idx) => (
                      <th
                        key={heading}
                        className={`p-3 text-start font-medium text-muted-foreground whitespace-nowrap ${
                          idx === 10 ? 'sticky end-0 bg-slate-100 dark:bg-slate-800 shadow-sm z-20 border-s' : ''
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(matters?.data || []).map((matter: any) => (
                    <tr key={matter.id} className="border-b align-top last:border-0 hover:bg-muted/20 transition-colors">
                      {/* Matter No */}
                      <td className="p-3">
                        <Link
                          href={route('matters.show', matter.id)}
                          className="font-mono text-xs font-semibold text-primary hover:underline"
                          dir="ltr"
                        >
                          {matter.matter_number}
                        </Link>
                      </td>

                      {/* Title */}
                      <td className="p-3">
                        <Link href={route('matters.show', matter.id)} className="font-medium hover:text-primary">
                          {matter.title}
                        </Link>
                        {matter.cases?.length ? (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {matter.cases.length} {t('case(s)')}
                          </div>
                        ) : null}
                      </td>

                      {/* Client */}
                      <td className="p-3 font-medium text-muted-foreground">
                        {matter.client?.name || '—'}
                      </td>

                      {/* Type */}
                      <td className="p-3 text-xs">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {matterTypeLabelsAr[matter.matter_type] || t(String(matter.matter_type || '').replaceAll('_', ' '))}
                        </span>
                      </td>

                      {/* Responsible */}
                      <td className="p-3 text-xs">
                        {matter.responsible_lawyer?.name || (
                          <span className="text-muted-foreground">{t('Unassigned')}</span>
                        )}
                        {matter.responsible_partner?.name && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {matter.responsible_partner.name}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <Badge
                          variant={
                            matter.status === 'archived'
                              ? 'secondary'
                              : matter.status === 'closed'
                              ? 'outline'
                              : 'default'
                          }
                          className="text-[11px]"
                        >
                          {statusLabelsAr[matter.status] || formatStatusText(matter.status)}
                        </Badge>
                      </td>

                      {/* Priority */}
                      <td className="p-3 text-xs">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                            matter.priority === 'critical' || matter.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {priorityLabelsAr[matter.priority] || t(String(matter.priority || '—'))}
                        </span>
                      </td>

                      {/* Health */}
                      <td className="p-3">
                        {matter.health ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-mono font-semibold ${healthClass(
                              matter.health.level
                            )}`}
                          >
                            {matter.health.level === 'critical' || matter.health.level === 'attention' ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : null}
                            {matter.health.score}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Next Action */}
                      <td className="p-3 text-xs">
                        {matter.next_deadline ? (
                          <span>
                            {t('Deadline')}: {formatDate(matter.next_deadline.due_date)}
                          </span>
                        ) : matter.next_hearing ? (
                          <span>
                            {t('Hearing')}: {formatDate(matter.next_hearing.hearing_date)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{t('No next action')}</span>
                        )}
                      </td>

                      {/* Last Activity */}
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(matter.last_activity_at)}
                      </td>

                      {/* Actions Column */}
                      <td className="p-3 text-xs whitespace-nowrap sticky end-0 bg-white dark:bg-slate-900 shadow-sm z-10 border-s">
                        <div className="flex items-center gap-1.5">
                          {/* View Button */}
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs font-medium gap-1 text-primary hover:bg-primary/10"
                            title={t('View matter details')}
                          >
                            <Link href={route('matters.show', matter.id)}>
                              <Eye className="h-3.5 w-3.5" />
                              عرض
                            </Link>
                          </Button>

                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs font-medium gap-1 text-amber-700 border-amber-200 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-950/40"
                            onClick={() => openEditModal(matter)}
                            title={t('Edit matter')}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            تعديل
                          </Button>

                          {/* Archive / Restore Button */}
                          {matter.status !== 'archived' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-amber-800 hover:bg-amber-50"
                              onClick={() => handleArchive(matter.id)}
                              title={t('Archive matter')}
                            >
                              <Archive className="h-3.5 w-3.5" />
                              أرشفة
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleRestore(matter.id)}
                              title={t('Restore matter')}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              استعادة
                            </Button>
                          )}

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 text-destructive border-red-200 hover:bg-destructive/10"
                            onClick={() => confirmDelete(matter)}
                            title={t('Delete matter')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!(matters?.data || []).length && (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  {t('No legal matters found.')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Dialog */}
      <Dialog open={Boolean(editingMatter)} onOpenChange={(open) => !open && setEditingMatter(null)}>
        <DialogContent className="sm:max-w-[650px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit className="h-5 w-5 text-primary" />
              تعديل بيانات الملف القانوني: {editingMatter?.matter_number}
            </DialogTitle>
            <DialogDescription>
              تحديث المعلومات الأساسية، التصنيف، الحالة، والمسؤوليات للملف القانوني.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Title */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="edit-title">عنوان الملف <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              {/* Matter Type */}
              <div className="space-y-1">
                <Label htmlFor="edit-type">نوع الملف القانوني</Label>
                <select
                  id="edit-type"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={editForm.matter_type}
                  onChange={(e) => setEditForm({ ...editForm, matter_type: e.target.value })}
                >
                  {(matterTypes.length ? matterTypes : Object.keys(matterTypeLabelsAr)).map((type: string) => (
                    <option key={type} value={type}>
                      {matterTypeLabelsAr[type] || t(type.replaceAll('_', ' '))}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label htmlFor="edit-status">الحالة التشغيلية</Label>
                <select
                  id="edit-status"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  {(matterStatuses.length ? matterStatuses : Object.keys(statusLabelsAr)).map((st: string) => (
                    <option key={st} value={st}>
                      {statusLabelsAr[st] || formatStatusText(st)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <Label htmlFor="edit-priority">درجة الأولوية</Label>
                <select
                  id="edit-priority"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                >
                  {(priorities.length ? priorities : ['low', 'medium', 'high', 'critical']).map((pr: string) => (
                    <option key={pr} value={pr}>
                      {priorityLabelsAr[pr] || pr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Value */}
              <div className="space-y-1">
                <Label htmlFor="edit-value">القيمة التقديرية (ر.س)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.estimated_value}
                  onChange={(e) => setEditForm({ ...editForm, estimated_value: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              {/* Responsible Lawyer */}
              <div className="space-y-1">
                <Label htmlFor="edit-lawyer">المحامي المسؤول</Label>
                <select
                  id="edit-lawyer"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={editForm.responsible_lawyer_id}
                  onChange={(e) => setEditForm({ ...editForm, responsible_lawyer_id: e.target.value })}
                >
                  <option value="">غير مسند</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.job_title ? `(${u.job_title})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Responsible Partner */}
              <div className="space-y-1">
                <Label htmlFor="edit-partner">الشريك المشرف</Label>
                <select
                  id="edit-partner"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={editForm.responsible_partner_id}
                  onChange={(e) => setEditForm({ ...editForm, responsible_partner_id: e.target.value })}
                >
                  <option value="">غير مسند</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.job_title ? `(${u.job_title})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="edit-desc">الوصف والموجز</Label>
                <Textarea
                  id="edit-desc"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="موجز تفاصيل الملف وموضوعه..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingMatter(null)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isUpdating} className="gap-1.5">
                <Save className="h-4 w-4" />
                {isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingMatter)} onOpenChange={(open) => !open && setDeletingMatter(null)}>
        <DialogContent className="sm:max-w-[450px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive text-base">
              <Trash2 className="h-5 w-5" />
              تأكيد حذف الملف القانوني
            </DialogTitle>
            <DialogDescription className="text-start pt-2">
              هل ترغب في أرشفة الملف القانوني وإلغاء تنشيطه{' '}
              <strong className="text-foreground font-mono">({deletingMatter?.matter_number})</strong>: «
              {deletingMatter?.title}»؟
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                سيتم نقل الملف بأمان إلى سجل الأرشيف مع الحفاظ الكامل على كافة المستندات والعقود والجلسات والسجلات المالية وسجل التدقيق التاريخي.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setDeletingMatter(null)}>
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSubmit}
              className="gap-1.5"
            >
              <Archive className="h-4 w-4" />
              {isDeleting ? 'جاري الأرشفة...' : 'أرشفة ونقل للأرشيف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}
