import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, LockKeyhole, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PortalChangePassword({ portalAccount }: any) {
    const form = useForm({ password: '', password_confirmation: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('portal.password.update'), { onFinish: () => form.reset() });
    };

    return (
        <main dir="rtl" lang="ar" className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#dff7ed_0,#f8fafc_52%)] px-4 py-10">
            <Head title="تغيير كلمة المرور - بوابة العميل" />
            <Card className="w-full max-w-md border-slate-200 shadow-xl">
                <CardHeader className="items-center text-center">
                    <span className="mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-700 text-white"><Scale className="h-8 w-8" /></span>
                    <CardTitle className="text-2xl">غيّر كلمة المرور</CardTitle>
                    <CardDescription>مرحبًا {portalAccount?.name} — يجب تغيير كلمة المرور المؤقتة قبل متابعة استخدام البوابة.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-5" onSubmit={submit}>
                        <div className="space-y-2"><Label htmlFor="portal-new-password">كلمة المرور الجديدة</Label><Input id="portal-new-password" type="password" autoComplete="new-password" minLength={12} required value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} /><p className="text-xs text-slate-500">استخدم 12 حرفًا أو أكثر.</p><p className="text-sm text-destructive">{form.errors.password}</p></div>
                        <div className="space-y-2"><Label htmlFor="portal-password-confirmation">تأكيد كلمة المرور</Label><Input id="portal-password-confirmation" type="password" autoComplete="new-password" minLength={12} required value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} /><p className="text-sm text-destructive">{form.errors.password_confirmation}</p></div>
                        <Button className="w-full" disabled={form.processing}><KeyRound className="ml-2 h-4 w-4" />{form.processing ? 'جارٍ الحفظ…' : 'حفظ ودخول البوابة'}</Button>
                    </form>
                    <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500"><LockKeyhole className="h-3.5 w-3.5" />لن يتم إرسال كلمة المرور الجديدة لأي جهة.</p>
                </CardContent>
            </Card>
        </main>
    );
}
