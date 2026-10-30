import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function CaseStrategy() {
  const { t } = useTranslation();
  const { case: caseItem } = usePage().props as any;
  return <PageTemplate title={t('Case strategy')} description={`${caseItem.internal_case_number || caseItem.case_id} · ${t('Restricted workspace')}`} url={`/matters/cases/${caseItem.id}/strategy`} actions={[{ label: t('Back'), icon: <ArrowLeft className="h-4 w-4" />, variant: 'outline', onClick: () => router.get(route('matters.cases.show', caseItem.id)) }]}>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><LockKeyhole className="h-4 w-4" />{t('Restricted strategy workspace')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('This area is intentionally restricted by CASE_VIEW_STRATEGY. Strategy notes are not placed into ordinary audit metadata.')}</CardContent></Card>
  </PageTemplate>;
}
