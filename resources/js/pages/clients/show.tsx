import { PageTemplate } from '@/components/page-template';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, FileText, User, Phone, Mail, MapPin,
    CreditCard, Calendar, Eye, Download, Hash, Tag, GitBranch, ShieldCheck, ClipboardList, Activity,
} from 'lucide-react';
import { hasPermission } from '@/utils/authorization';
import { getImagePath } from '@/utils/helpers';

export default function ClientShow() {
    const { t } = useTranslation();
    const { auth, client, documents, client360 } = usePage().props as any;
    const permissions = auth?.permissions || [];

    const canManageDocs   = hasPermission(permissions, 'manage-client-documents');
    const canDownloadDocs = hasPermission(permissions, 'download-client-documents');
    const canManageContacts = ['CLIENT_EDIT', 'edit-clients', 'manage-clients'].some((permission) => hasPermission(permissions, permission));
    const [contactForm, setContactForm] = useState({ name: '', job_title: '', email: '', phone: '', department: '', is_primary_contact: false, is_legal_contact: false, is_billing_contact: false });
    const addContact = (event: React.FormEvent) => {
        event.preventDefault();
        router.post(route('clients.contacts.store', client.id), contactForm, {
            onSuccess: () => setContactForm({ name: '', job_title: '', email: '', phone: '', department: '', is_primary_contact: false, is_legal_contact: false, is_billing_contact: false }),
        });
    };

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Client Management'), href: route('clients.index') },
        { title: t('Clients'), href: route('clients.index') },
        { title: t('Client Details') },
    ];

    const pageActions: import('@/components/page-template').PageAction[] = [
        {
            label: t('Back'),
            icon: <ArrowLeft className="h-4 w-4 mr-1" />,
            variant: 'outline' as const,
            onClick: () => router.get(route('clients.index')),
        },
    ];

    const isActive = client?.status === 'active';

    return (
        <PageTemplate
            title={client?.name || t('Client')}
            description={t("View client details, contact information, and documents.")}
            url={`/clients/${client?.id}`}
            breadcrumbs={breadcrumbs}
            actions={pageActions}
        >
            <div className="space-y-5">

                {/* ── Header Banner ── */}
                <div className="rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className={`h-1 w-full ${isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded mb-1.5 mr-2">
                                <Hash className="h-3 w-3" />{client?.client_id}
                            </span>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{client?.name}</h1>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                            {client?.client_type?.name && (
                                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-orange-50 text-orange-700 ring-orange-600/20">
                                    {client.client_type.name}
                                </span>
                            )}
                            {client?.tax_id && (
                                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-50 text-gray-700 ring-gray-600/20">
                                    {t('Tax ID')}: {client.tax_id}
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-50 text-gray-700 ring-gray-600/20">
                                {t('Tax Rate')}: {client?.tax_rate ? `${client.tax_rate}%` : '0%'}
                            </span>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                isActive
                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                    : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}>
                                {isActive ? t('Active') : t('Inactive')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Contact Information ── */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-primary" />{t('Legal contacts')}</CardTitle></CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {canManageContacts && <form onSubmit={addContact} className="grid gap-2 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2"><Input placeholder={t('Contact name')} value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required /><Input placeholder={t('Job title')} value={contactForm.job_title} onChange={(e) => setContactForm({ ...contactForm, job_title: e.target.value })} /><Input type="email" placeholder={t('Email')} value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} /><Input placeholder={t('Phone')} value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} /><div className="flex flex-wrap items-center gap-3 text-xs sm:col-span-2"><label className="flex items-center gap-1"><input type="checkbox" checked={contactForm.is_primary_contact} onChange={(e) => setContactForm({ ...contactForm, is_primary_contact: e.target.checked })} />{t('Primary')}</label><label className="flex items-center gap-1"><input type="checkbox" checked={contactForm.is_legal_contact} onChange={(e) => setContactForm({ ...contactForm, is_legal_contact: e.target.checked })} />{t('Legal')}</label><label className="flex items-center gap-1"><input type="checkbox" checked={contactForm.is_billing_contact} onChange={(e) => setContactForm({ ...contactForm, is_billing_contact: e.target.checked })} />{t('Billing')}</label><Button type="submit" size="sm" className="ms-auto">{t('Add contact')}</Button></div></form>}
                            {client360?.contacts?.length ? <div className="divide-y">{client360.contacts.map((contact: any) => <div key={contact.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"><div><p className="font-medium">{contact.name}</p><p className="text-xs text-muted-foreground">{contact.job_title || contact.department || '—'}</p></div><div className="text-end text-xs text-muted-foreground"><p>{contact.email || '—'}</p><p>{contact.phone || '—'}</p></div></div>)}</div> : <p className="text-sm text-muted-foreground">{t('No legal contacts recorded yet.')}</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><GitBranch className="h-4 w-4 text-primary" />{t('Related parties')}</CardTitle></CardHeader>
                        <CardContent className="p-5">{client360?.relationships?.length ? <div className="divide-y">{client360.relationships.map((relationship: any) => <div key={relationship.id} className="py-2 first:pt-0 last:pb-0"><p className="font-medium">{relationship.related_party?.name || relationship.party?.name || '—'}</p><p className="text-xs text-muted-foreground">{relationship.relationship_type} · {relationship.is_active ? t('Active') : t('Inactive')}</p></div>)}</div> : <p className="text-sm text-muted-foreground">{t('No relationships recorded yet.')}</p>}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4 text-primary" />{t('Matter intakes')}</CardTitle></CardHeader>
                        <CardContent className="p-5">{client360?.intakes?.length ? <div className="space-y-2">{client360.intakes.map((intake: any) => <div key={intake.id} className="flex justify-between rounded-lg border p-3 text-sm"><span>{intake.intake_reference} · {intake.title}</span><span className="text-muted-foreground">{intake.status}</span></div>)}</div> : <p className="text-sm text-muted-foreground">{t('No intakes recorded yet.')}</p>}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" />{t('Conflict checks')}</CardTitle></CardHeader>
                        <CardContent className="p-5">{client360?.conflict_checks?.length ? <div className="space-y-2">{client360.conflict_checks.map((check: any) => <div key={check.id} className="flex justify-between rounded-lg border p-3 text-sm"><span>{check.check_reference}</span><span className="text-muted-foreground">{check.status}</span></div>)}</div> : <p className="text-sm text-muted-foreground">{t('No conflict checks recorded yet.')}</p>}</CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-primary" />{t('Activity')}</CardTitle></CardHeader>
                        <CardContent className="p-5">{client360?.activity?.length ? <div className="divide-y">{client360.activity.map((entry: any) => <div key={entry.id} className="flex justify-between gap-3 py-2 text-sm"><span>{entry.action}</span><span className="text-xs text-muted-foreground">{entry.created_at}</span></div>)}</div> : <p className="text-sm text-muted-foreground">{t('No activity recorded yet.')}</p>}<p className="mt-4 text-xs text-muted-foreground">{t('Matters will appear here after the approved intake is converted. No case is created during intake.')}</p></CardContent>
                    </Card>
                </div>

                <Card className="flex flex-col">
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 shrink-0 rounded-t-lg">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {t('Contact Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 py-4 flex-1 overflow-y-auto space-y-3">

                            {/* Legal Identity Profile */}
                            {client?.client_kind === 'corporate' ? (
                                <>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Company name')}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">
                                            {client?.company_name || client?.name || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Commercial registration')}
                                        </span>
                                        <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 text-right" dir="ltr">
                                            {client?.commercial_registration_number || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Tax number')}
                                        </span>
                                        <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 text-right" dir="ltr">
                                            {client?.tax_number || client?.tax_id || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Contact person name')}
                                        </span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                            {client?.contact_person_name || '—'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Identity type')}
                                        </span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                            {client?.identity_type === 'iqama' ? t('Iqama') : t('National ID')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Identity number')}
                                        </span>
                                        <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200 text-right" dir="ltr">
                                            {client?.national_id || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                            {t('Nationality')}
                                        </span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                            {client?.nationality || '—'}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* City */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                    {t('City')}
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                    {client?.city || '—'}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />{t('Email')}
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right truncate max-w-[60%]">
                                    {client?.email || '—'}
                                </span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />{t('Phone')}
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                    {client?.phone || '—'}
                                </span>
                            </div>

                            {/* Date of Birth */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />{t('Date of Birth')}
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                    {client?.date_of_birth
                                        ? (window.appSettings?.formatDateTime(client.date_of_birth, false) || new Date(client.date_of_birth).toLocaleDateString())
                                        : '—'}
                                </span>
                            </div>

                            <div className="border-t dark:border-gray-700" />

                            {/* Address */}
                            <div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5">
                                    <MapPin className="h-4 w-4" />{t('Address')}
                                </span>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                                    {client?.address || '—'}
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                {/* ── Documents ── */}
                {canManageDocs && (
                    <Card className="shadow-sm">
                        <CardHeader className="px-5 py-3 border-b bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 rounded-t-lg shrink-0">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {t('Documents')}
                                {documents?.length > 0 && (
                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold w-5 h-5">
                                        {documents.length}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            {documents && documents.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {documents.map((doc: any, index: number) => (
                                        <div key={index} className="group relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            {/* File Preview */}
                                            <div className="relative h-28 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                {doc.file_path ? (
                                                    <>
                                                        <img
                                                            src={getImagePath(doc.file_path)}
                                                            alt={doc.document_name}
                                                            className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="hidden w-full h-full items-center justify-center">
                                                            <FileText className="h-7 w-7 text-gray-400" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <FileText className="h-7 w-7 text-gray-400" />
                                                )}
                                                {/* Hover actions */}
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                    {doc.file_path && (
                                                        <button
                                                            onClick={() => window.open(getImagePath(doc.file_path), '_blank')}
                                                            className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-gray-700" />
                                                        </button>
                                                    )}
                                                    {canDownloadDocs && (
                                                        <button
                                                            onClick={() => window.open(route('clients.documents.download', doc.id), '_blank')}
                                                            className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer"
                                                        >
                                                            <Download className="h-3.5 w-3.5 text-gray-700" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Doc info */}
                                            <div className="px-2.5 py-2 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{doc.document_name}</p>
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    {doc.document_type && (
                                                        <span
                                                            className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                                                            style={{
                                                                backgroundColor: `${doc.document_type.color}20`,
                                                                color: doc.document_type.color,
                                                                boxShadow: `inset 0 0 0 1px ${doc.document_type.color}33`,
                                                            }}
                                                        >
                                                            {doc.document_type.name}
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                        doc.status === 'active'
                                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                            : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-600/20'
                                                    }`}>
                                                        {doc.status === 'active' ? t('Active') : t('Archived')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-2">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('No documents found')}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{t('No documents have been uploaded for this client.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>
        </PageTemplate>
    );
}
