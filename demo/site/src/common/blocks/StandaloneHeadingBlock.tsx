"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type StandaloneHeadingBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import clsx from "clsx";

import { HeadingBlock } from "./HeadingBlock";
import styles from "./StandaloneHeadingBlock.module.scss";

type StandaloneHeadingBlockProps = PropsWithData<StandaloneHeadingBlockData>;

const alignmentClassMap: Record<NonNullable<StandaloneHeadingBlockData["textAlignment"]>, string> = {
    left: styles.alignLeft,
    center: styles.alignCenter,
};

export const StandaloneHeadingBlock = withPreview(
    ({ data: { heading, textAlignment } }: StandaloneHeadingBlockProps) => {
        return (
            <div className={clsx(styles.root, textAlignment && alignmentClassMap[textAlignment])}>
                <HeadingBlock data={heading} />
            </div>
        );
    },
    { label: "Heading" },
);

export const PageContentStandaloneHeadingBlock = (props: StandaloneHeadingBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <StandaloneHeadingBlock {...props} />
        </div>
    </PageLayout>
);
