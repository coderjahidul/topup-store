import { Link } from '@inertiajs/react';

/**
 * Laravel LengthAwarePaginator `links` array (first, prev, page numbers, next, last).
 */
export default function PaginationBar({ links }) {
    if (!links?.length || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 pt-4">
            {links.map((link, index) => (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url || '#'}
                    className={`rounded-lg px-3 py-1 text-sm ${
                        link.active
                            ? 'bg-cyan-500 font-medium text-navy-950'
                            : 'border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-200'
                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
