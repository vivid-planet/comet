import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type KeyFactsBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { FadeBoxInOnScroll } from "@src/util/animations/FadeBoxInOnScroll";
import { FadeGroup } from "@src/util/animations/FadeGroup";

import { KeyFactItemBlock } from "./KeyFactItemBlock";
import styles from "./KeyFactsBlock.module.scss";

export const KeyFactsBlock = withPreview(
    ({ data }: PropsWithData<KeyFactsBlockData>) => (
        <FadeGroup disabledBreakpoints={["xs", "sm"]}>
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <div className={styles.itemWrapper} style={{ "--list-item-count": data.blocks.length }}>
                        {data.blocks.map((block, index) => (
                            <FadeBoxInOnScroll key={block.key} delay={100 * index} direction="left">
                                <KeyFactItemBlock data={block.props} />
                            </FadeBoxInOnScroll>
                        ))}
                    </div>
                </div>
            </PageLayout>
        </FadeGroup>
    ),
    { label: "Key facts" },
);
