"use client";
import { ListBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type KeyFactsBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import clsx from "clsx";

import { KeyFactItemBlock } from "./KeyFactItemBlock";
import styles from "./KeyFactsBlock.module.scss";

export const KeyFactsBlock = withPreview(
    ({ data }: PropsWithData<KeyFactsBlockData>) => {
        const itemCount = data.blocks.length;

        return (
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <div className={clsx(styles.itemWrapper, itemCount >= 2 && styles.itemCountMin2, itemCount >= 4 && styles.itemCountMin4)}>
                        <ListBlock data={data} block={(block) => <KeyFactItemBlock data={block} />} />
                    </div>
                </div>
            </PageLayout>
        );
    },
    { label: "Key facts" },
);
