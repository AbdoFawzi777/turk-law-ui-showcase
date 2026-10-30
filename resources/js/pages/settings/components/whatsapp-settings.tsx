import { t as localizeSystemText } from '@/utils/i18n';
import { FormEvent, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Check, Key, MessageCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from '@/components/settings-section';
import { toast } from '@/components/custom-toast';

const MASKED_TOKEN = '••••••••••••';

export default function WhatsAppSettings() {
    const [settings, setSettings] = useState({
        whatsapp_enabled: false,
        whatsapp_graph_version: 'v23.0',
        whatsapp_phone_number_id: '',
        whatsapp_access_token: '',
        whatsapp_template_name: 'client_portal_credentials',
        whatsapp_template_language: 'ar',
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        axios.get(route('settings.whatsapp-config.get'))
            .then((response) => setSettings((current) => ({ ...current, ...response.data })))
            .catch(() => toast.error('تعذر تحميل إعدادات WhatsApp.'));
    }, []);

    const update = (key: string, value: string | boolean) => setSettings((current) => ({ ...current, [key]: value }));

    const save = (event: FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        router.post(route('settings.whatsapp-config.update'), settings, {
            preserveScroll: true,
            onSuccess: (page: any) => toast.success(page.props.flash?.success || 'تم حفظ إعدادات WhatsApp.'),
            onError: (errors) => toast.error(Object.values(errors).join(', ') || 'تعذر حفظ إعدادات WhatsApp.'),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <SettingsSection
            title={localizeSystemText("WhatsApp Business API")}
            description="إرسال بيانات دخول بوابة العميل من خلال قالب WhatsApp معتمد من Meta."
            action={<Button onClick={save} disabled={processing} size="sm"><Save className="mr-2 h-4 w-4" />{processing ? 'جارٍ الحفظ…' : 'حفظ الإعدادات'}</Button>}
        >
            <form onSubmit={save} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-lg border bg-white p-6">
                        <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
                            <div><Label htmlFor="whatsapp-enabled">تفعيل إرسال بيانات الدخول</Label><p className="mt-1 text-xs text-slate-600">عند التعطيل سيُنشأ الحساب لكن لن تُرسل رسالة خارجية.</p></div>
                            <Switch id="whatsapp-enabled" checked={settings.whatsapp_enabled} onCheckedChange={(value) => update('whatsapp_enabled', value)} />
                        </div>
                        <div><Label htmlFor="whatsapp-graph-version">إصدار Graph API</Label><Input id="whatsapp-graph-version" value={settings.whatsapp_graph_version} onChange={(e) => update('whatsapp_graph_version', e.target.value)} placeholder="v23.0" className="mt-2 font-mono" /></div>
                        <div><Label htmlFor="whatsapp-phone-number-id">معرّف رقم الهاتف</Label><Input id="whatsapp-phone-number-id" value={settings.whatsapp_phone_number_id} onChange={(e) => update('whatsapp_phone_number_id', e.target.value)} className="mt-2 font-mono" /></div>
                        <div><Label htmlFor="whatsapp-access-token" className="flex items-center gap-2"><Key className="h-4 w-4" />رمز وصول دائم</Label><Input id="whatsapp-access-token" type="password" value={settings.whatsapp_access_token} onChange={(e) => update('whatsapp_access_token', e.target.value)} placeholder={MASKED_TOKEN} className="mt-2 font-mono" /></div>
                    </div>
                    <div className="space-y-4 rounded-lg border bg-white p-6">
                        <div><Label htmlFor="whatsapp-template-name">اسم القالب المعتمد</Label><Input id="whatsapp-template-name" value={settings.whatsapp_template_name} onChange={(e) => update('whatsapp_template_name', e.target.value)} className="mt-2 font-mono" /></div>
                        <div><Label htmlFor="whatsapp-template-language">لغة القالب</Label><Input id="whatsapp-template-language" value={settings.whatsapp_template_language} onChange={(e) => update('whatsapp_template_language', e.target.value)} placeholder="ar أو ar_EG" className="mt-2 font-mono" /></div>
                        <div className="rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                            <div className="mb-2 flex items-center gap-2 font-medium text-slate-900"><MessageCircle className="h-4 w-4 text-emerald-700" />ترتيب متغيرات قالب بيانات الدخول</div>
          <p>يجب أن يحتوي نص الرسالة في Meta على ثلاثة متغيرات بالترتيب:</p>
                            <ol className="mr-5 list-decimal"><li>اسم العميل</li><li>رابط دخول البوابة</li><li>كلمة المرور المؤقتة</li></ol>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900"><Check className="mt-1 h-4 w-4 shrink-0" />لا يتم تخزين كلمة المرور المؤقتة كنص صريح؛ يتم إرسالها مرة واحدة فقط بعد إنشاء الحساب.</div>
                    </div>
                </div>
            </form>
        </SettingsSection>
    );
}
