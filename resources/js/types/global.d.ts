import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    interface Window {
        updateLayoutDirection: (direction: string) => void;
        isDemo?: boolean;
        is_demo?: boolean;
    }
}
