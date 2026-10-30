import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Scale } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useFavicon } from '@/hooks/use-favicon';
import CookieConsentBanner from '@/components/CookieConsentBanner';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    icon?: ReactNode;
    status?: string;
    statusType?: 'success' | 'error';
}

export default function AuthLayout({
    children,
    title,
    description,
    icon,
    status,
    statusType = 'success',
}: AuthLayoutProps) {
    useFavicon();
    const globalSettings = (usePage().props as any).globalSettings;
    const userLanguage = (usePage().props as any).userLanguage;

    // RTL Support for auth pages - Apply immediately and persist
    const applyRTLDirection = React.useCallback(() => {
        const isDemo = globalSettings?.is_demo || false;
        const currentLang = userLanguage || globalSettings?.defaultLanguage || 'en';
        const isRTLLanguage = ['ar', 'he'].includes(currentLang);
        let dir = 'ltr';

        const getCookie = (name: string): string | null => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                const cookieValue = parts.pop()?.split(';').shift();
                return cookieValue ? decodeURIComponent(cookieValue) : null;
            }
            return null;
        };

        // Check RTL setting from cookies/globalSettings
        const layoutDirection = isDemo ? getCookie('layoutDirection') : globalSettings?.layoutDirection;
        const isRTLSetting = layoutDirection === 'right';
        
        // Prioritize language direction, then layout direction setting
        if (isRTLLanguage) {
            dir = 'rtl';
        } else if (isRTLSetting) {
            dir = 'rtl';
        }

        // Apply to both html and body elements
        document.documentElement.dir = dir;
        document.documentElement.setAttribute('dir', dir);
        document.body.dir = dir;
        
        // Also set lang attribute
        document.documentElement.lang = currentLang;
        
        return dir;
    }, [globalSettings, userLanguage]);

    useEffect(() => {
        const direction = applyRTLDirection();
        
        // Listen for language changes from LanguageSwitcher
        const handleLanguageChange = (event: CustomEvent) => {
            const { language, direction: newDirection } = event.detail;
            const isRTL = ['ar', 'he'].includes(language) || newDirection === 'right';
            const finalDir = isRTL ? 'rtl' : 'ltr';
            
            document.documentElement.dir = finalDir;
            document.documentElement.setAttribute('dir', finalDir);
            document.body.dir = finalDir;
            document.documentElement.lang = language;
        };

        // Listen for both standard and landing page language change events
        window.addEventListener('languageChanged', handleLanguageChange as EventListener);
        window.addEventListener('languageDirectionChanged', handleLanguageChange as EventListener);
        
        // Ensure direction persists after any DOM changes
        const observer = new MutationObserver(() => {
            const currentDir = document.documentElement.dir;
            if (currentDir !== direction && !['rtl', 'ltr'].includes(currentDir)) {
                document.documentElement.dir = direction;
                document.documentElement.setAttribute('dir', direction);
            }
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });
        
        // Cleanup function
        return () => {
            observer.disconnect();
            window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
            window.removeEventListener('languageDirectionChanged', handleLanguageChange as EventListener);
        };
    }, [applyRTLDirection]);


     return (
        <div className="min-h-screen bg-background relative">
            <Head title={title} />

            <div className="absolute top-6 right-6 z-10 md:block hidden">
                <LanguageSwitcher />
            </div>

            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="relative inline-block pb-2 px-6">
                            <div className="flex items-center justify-center gap-3 py-1">
                                <div className="h-11 w-11 rounded-md border border-border bg-background text-foreground flex items-center justify-center shadow-none">
                                    <Scale className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col text-start">
                                    <span className="text-2xl font-black text-foreground tracking-tight leading-tight">ميزان</span>
                                    <span className="text-xs font-bold text-muted-foreground leading-tight">نظام إدارة المحاماة</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-background border border-border rounded-md lg:p-8 p-4 lg:pt-5 shadow-none">
                            {/* Header */}
                            <div className="text-center mb-4">
                                {icon && (
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background">
                                        {icon}
                                    </div>
                                )}
                                <h1 className="text-2xl font-semibold text-foreground mb-1.5 tracking-wide">{title}</h1>
                                <div className="w-12 h-px mx-auto mb-2.5 bg-border"></div>
                                {description && (
                                    <p className="text-muted-foreground text-sm">{description}</p>
                                )}
                            </div>

                            {status && (
                                <div className={`mb-6 text-center text-sm font-medium ${statusType === 'success'
                                        ? 'text-foreground bg-background border-border'
                                        : 'text-destructive bg-background border-border'
                                    } p-3 rounded-md border`}>
                                    {status}
                                </div>
                            )}

                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                            <div className="inline-flex items-center space-x-2 bg-background rounded-md px-4 py-2 border border-border">
                                <p className="text-sm text-muted-foreground">{globalSettings?.footerText || '© 2026 ميزان'}</p>
                            </div>
                    </div>


                </div>
            </div>
            <CookieConsentBanner />
        </div>
    );
}
