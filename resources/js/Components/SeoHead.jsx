import { Head, usePage } from '@inertiajs/react';

export default function SeoHead({
    title,
    description,
    image,
    type = 'website',
    path,
    noindex = false,
}) {
    const { seo, locale, appName } = usePage().props;
    const pageTitle = title ? `${title} | ${appName}` : seo?.default_title || appName;
    const desc = description || seo?.default_description || '';
    const ogImage = image || seo?.og_image || '/icons/icon-512.png';
    const url = `${seo?.base_url || ''}${path || (typeof window !== 'undefined' ? window.location.pathname : '/')}`;
    const currentLocale = locale || 'bn';
    const alternateBn = seo?.base_url ? `${seo.base_url}${path || '/'}` : url;
    const alternateEn = alternateBn;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta head-key="description" name="description" content={desc} />
            {noindex && <meta head-key="robots" name="robots" content="noindex,nofollow" />}
            <meta head-key="og:title" property="og:title" content={pageTitle} />
            <meta head-key="og:description" property="og:description" content={desc} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:url" property="og:url" content={url} />
            <meta head-key="og:image" property="og:image" content={ogImage.startsWith('http') ? ogImage : `${seo?.base_url || ''}${ogImage}`} />
            <meta head-key="og:locale" property="og:locale" content={currentLocale === 'bn' ? 'bn_BD' : 'en_US'} />
            <meta head-key="og:locale:alt" property="og:locale:alternate" content={currentLocale === 'bn' ? 'en_US' : 'bn_BD'} />
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <link head-key="canonical" rel="canonical" href={url} />
            <link head-key="hreflang-bn" rel="alternate" hrefLang="bn" href={alternateBn} />
            <link head-key="hreflang-en" rel="alternate" hrefLang="en" href={alternateEn} />
            <link head-key="hreflang-default" rel="alternate" hrefLang="x-default" href={alternateBn} />
            <link rel="manifest" href="/manifest.webmanifest" />
            <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </Head>
    );
}
