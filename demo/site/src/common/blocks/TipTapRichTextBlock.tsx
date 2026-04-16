"use client";
import { PreviewSkeleton, type PropsWithData, TipTapRichTextBlockRenderer, withPreview } from "@comet/site-nextjs";
import { type TipTapRichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { Typography } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

const headingVariantMap: Record<number, string> = {
    1: "headline600",
    2: "headline550",
    3: "headline500",
    4: "headline450",
    5: "headline400",
    6: "headline350",
};

function hasContent(data: TipTapRichTextBlockData): boolean {
    const html = data.tipTapContent as string;
    if (!html || typeof html !== "string") {
        return false;
    }
    // Check if there's any text content beyond empty paragraph tags
    const textContent = html.replace(/<[^>]*>/g, "").trim();
    return textContent.length > 0;
}

export const TipTapRichTextBlock = withPreview(
    ({ data }: PropsWithData<TipTapRichTextBlockData>) => {
        const html = data.tipTapContent as string;

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasContent(data)}>
                <TipTapRichTextBlockRenderer
                    html={html}
                    renderers={{
                        paragraph: ({ className, children }) => (
                            <Typography
                                variant={(className as Parameters<typeof Typography>[0]["variant"]) ?? undefined}
                                bottomSpacing
                                className={styles.text}
                            >
                                {children}
                            </Typography>
                        ),
                        heading: ({ level, className, children }) => (
                            <Typography
                                variant={((className ?? headingVariantMap[level]) as Parameters<typeof Typography>[0]["variant"]) ?? undefined}
                                bottomSpacing
                                className={styles.text}
                            >
                                {children}
                            </Typography>
                        ),
                        listItem: ({ children }) => (
                            <Typography as="li" className={styles.text}>
                                {children}
                            </Typography>
                        ),
                        link: ({ data: linkData, children }) =>
                            isValidLink(linkData) ? (
                                <LinkBlock data={linkData} className={styles.inlineLink}>
                                    {children}
                                </LinkBlock>
                            ) : (
                                <>{children}</>
                            ),
                    }}
                />
            </PreviewSkeleton>
        );
    },
    { label: "TipTap Rich Text" },
);

export const PageContentTipTapRichTextBlock = (props: PropsWithData<TipTapRichTextBlockData>) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <TipTapRichTextBlock {...props} />
        </div>
    </PageLayout>
);
