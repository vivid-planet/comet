"use client";
import { hasRichTextBlockContent, type PropsWithData, SvgImageBlock, withPreview } from "@comet/site-nextjs";
import { type KeyFactsItemBlockData } from "@src/blocks.generated";
import { defaultRichTextInlineStyleMap, RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { Typography } from "@src/common/components/Typography";
import { type Renderers } from "redraft";

import styles from "./KeyFactItemBlock.module.scss";

const descriptionRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

export const KeyFactItemBlock = withPreview(
    ({ data: { icon, fact, label, description } }: PropsWithData<KeyFactsItemBlockData>) => (
        <div className={styles.root}>
            {icon.damFile && (
                <div className={styles.icon}>
                    <SvgImageBlock data={icon} width={48} height={48} />
                </div>
            )}
            <Typography className={styles.fact} variant="h500">
                {fact}
            </Typography>
            <Typography variant="h350">{label}</Typography>
            {hasRichTextBlockContent(description) && (
                <Typography className={styles.description} variant="p200">
                    <RichTextBlock data={description} renderers={descriptionRenderers} />
                </Typography>
            )}
        </div>
    ),
    { label: "Key fact" },
);
