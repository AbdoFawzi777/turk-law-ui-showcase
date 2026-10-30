import { Link, router } from '@inertiajs/react';
import { Bell, BellRing, CheckCheck } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categories: Record<string, string> = { system: 'النظام', deadline: 'المواعيد', hearing: 'الجلسات', task: 'المهام', billing: 'الفوترة', compliance: 'الامتثال', portal: 'بوابة العميل' };
const priorities: Record<string, string> = { low: 'منخفضة', normal: 'عادية', high: 'عالية', critical: 'حرجة' };
export default function NotificationCenter({ notifications, filters = {}, unreadCount = 0 }: any) {
    const filter = (category = '', unread = false) => router.get(route('notification-center.index'), { category: category || undefined, unread: unread ? 1 : undefined }, { preserveState: true });
    return <PageTemplate title="مركز التنبيهات" description="متابعة موحدة لتنبيهات الملفات والجلسات والمواعيد والفوترة والامتثال." url={route('notification-center.index')} actions={unreadCount ? [{ label: 'تعليم الكل كمقروء', icon: <CheckCheck className="h-4 w-4" />, onClick: () => router.patch(route('notification-center.read-all')), variant: 'outline' }] : []}>
        <div dir="rtl" className="space-y-5"><div className="flex flex-wrap gap-2"><Button variant={!filters.category && !filters.unread ? 'default' : 'outline'} onClick={() => filter()}>الكل</Button><Button variant={filters.unread ? 'default' : 'outline'} onClick={() => filter('', true)}>غير المقروءة ({unreadCount})</Button>{Object.entries(categories).map(([value, label]) => <Button key={value} variant={filters.category === value ? 'default' : 'outline'} onClick={() => filter(value)}>{label}</Button>)}</div>
        <div className="space-y-3">{notifications?.data?.map((item: any) => <Card key={item.id} className={!item.read_at ? 'border-emerald-300 bg-emerald-50/30' : ''}><CardContent className="flex items-start gap-4 p-5"><span className={`rounded-full p-2 ${item.is_critical ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'}`}>{item.read_at ? <Bell className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{item.title}</h2><Badge variant="secondary">{categories[item.category] || 'النظام'}</Badge><Badge variant={item.is_critical || item.priority === 'critical' ? 'destructive' : 'outline'}>{priorities[item.priority] || 'عادية'}</Badge></div><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p><time className="mt-2 block text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('ar-EG')}</time></div>{item.action_url && <Button asChild size="sm" variant="outline"><Link href={item.action_url}>فتح</Link></Button>}</CardContent></Card>)}{!notifications?.data?.length && <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground"><Bell className="mx-auto mb-3 h-9 w-9" />لا توجد تنبيهات مطابقة.</div>}</div></div>
    </PageTemplate>;
}
