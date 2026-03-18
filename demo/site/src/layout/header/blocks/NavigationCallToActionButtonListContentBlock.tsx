"use client";
import { ListBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type NavigationCallToActionButtonListContentBlockData } from "@src/blocks.generated";
import { CallToActionBlock } from "@src/common/blocks/CallToActionBlock";

import styles from "./NavigationCallToActionButtonListContentBlock.module.scss";

type NavigationCallToActionButtonListContentBlockProps = PropsWithData<NavigationCallToActionButtonListContentBlockData>;

export const NavigationCallToActionButtonListContentBlock = withPreview(
    ({ data }: NavigationCallToActionButtonListContentBlockProps) =>
        data.blocks.length > 0 ? (
            <div className={styles.root}>
                <ListBlock data={data} block={(block) => <CallToActionBlock data={block} />} />
            </div>
        ) : null,
    { label: "Navigation Call To Action Button List Content" },
);
