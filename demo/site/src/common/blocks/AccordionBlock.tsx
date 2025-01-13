import { ListBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { AccordionBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import styles from "./AccordionBlock.module.scss";
import { AccordionItemBlock } from "./AccordionItemBlock";

type AccordionBlockProps = PropsWithData<AccordionBlockData>;

const AccordionBlock = withPreview(
    ({ data }: AccordionBlockProps) => (
        <div className={styles.root}>
            <ListBlock data={data} block={(block) => <AccordionItemBlock data={block} />} />
        </div>
    ),
    { label: "Accordion" },
);

export const PageContentAccordionBlock = (props: AccordionBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <AccordionBlock {...props} />
        </div>
    </PageLayout>
);
