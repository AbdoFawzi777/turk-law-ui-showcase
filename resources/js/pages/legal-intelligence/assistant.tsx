import { FormEvent, useState } from 'react';
import axios from 'axios';
import { Bot, FileText, Scale, Send, ShieldCheck } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function LegalAssistant({ matters = [], documents = [], permissions = {} }: any) {
    const sourceLabels: Record<string, string> = { matter: 'ملف', case: 'قضية', document: 'مستند', hearing: 'جلسة', deadline: 'موعد نهائي', timeline: 'حدث' };
    const initialMode = permissions.matter ? 'matter' : 'document';
    const [mode, setMode] = useState(initialMode);
    const [matterId, setMatterId] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault(); setError(''); setAnswer(null); setLoading(true);
        try {
            const response = await axios.post(route('legal-intelligence.ask'), { mode, matter_id: matterId || null, document_id: documentId || null, question });
            setAnswer(response.data);
        } catch (exception: any) {
            setError(exception.response?.data?.message || exception.response?.data?.errors?.question?.[0] || 'تعذر إكمال الطلب. راجع اختيار الملف والصلاحيات ثم حاول مرة أخرى.');
        } finally { setLoading(false); }
    };

    return <PageTemplate title="ميزان AI" description="مساعد قانوني واعٍ بالسياق والصلاحيات، ويعرض مصادر كل إجابة." url={route('legal-intelligence.assistant')}>
        <div dir="rtl" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
                <Alert><ShieldCheck className="h-4 w-4" /><AlertTitle>ضوابط الاستخدام</AlertTitle><AlertDescription>لا يُرسل ميزان محتوى غير مصرح لك به، ولا يحتفظ بنص سؤالك داخل سجل النشاط. كل نتيجة مسودة تتطلب مراجعة بشرية.</AlertDescription></Alert>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-emerald-700" />اسأل ميزان</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}>
                    <fieldset className="flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">نطاق السؤال</legend>{permissions.matter && <Button type="button" variant={mode === 'matter' ? 'default' : 'outline'} onClick={() => setMode('matter')}><Scale className="ml-2 h-4 w-4" />ملف قانوني</Button>}{permissions.document && <Button type="button" variant={mode === 'document' ? 'default' : 'outline'} onClick={() => setMode('document')}><FileText className="ml-2 h-4 w-4" />مستند</Button>}</fieldset>
                    {mode === 'matter' ? <label className="block space-y-2"><span className="text-sm font-medium">اختر الملف</span><select required className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={matterId} onChange={(e) => setMatterId(e.target.value)}><option value="">اختر ملفًا قانونيًا</option>{matters.map((matter: any) => <option key={matter.id} value={matter.id}>{matter.matter_number || 'دون رقم'} — {matter.title}</option>)}</select></label> : <label className="block space-y-2"><span className="text-sm font-medium">اختر المستند</span><select required className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={documentId} onChange={(e) => setDocumentId(e.target.value)}><option value="">اختر مستندًا</option>{documents.map((document: any) => <option key={document.id} value={document.id}>{document.document_number || 'دون رقم'} — {document.title || document.name}</option>)}</select></label>}
                    <label className="block space-y-2"><span className="text-sm font-medium">السؤال</span><Textarea required minLength={3} rows={5} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="مثال: لخّص آخر تطورات الملف مع الإشارة إلى المستندات ذات الصلة." /></label>
                    {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
                    <Button disabled={loading}>{loading ? 'جارٍ تحليل المصادر…' : 'إرسال السؤال'}<Send className="mr-2 h-4 w-4" /></Button>
                </form></CardContent></Card>
                {answer && <Card aria-live="polite"><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>الإجابة</CardTitle><Badge variant="outline">{answer.sources?.length || 0} مصدر</Badge></div></CardHeader><CardContent><div className="whitespace-pre-line leading-8">{answer.answer}</div><p className="mt-5 rounded-md bg-amber-50 p-3 text-xs text-amber-900">{answer.notice}</p></CardContent></Card>}
            </div>
            <Card className="h-fit"><CardHeader><CardTitle>المصادر المستخدمة</CardTitle></CardHeader><CardContent className="space-y-3">{answer?.sources?.map((source: any, index: number) => <article key={`${source.source_type}-${source.source_id}-${index}`} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-2"><strong className="text-sm">{source.label}</strong><Badge variant="secondary">{source.version ? `إصدار ${source.version}` : sourceLabels[source.source_type] || 'مصدر'}</Badge></div><p className="mt-2 line-clamp-4 text-xs leading-6 text-muted-foreground">{source.excerpt}</p></article>)}{!answer?.sources?.length && <p className="py-10 text-center text-sm text-muted-foreground">ستظهر هنا المراجع التي بُنيت عليها الإجابة.</p>}</CardContent></Card>
        </div>
    </PageTemplate>;
}
