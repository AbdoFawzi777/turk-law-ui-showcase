import '../css/app.css';
import '../css/dark-mode.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import { LayoutProvider } from './contexts/LayoutContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { BrandProvider } from './contexts/BrandContext';
import { ModalStackProvider } from './contexts/ModalStackContext';
import { initializeTheme } from './hooks/use-appearance';
import { CustomToast } from './components/custom-toast';
import { initializeGlobalSettings } from './utils/globalSettings';
import { initPerformanceMonitoring, lazyLoadImages } from './utils/performance';
import { getCookie, isDemoMode } from './utils/cookies';
import './i18n'; // Import i18n configuration
import './utils/axios-config'; // Import axios configuration
import i18n, { i18nReady } from './i18n'; // Import i18n instance
// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize lazy loading of images when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});

// Add event listener for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-apply theme when system preference changes
    let savedTheme = null;

    if (isDemoMode()) {
        savedTheme = getCookie('themeSettings');
    }

    if (savedTheme) {
        const themeSettings = JSON.parse(savedTheme);
        if (themeSettings.appearance === 'system') {
            initializeTheme();
        }
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'ميزان';

i18nReady.then(() => createInertiaApp({
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Make page data globally available for axios interceptor
        try {
            (window as any).page = props.initialPage;
        } catch (e) {
        }

        // Set demo mode globally
        try {
            (window as any).isDemo = props.initialPage.props?.is_demo || false;
            (window as any).appConfig = {
                is_demo: props.initialPage.props?.is_demo || false
            };
        } catch (e) {
            // Ignore errors
        }

        // Sync language from database
        const syncLanguage = (pageProps: any) => {
            if (isDemoMode()) {
                return;
            }

            const userLanguage = pageProps?.props?.userLanguage || pageProps?.props?.auth?.user?.lang || 'ar';

            if (userLanguage) {
                const isRtl = ['ar', 'he', 'fa', 'ur'].includes(userLanguage);
                document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
                document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
                document.documentElement.lang = userLanguage;

                if (i18n.language !== userLanguage) {
                    i18n.changeLanguage(userLanguage);
                }
            }
        };

        // Initial language sync
        syncLanguage(props.initialPage);

        // Initialize global settings from shared data
        const globalSettings = props.initialPage.props.globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);
        }

        // Create a memoized render function to prevent unnecessary re-renders
        const renderApp = (appProps: any) => {
            const currentGlobalSettings = appProps.initialPage.props.globalSettings || {};
            const user = appProps.initialPage.props.auth?.user;

            return (
                <ModalStackProvider>
                    <LayoutProvider>
                        <SidebarProvider>
                            <BrandProvider globalSettings={currentGlobalSettings} user={user}>
                                <Suspense fallback={<div dir="rtl" className="flex h-screen w-full items-center justify-center">جارٍ تحميل الصفحة…</div>}>
                                    <App {...appProps} />
                                </Suspense>
                                <CustomToast />
                            </BrandProvider>
                        </SidebarProvider>
                    </LayoutProvider>
                </ModalStackProvider>
            );
        };

        // Initial render
        root.render(renderApp(props));

        // Update global page data on navigation and re-render with new settings
        router.on('navigate', (event) => {
            try {
                (window as any).page = event.detail.page;

                // Sync language from database AFTER render
                setTimeout(() => {
                    syncLanguage(event.detail.page);
                }, 0);

                // Re-render with updated props including globalSettings
                root.render(renderApp({ initialPage: event.detail.page }));

                // Force layout direction update from cookies/settings
                setTimeout(() => {
                    const isDemo = isDemoMode();
                    const currentLang = (event.detail.page.props as any)?.userLanguage || (event.detail.page.props as any)?.auth?.user?.lang || getCookie('app_language') || localStorage.getItem('i18nextLng') || 'ar';
                    const isRTLLang = ['ar', 'he', 'fa', 'ur'].includes(currentLang);
                    let layoutDirection = isRTLLang ? 'right' : 'left';

                    if (isDemo) {
                        const savedDirection = getCookie('layoutDirection');
                        if (savedDirection) {
                            layoutDirection = savedDirection;
                        }
                    } else {
                        const newGlobalSettings = event.detail.page.props.globalSettings;
                        if (newGlobalSettings?.layoutDirection) {
                            layoutDirection = newGlobalSettings.layoutDirection;
                        }
                    }

                    const isRtlFinal = layoutDirection === 'right' || isRTLLang;
                    document.documentElement.dir = isRtlFinal ? 'rtl' : 'ltr';
                    document.documentElement.setAttribute('dir', isRtlFinal ? 'rtl' : 'ltr');

                    // Dispatch event to notify LayoutContext
                    window.dispatchEvent(new CustomEvent('layoutDirectionChanged', {
                        detail: { direction: isRtlFinal ? 'right' : 'left' }
                    }));
                }, 0);

                // Force dark mode check on navigation
                let savedTheme = null;

                if (isDemoMode()) {
                    savedTheme = getCookie('themeSettings');
                }

                if (savedTheme) {
                    const themeSettings = JSON.parse(savedTheme);
                    const isDark = themeSettings.appearance === 'dark' ||
                        (themeSettings.appearance === 'system' &&
                            window.matchMedia('(prefers-color-scheme: dark)').matches);
                    document.documentElement.classList.toggle('dark', isDark);
                    document.body.classList.toggle('dark', isDark);
                }
            } catch (e) {
            }
        });
    },
    progress: {
        color: '#4B5563',
    },
}));

// This will set light / dark mode on load...
initializeTheme();

// Global function to update direction (updated for RTL/LTR)
window.updateLayoutDirection = (lng: string) => {
    const isRTL = ['ar', 'he', 'fa', 'ur'].includes(lng);
    const direction = isRTL ? 'rtl' : 'ltr';

    document.documentElement.dir = direction;
    document.documentElement.setAttribute('dir', direction);

    // Force layout recalculation
    document.documentElement.classList.add('direction-changed');
    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
        document.documentElement.classList.remove('direction-changed');
    }, 100);

    window.dispatchEvent(new CustomEvent('languageDirectionChanged', {
        detail: { language: lng, direction: direction }
    }));
};

// Override i18n changeLanguage to update direction immediately
const originalChangeLanguage = i18n.changeLanguage;
i18n.changeLanguage = function(lng, callback) {
    // Check if user has saved layout preference before changing language
    const isDemo = isDemoMode();
    let savedLayoutDirection = null;

    if (isDemo) {
        savedLayoutDirection = getCookie('layoutDirection');
    } else {
        const globalSettings = (window as any).page?.props?.globalSettings;
        savedLayoutDirection = globalSettings?.layoutDirection;
    }

    const result = originalChangeLanguage.call(this, lng, callback);

    // Only update direction if no saved preference exists
    if (!savedLayoutDirection && lng) {
        window.updateLayoutDirection(lng);
    } else {
    }

    return result;
};

// Listen for i18n events as backup
i18n.on('languageChanged', (lng) => {
    // Check if user has saved layout preference
    const isDemo = isDemoMode();
    let savedLayoutDirection = null;

    if (isDemo) {
        savedLayoutDirection = getCookie('layoutDirection');
    } else {
        const globalSettings = (window as any).page?.props?.globalSettings;
        savedLayoutDirection = globalSettings?.layoutDirection;
    }

    // Only update direction if no saved preference exists
    if (!savedLayoutDirection) {
        window.updateLayoutDirection(lng);
    }
});
i18n.on('loaded', () => {
    // Check if user has saved layout preference
    const isDemo = isDemoMode();
    let savedLayoutDirection = null;

    if (isDemo) {
        savedLayoutDirection = getCookie('layoutDirection');
    } else {
        const globalSettings = (window as any).page?.props?.globalSettings;
        savedLayoutDirection = globalSettings?.layoutDirection;
    }

    // Only update direction if no saved preference exists
    if (!savedLayoutDirection) {
        window.updateLayoutDirection(i18n.language);
    }
});
