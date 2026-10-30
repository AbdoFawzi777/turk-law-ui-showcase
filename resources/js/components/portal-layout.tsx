import { Head, Link, router } from '@inertiajs/react';
import { BriefcaseBusiness, FileText, LogOut, Scale } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function PortalLayout({ title, account, children }: { title: string; account: any; children: ReactNode }) {
    return (
        <div dir="rtl" lang="ar" className="min-h-screen bg-slate-50 text-slate-950">
            <Head title={`${title} - بوابة العميل`} />
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link href={route('portal.dashboard')} className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-white"><Scale className="h-6 w-6" /></span>
                        <span><strong className="block text-lg">ميزان</strong><span className="text-xs text-slate-500">بوابة العميل الآمنة</span></span>
                    </Link>
                    <nav aria-label="التنقل الرئيسي" className="flex items-center gap-2">
                        <Button asChild variant="ghost"><Link href={route('portal.dashboard')}><BriefcaseBusiness className="ml-2 h-4 w-4" />الملفات</Link></Button>
                        <Button asChild variant="ghost"><Link href={route('portal.documents.index')}><FileText className="ml-2 h-4 w-4" />المستندات</Link></Button>
                        <Button variant="outline" onClick={() => router.post(route('portal.logout'))}><LogOut className="ml-2 h-4 w-4" />خروج</Button>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-2">
                    <div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">مرحبًا {account?.name} — {account?.client_name}</p></div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">اتصال آمن</span>
                </div>
                {children}
            </main>
        </div>
    );
}
