import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function BannerSlider({ banners = [] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) {
            return undefined;
        }

        const id = setInterval(() => {
            setIndex((current) => (current + 1) % banners.length);
        }, 4500);

        return () => clearInterval(id);
    }, [banners.length]);

    if (!banners.length) {
        return null;
    }

    const banner = banners[index];

    const content = (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900">
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 to-transparent" />
            <div className="relative flex min-h-[180px] flex-col justify-end gap-2 p-6 sm:min-h-[220px] sm:p-8">
                <p className="max-w-xl text-2xl font-bold text-white sm:text-3xl">{banner.title}</p>
                <div className="mt-2 flex gap-2">
                    {banners.map((item, dotIndex) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-label={`Slide ${dotIndex + 1}`}
                            onClick={() => setIndex(dotIndex)}
                            className={`h-2 w-2 rounded-full transition ${
                                dotIndex === index ? 'bg-cyan-400' : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(circle_at_60%_80%,rgba(168,85,247,0.2),transparent_35%)]" />
        </div>
    );

    if (banner.link) {
        return (
            <Link href={banner.link} className="block">
                {content}
            </Link>
        );
    }

    return content;
}
