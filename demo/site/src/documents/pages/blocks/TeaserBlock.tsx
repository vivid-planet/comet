import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type TeaserBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { FadeBoxInOnScroll } from "@src/util/animations/FadeBoxInOnScroll";
import { FadeGroup } from "@src/util/animations/FadeGroup";

import styles from "./TeaserBlock.module.scss";
import { TeaserItemBlock } from "./TeaserItemBlock";

export const TeaserBlock = withPreview(
    ({ data }: PropsWithData<TeaserBlockData>) => (
        <FadeGroup disabledBreakpoints={["xs", "sm"]}>
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <div className={styles.itemWrapper}>
                        {data.blocks.map((block, index) => (
                            <FadeBoxInOnScroll key={block.key} delay={100 * index} direction="left">
                                <TeaserItemBlock data={block.props} />
                            </FadeBoxInOnScroll>
                        ))}
                    </div>
                </div>
            </PageLayout>
        </FadeGroup>
    ),
    { label: "Teaser" },
);
