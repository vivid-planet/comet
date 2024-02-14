import Head from "next/head";
import * as React from "react";

import { PixelImageBlockData, SeoBlockData } from "../../blocks.generated";
import { generateImageUrl } from "../../image/Image";
import { PropsWithData } from "../PropsWithData";

type SeoBlockProps<T = PixelImageBlockData> = (T extends PixelImageBlockData
    ? PropsWithData<SeoBlockData> & { resolveOpenGraphImageUrlTemplate?: never }
    : { resolveOpenGraphImageUrlTemplate: (block: T) => string | undefined } & PropsWithData<
          Omit<SeoBlockData, "openGraphImage"> & { openGraphImage: { block?: T } }
      >) & { title: string; canonicalUrl?: string };

export const SeoBlock = <T = PixelImageBlockData,>({
    data: {
        htmlTitle,
        metaDescription,
        openGraphTitle,
        openGraphDescription,
        openGraphImage,
        noIndex,
        canonicalUrl,
        structuredData,
        alternativeLinks,
    },
    title,
    canonicalUrl: passedCanonicalUrl,
    resolveOpenGraphImageUrlTemplate = (block) => (block as PixelImageBlockData).urlTemplate,
}: SeoBlockProps<T>) => {
    const usedHtmlTitle = htmlTitle && htmlTitle != "" ? htmlTitle : title;
    const openGraphImageUrlTemplate = openGraphImage.block && resolveOpenGraphImageUrlTemplate(openGraphImage.block as T);

    return (
        <>
            <Head>
                <title>{usedHtmlTitle}</title>

                {/* Meta*/}
                {metaDescription && <meta name="description" content={metaDescription} />}

                {/* Open Graph */}
                {openGraphTitle && <meta property={"og:title"} content={openGraphTitle} />}
                {openGraphDescription && <meta property={"og:description"} content={openGraphDescription} />}
                <meta property={"og:type"} content={"website"} />
                <meta property={"og:url"} content={canonicalUrl ?? passedCanonicalUrl} />
                {openGraphImageUrlTemplate && (
                    <meta property={"og:image"} content={generateImageUrl({ src: openGraphImageUrlTemplate, width: 1024 }, 1 / 1)} />
                )}

                {/* Structured Data */}
                {structuredData && structuredData.length > 0 && <script type="application/ld+json">{structuredData}</script>}

                {/* No Index */}
                {noIndex && (
                    <>
                        <meta name={"robots"} content={"noindex"} />
                    </>
                )}

                {/* Canonical Url */}
                {(canonicalUrl ?? passedCanonicalUrl) && <link rel="canonical" href={canonicalUrl ?? passedCanonicalUrl} />}

                {/* Alternate Hreflang */}
                {alternativeLinks &&
                    alternativeLinks.length > 0 &&
                    alternativeLinks.map((item) => <link key={item.code} rel="alternate" hrefLang={item.code} href={item.url} />)}
            </Head>
        </>
    );
};
