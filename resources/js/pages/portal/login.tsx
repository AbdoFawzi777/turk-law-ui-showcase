import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PortalLogin() {
    const form = useForm({ login: '', password: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('portal.login.store'), { onFinish: () => form.reset('password') });
    };

    return (
        <main dir="rtl" lang="ar" className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#dff7ed_0,#f8fafc_52%)] px-4 py-10">
            <Head title="دخول بوابة العميل" />
            <Card className="w-full max-w-md border-slate-200 shadow-xl">
                <CardHeader className="items-center text-center">
                    <span className="mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-700 text-white"><Scale className="h-8 w-8" /></span>
                    <CardTitle className="text-2xl">بوابة عميل ميزان</CardTitle>
                    <CardDescription>اطّلع على الملفات والتحديثات والمستندات التي شاركها المكتب معك.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-5" onSubmit={submit}>
                        <div className="space-y-2"><Label htmlFor="portal-login">رقم الموبايل أو البريد الإلكتروني</Label><Input id="portal-login" type="text" autoComplete="username" required autoFocus value={form.data.login} onChange={(e) => form.setData('login', e.target.value)} /><p className="text-sm text-destructive">{form.errors.login}</p></div>
                        <div className="space-y-2"><Label htmlFor="portal-password">كلمة المرور</Label><Input id="portal-password" type="password" autoComplete="current-password" required value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} /><p className="text-sm text-destructive">{form.errors.password}</p></div>
                        <Button className="w-full" disabled={form.processing}><LockKeyhole className="ml-2 h-4 w-4" />{form.processing ? 'جارٍ التحقق…' : 'دخول آمن'}</Button>
                    </form>
                    <p className="mt-5 text-center text-xs text-slate-500">هذه البوابة تعرض فقط البيانات التي وافق المكتب على مشاركتها.</p>
                </CardContent>
            </Card>
        </main>
    );
}
