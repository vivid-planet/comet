import { generateImageUrl, PropsWithData } from "@comet/cms-site";
import { SeoBlockData } from "@src/blocks.generated";
import Head from "next/head";
import * as React from "react";

interface SeoBlockProps extends PropsWithData<SeoBlockData> {
    title: string;
    canonicalUrl: string;
}
const SeoBlock: React.FunctionComponent<SeoBlockProps> = ({
    data: { htmlTitle, metaDescription, openGraphTitle, openGraphDescription, openGraphImage, noIndex },
    title,
    canonicalUrl,
}) => {
    const usedHtmlTitle = htmlTitle && htmlTitle != "" ? htmlTitle : title;
    return (
        <>
            <Head>
                {/* TODO: Title und HTML Title sollten wir noch genauer klären */}
                <title>{usedHtmlTitle}</title>

                {/* Meta*/}
                {metaDescription && <meta name="description" content={metaDescription} />}
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                {openGraphTitle && <meta property={"og:title"} content={openGraphTitle} />}
                {openGraphDescription && <meta property={"og:description"} content={openGraphDescription} />}
                <meta property={"og:type"} content={"website"} />
                <meta property={"og:url"} content={canonicalUrl} />
                {openGraphImage.block?.urlTemplate && (
                    <meta property={"og:image"} content={generateImageUrl({ src: openGraphImage.block.urlTemplate, width: 1024 }, 1 / 1)} />
                )}

                {/* No Index */}
                {noIndex && (
                    <>
                        <meta name={"robots"} content={"noindex"} />
                    </>
                )}
            </Head>
        </>
    );
};

export default SeoBlock;
