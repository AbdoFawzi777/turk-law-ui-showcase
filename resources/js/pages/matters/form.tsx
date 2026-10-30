import { FormEvent } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';

const priorityLabels: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  critical: 'حرجة',
};

const statusLabels: Record<string, string> = {
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

export default function MatterForm() {
  const { t } = useTranslation();
  const { matter, clients = [], users = [], matterTypes = [], priorities = [], matterStatuses = [] } = usePage().props as any;
  const isEdit = Boolean(matter?.id);

  const { data, setData, post, put, processing, errors } = useForm<any>({
    client_id: matter?.client_id || '',
    title: matter?.title || '',
    matter_type: matter?.matter_type || 'litigation',
    status: matter?.status || 'open',
    priority: matter?.priority || 'medium',
    responsible_lawyer_id: matter?.responsible_lawyer_id || '',
    responsible_partner_id: matter?.responsible_partner_id || '',
    description: matter?.description || '',
    estimated_value: matter?.estimated_value || '',
    currency: matter?.currency || 'SAR',
    notes: matter?.notes || '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (isEdit) {
      put(route('matters.update', matter.id), {
        onSuccess: () => {
          toast.success(t('Matter updated successfully.'));
        },
      });
    } else {
      post(route('matters.store'), {
        onSuccess: () => {
          toast.success(t('Matter opened successfully.'));
        },
      });
    }
  };

  const pageTitle = isEdit ? `${t('Edit Matter')} (${matter.matter_number})` : t('Open Matter');
  const pageDescription = isEdit
    ? t('Update matter details, assignments, status, and financial estimates.')
    : t('Create a matter with a stable reference and clear ownership.');

  return (
    <PageTemplate
      title={pageTitle}
      description={pageDescription}
      url={isEdit ? `/matters/${matter.id}/edit` : '/matters/create'}
      breadcrumbs={[
        { title: t('Legal Matters'), href: route('matters.index') },
        ...(isEdit ? [{ title: matter.matter_number, href: route('matters.show', matter.id) }] : []),
        { title: isEdit ? t('Edit') : t('Open Matter') },
      ]}
      actions={[
        {
          label: t('Back'),
          icon: <ArrowLeft className="h-4 w-4" />,
          variant: 'outline',
          onClick: () => (isEdit ? router.get(route('matters.show', matter.id)) : router.get(route('matters.index'))),
        },
      ]}
    >
      <form onSubmit={submit} className="space-y-4" dir="auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {isEdit ? t('Edit Matter Details') : t('Matter details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* Client */}
            <div className="space-y-1">
              <Label htmlFor="matter-client">{t('Client')} <span className="text-destructive">*</span></Label>
              <select
                id="matter-client"
                disabled={isEdit}
                className={`h-9 w-full rounded-md border bg-background px-3 text-sm ${isEdit ? 'opacity-70 cursor-not-allowed bg-muted' : ''}`}
                value={data.client_id}
                onChange={(event) => setData('client_id', event.target.value)}
              >
                <option value="">{t('Select client')}</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name} · {client.reference_number || client.id}
                  </option>
                ))}
              </select>
              {isEdit && <p className="text-xs text-muted-foreground">{t('Client is bound to the matter and cannot be modified.')}</p>}
              {errors.client_id && <p className="text-xs text-destructive">{errors.client_id}</p>}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="matter-title">{t('Title')} <span className="text-destructive">*</span></Label>
              <Input
                id="matter-title"
                value={data.title}
                onChange={(event) => setData('title', event.target.value)}
                placeholder={t('Enter matter title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Matter Type */}
            <div className="space-y-1">
              <Label htmlFor="matter-type">{t('Matter type')}</Label>
              <select
                id="matter-type"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={data.matter_type}
                onChange={(event) => setData('matter_type', event.target.value)}
              >
                {matterTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {t(type.replaceAll('_', ' '))}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <Label htmlFor="matter-priority">{t('Priority')}</Label>
              <select
                id="matter-priority"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={data.priority}
                onChange={(event) => setData('priority', event.target.value)}
              >
                {priorities.map((priority: string) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority] || t(priority)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (Visible especially in Edit) */}
            {isEdit && (
              <div className="space-y-1">
                <Label htmlFor="matter-status">{t('Status')}</Label>
                <select
                  id="matter-status"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={data.status}
                  onChange={(event) => setData('status', event.target.value)}
                >
                  {(matterStatuses.length ? matterStatuses : ['open', 'active', 'in_progress', 'pending', 'on_hold', 'closing', 'closed', 'archived']).map((st: string) => (
                    <option key={st} value={st}>
                      {statusLabels[st] || t(st.replaceAll('_', ' '))}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Responsible Lawyer */}
            <div className="space-y-1">
              <Label htmlFor="matter-lawyer">{t('Responsible lawyer')}</Label>
              <select
                id="matter-lawyer"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={data.responsible_lawyer_id}
                onChange={(event) => setData('responsible_lawyer_id', event.target.value)}
              >
                <option value="">{t('Unassigned')}</option>
                {users.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.job_title ? `(${user.job_title})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">{t('Responsible lawyer handles day-to-day matter work, activities, and follow-ups.')}</p>
            </div>

            {/* Responsible Partner */}
            <div className="space-y-1">
              <Label htmlFor="matter-partner">{t('Responsible partner')}</Label>
              <select
                id="matter-partner"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={data.responsible_partner_id}
                onChange={(event) => setData('responsible_partner_id', event.target.value)}
              >
                <option value="">{t('Unassigned')}</option>
                {users.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.job_title ? `(${user.job_title})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">{t('Responsible partner provides supervision and strategic oversight; assigning one does not assign the other.')}</p>
            </div>

            {/* Estimated Value */}
            <div className="space-y-1">
              <Label htmlFor="matter-value">{t('Estimated value')}</Label>
              <Input
                id="matter-value"
                type="number"
                min="0"
                step="0.01"
                value={data.estimated_value}
                onChange={(event) => setData('estimated_value', event.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <Label htmlFor="matter-currency">{t('Currency')}</Label>
              <Input
                id="matter-currency"
                maxLength={3}
                dir="ltr"
                value={data.currency}
                onChange={(event) => setData('currency', event.target.value.toUpperCase())}
                placeholder="SAR"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="matter-description">{t('Description')}</Label>
              <Textarea
                id="matter-description"
                rows={4}
                value={data.description}
                onChange={(event) => setData('description', event.target.value)}
                placeholder={t('Enter detailed matter description')}
              />
            </div>

            {/* Notes */}
            {isEdit && (
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="matter-notes">{t('Internal Notes')}</Label>
                <Textarea
                  id="matter-notes"
                  rows={3}
                  value={data.notes}
                  onChange={(event) => setData('notes', event.target.value)}
                  placeholder={t('Internal confidential notes')}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => (isEdit ? router.get(route('matters.show', matter.id)) : router.get(route('matters.index')))}
          >
            {t('Cancel')}
          </Button>
          <Button type="submit" disabled={processing} className="gap-2">
            <Save className="h-4 w-4" />
            {processing ? t('Saving...') : isEdit ? t('Update Matter') : t('Open Matter')}
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
}
