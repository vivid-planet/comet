export type Metadata = {
    title?: string;
    description?: string | null;
    openGraph?: {
        title?: string | null;
        description?: string | null;
        type?: string;
        url?: string;
        images?: string;
    };
    robots?: {
        index: boolean;
    };
    alternates?: {
        canonical?: string;
        languages?: Record<string, string>;
    };
};

type Props = {
    metadata?: Promise<Metadata>;
    defaultMetadata: Metadata;
};

export async function MetadataTags({ metadata, defaultMetadata }: Props) {
    const { title, description, openGraph, robots, alternates } = { ...defaultMetadata, ...(await metadata) };

    return (
        <>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {robots && <meta name="robots" content={robots.index ? "index" : "noindex"} />}
            {alternates?.canonical && <link rel="canonical" href={alternates.canonical} />}
            {Object.entries(alternates?.languages ?? {}).map(([language, href]) => (
                <link key={language} rel="alternate" hrefLang={language} href={href} />
            ))}
            {openGraph?.title && <meta property="og:title" content={openGraph.title} />}
            {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
            {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
            {openGraph?.images && <meta property="og:image" content={openGraph.images} />}
            {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
        </>
    );
}
