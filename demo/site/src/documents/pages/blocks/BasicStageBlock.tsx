"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type BasicStageBlockData } from "@src/blocks.generated";
import { CallToActionListBlock } from "@src/common/blocks/CallToActionListBlock";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { PageLayout } from "@src/layout/PageLayout";
import clsx from "clsx";

import styles from "./BasicStageBlock.module.scss";

const alignmentClassMap: Record<NonNullable<BasicStageBlockData["alignment"]>, string> = {
    left: styles.alignLeft,
    center: styles.alignCenter,
};

export const BasicStageBlock = withPreview(
    ({ data: { media, heading, text, overlay, alignment, callToActionList } }: PropsWithData<BasicStageBlockData>) => (
        <PageLayout className={styles.root}>
            <div className={styles.mediaPhone}>
                <MediaBlock data={media} aspectRatio="1x2" fill />
            </div>
            <div className={styles.mediaTablet}>
                <MediaBlock data={media} aspectRatio="1x1" fill />
            </div>
            <div className={styles.mediaTabletLandscape}>
                <MediaBlock data={media} aspectRatio="3x2" fill />
            </div>
            <div className={styles.mediaDesktop}>
                <MediaBlock data={media} aspectRatio="16x9" fill />
            </div>
            <div className={styles.imageOverlay} style={{ opacity: `${overlay}%` }} />
            <PageLayout grid className={styles.absoluteGridRoot}>
                <div className={clsx(styles.content, alignment && alignmentClassMap[alignment])}>
                    <HeadingBlock data={heading} />
                    <RichTextBlock data={text} />
                    <CallToActionListBlock data={callToActionList} />
                </div>
            </PageLayout>
        </PageLayout>
    ),
    { label: "Stage" },
);
