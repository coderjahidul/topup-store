import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

/**
 * Translate a key using shared Inertia JSON translations.
 *
 * @returns {{ t: (key: string, replace?: Record<string, string|number>) => string, locale: string }}
 */
export default function useTrans() {
    const { translations = {}, locale = 'bn' } = usePage().props;

    const t = useCallback(
        (key, replace = {}) => {
            let text = translations[key] ?? key;

            Object.entries(replace).forEach(([token, value]) => {
                text = text.replaceAll(`:${token}`, String(value));
            });

            return text;
        },
        [translations],
    );

    return { t, locale };
}
