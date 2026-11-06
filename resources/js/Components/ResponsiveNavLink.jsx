import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 focus:border-cyan-300 focus:bg-cyan-500/15 focus:text-cyan-200'
                    : 'border-transparent text-slate-300 hover:border-slate-500 hover:bg-white/5 hover:text-white focus:border-slate-500 focus:bg-white/5 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
