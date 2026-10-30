import { t as localizeSystemText } from '@/utils/i18n';
import languageData from '@/../../resources/lang/language.json';
import { toast } from '@/components/custom-toast';
import { SettingsSection } from '@/components/settings-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { router, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
interface SystemSettingsProps {
    settings?: Record<string, string | boolean | number>;
    timezones?: Record<string, string>;
    dateFormats?: Record<string, string>;
    timeFormats?: Record<string, string>;
}

export default function SystemSettings({ settings = {}, timezones = {}, dateFormats = {}, timeFormats = {} }: SystemSettingsProps) {
    const { t } = useTranslation();
    const pageProps = usePage<{ settings?: Record<string, string | boolean | number> } & import('@inertiajs/core').PageProps>().props;
    const { auth } = pageProps;
    const isCompanyUser = auth?.roles?.includes('company');
    const [isLoading, setIsLoading] = useState(false);

    // Default settings
    const defaultSettings = {
        defaultLanguage: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        calendarStartDay: 'sunday',
        defaultTimezone: 'UTC',
        emailVerification: false,
        landingPageEnabled: true,
        registrationEnabled: true,
        strictlyNecessaryCookies: false,
        termsConditionsUrl: ''

    };

    const settingsData = Object.keys(settings).length > 0 ? settings : pageProps.settings || {};
    const readSettings = (values: Record<string, string | boolean | number>) => {
        const text = (key: keyof typeof defaultSettings) => String(values[key] ?? defaultSettings[key]);
        const enabled = (key: keyof typeof defaultSettings) => {
            const value = values[key] ?? defaultSettings[key];
            return value === true || value === 'true' || value === 1 || value === '1';
        };
        return {
            defaultLanguage: text('defaultLanguage'), dateFormat: text('dateFormat'),
            timeFormat: text('timeFormat'), calendarStartDay: text('calendarStartDay'),
            defaultTimezone: text('defaultTimezone'), termsConditionsUrl: text('termsConditionsUrl'),
            emailVerification: enabled('emailVerification'), landingPageEnabled: enabled('landingPageEnabled'),
            registrationEnabled: enabled('registrationEnabled'), strictlyNecessaryCookies: enabled('strictlyNecessaryCookies'),
        };
    };
    const [systemSettings, setSystemSettings] = useState(() => readSettings(settingsData));
    useEffect(() => {
        if (Object.keys(settingsData).length > 0) {
            setSystemSettings(readSettings(settingsData));
        }
    }, [settingsData]);

    // Handle system settings form changes
    const handleSystemSettingsChange = (field: string, value: string | boolean) => {
        setSystemSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle system settings form submission
    const submitSystemSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Create clean settings object
        const cleanSettings = {
            defaultLanguage: systemSettings.defaultLanguage,
            dateFormat: systemSettings.dateFormat,
            timeFormat: systemSettings.timeFormat,
            calendarStartDay: systemSettings.calendarStartDay,
            defaultTimezone: systemSettings.defaultTimezone,
            emailVerification: Boolean(systemSettings.emailVerification),
            landingPageEnabled: Boolean(systemSettings.landingPageEnabled),
            registrationEnabled: Boolean(systemSettings.registrationEnabled),
            strictlyNecessaryCookies: Boolean(systemSettings.strictlyNecessaryCookies),
            termsConditionsUrl: systemSettings.termsConditionsUrl
        };

        // Submit to backend using Inertia
        router.post(route('settings.system.update'), cleanSettings, {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsLoading(false);
                const successMessage = page.props.flash?.success;
                const errorMessage = page.props.flash?.error;

                if (successMessage) {
                    toast.success(successMessage);
                } else if (errorMessage) {
                    toast.error(errorMessage);
                }
            },
            onError: (errors) => {
                setIsLoading(false);
                const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update system settings');
                toast.error(errorMessage);
            },
        });
    };

    return (
        <SettingsSection
            title={t('System Settings')}
            description={t('Configure system-wide settings for your application')}
            action={
                <Button type="submit" form="system-settings-form" disabled={isLoading} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? t('Saving...') : t('Save Changes')}
                </Button>
            }
        >
            <form id="system-settings-form" onSubmit={submitSystemSettings} className="space-y-6">
                <Card>
                    <CardContent className='mt-6'>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="defaultLanguage">{t('Default Language')}</Label>
                                <Select
                                    value={systemSettings.defaultLanguage}
                                    onValueChange={(value) => handleSystemSettingsChange('defaultLanguage', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select language')}>
                                            {systemSettings.defaultLanguage &&
                                                (() => {
                                                    const selectedLang = languageData.find((lang) => lang.code === systemSettings.defaultLanguage);
                                                    return selectedLang ? (
                                                        <div className="flex items-center space-x-2">
                                                            <ReactCountryFlag
                                                                countryCode={selectedLang.countryCode}
                                                                svg
                                                                style={{
                                                                    width: '1.2em',
                                                                    height: '1.2em',
                                                                }}
                                                            />{' '}
                                                            <span>{selectedLang.name}</span>{' '}
                                                        </div>
                                                    ) : (
                                                        t('Select language')
                                                    );
                                                })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languageData.map((language) => (
                                            <SelectItem key={language.code} value={language.code}>
                                                <div className="flex items-center space-x-2">
                                                    <ReactCountryFlag
                                                        countryCode={language.countryCode}
                                                        svg
                                                        style={{
                                                            width: '1.2em',
                                                            height: '1.2em',
                                                        }}
                                                    />{' '}
                                                    <span>{language.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dateFormat">{t('Date Format')}</Label>
                                <Select value={systemSettings.dateFormat} onValueChange={(value) => handleSystemSettingsChange('dateFormat', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select date format')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(dateFormats).length > 0 ? (
                                            Object.entries(dateFormats).map(([format, example]) => (
                                                <SelectItem key={format} value={format}>
                                                    <div className="flex w-full items-center justify-between">
                                                        <span>{format}</span>
                                                        <span className="text-muted-foreground ml-4 text-sm">({example})</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="M j, Y">1 يناير 2025</SelectItem>
                                                <SelectItem value="d-m-Y">01-01-2025</SelectItem>
                                                <SelectItem value="Y-m-d">2025-01-01</SelectItem>
                                                <SelectItem value="F j, Y">1 يناير 2025</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="timeFormat">{t('Time Format')}</Label>
                                <Select value={systemSettings.timeFormat} onValueChange={(value) => handleSystemSettingsChange('timeFormat', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select time format')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(timeFormats).length > 0 ? (
                                            Object.entries(timeFormats).map(([format, example]) => (
                                                <SelectItem key={format} value={format}>
                                                    <div className="flex w-full items-center justify-between">
                                                        <span>{format}</span>
                                                        <span className="text-muted-foreground ml-4 text-sm">({example})</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="g:i A">{localizeSystemText("1:30 PM")}</SelectItem>
                                                <SelectItem value="H:i">13:30</SelectItem>
                                                <SelectItem value="g:i a">{localizeSystemText("1:30 pm")}</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="calendarStartDay">{t('Calendar Start Day')}</Label>
                                <Select
                                    value={systemSettings.calendarStartDay}
                                    onValueChange={(value) => handleSystemSettingsChange('calendarStartDay', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select start day')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sunday">{t('Sunday')}</SelectItem>
                                        <SelectItem value="monday">{t('Monday')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="defaultTimezone">{t('Default Timezone')}</Label>
                                <Select
                                    value={systemSettings.defaultTimezone}
                                    onValueChange={(value) => handleSystemSettingsChange('defaultTimezone', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select timezone')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(timezones).length > 0 ? (
                                            Object.entries(timezones).map(([timezone, description]) => (
                                                <SelectItem key={timezone} value={timezone}>
                                                    {description}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="UTC">UTC</SelectItem>
                                                <SelectItem value="America/New_York">التوقيت الشرقي (ET)</SelectItem>
                                                <SelectItem value="America/Chicago">التوقيت المركزي (CT)</SelectItem>
                                                <SelectItem value="Europe/London">لندن (GMT)</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {!isCompanyUser && (
                                <div className="grid gap-2 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="emailVerification">{t('Email Verification')}</Label>
                                            <p className="text-muted-foreground text-sm">{t('Require users to verify their email addresses')}</p>
                                        </div>
                                        <Switch
                                            id="emailVerification"
                                            checked={systemSettings.emailVerification}
                                            onCheckedChange={(checked) => handleSystemSettingsChange('emailVerification', checked)}
                                        />
                                    </div>
                                </div>
                            )}

                            {!isCompanyUser && (
                                <div className="grid gap-2 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="landingPageEnabled">{t('Landing Page')}</Label>
                                            <p className="text-muted-foreground text-sm">{t('Enable or disable the public landing page')}</p>
                                        </div>
                                        <Switch
                                            id="landingPageEnabled"
                                            checked={systemSettings.landingPageEnabled}
                                            onCheckedChange={(checked) => handleSystemSettingsChange('landingPageEnabled', checked)}
                                        />
                                    </div>
                                </div>
                            )}

                            {!isCompanyUser && (
                                <div className="grid gap-2 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="registrationEnabled">{t('User Registration')}</Label>
                                            <p className="text-muted-foreground text-sm">{t('Allow new users to register accounts')}</p>
                                        </div>
                                        <Switch
                                            id="registrationEnabled"
                                            checked={systemSettings.registrationEnabled}
                                            onCheckedChange={(checked) => handleSystemSettingsChange('registrationEnabled', checked)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Terms and Conditions Section - Only for superadmin */}
                            {!isCompanyUser && (
                                <>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="termsConditionsUrl">{t("Terms and Conditions URL")}</Label>
                                        <Input
                                            id="termsConditionsUrl"
                                            type="url"
                                            value={systemSettings.termsConditionsUrl}
                                            onChange={(e) => handleSystemSettingsChange('termsConditionsUrl', e.target.value)}
                                            placeholder="https://example.com/terms"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t("URL for Terms and Conditions page used in registration form")}
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>
                    </CardContent>
                </Card>
            </form>
        </SettingsSection>
    );
}
