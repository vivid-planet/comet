import { BlocksBlock, type PropsWithData, type SupportedBlocks, withPreview } from "@comet/site-react";
import { type AccordionContentBlockData, type AccordionItemBlockData } from "@src/blocks.generated";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { useId } from "react";

import { Typography } from "../components/Typography";
import styles from "./AccordionItemBlock.module.scss";
import { TextImageBlock } from "./TextImageBlock";

const supportedBlocks: SupportedBlocks = {
    richtext: (props) => <RichTextBlock data={props} />,
    heading: (props) => <StandaloneHeadingBlock data={props} />,
    space: (props) => <SpaceBlock data={props} />,
    callToActionList: (props) => <StandaloneCallToActionListBlock data={props} />,
    textImage: (props) => <TextImageBlock data={props} />,
};

const AccordionContentBlock = withPreview(
    ({ data: { blocks } }: PropsWithData<AccordionContentBlockData>) => {
        return <BlocksBlock data={{ blocks }} supportedBlocks={supportedBlocks} />;
    },
    { label: "Accordion Content" },
);

type AccordionItemBlockProps = PropsWithData<AccordionItemBlockData> & {
    isExpanded: boolean;
    onChange: () => void;
};

export const AccordionItemBlock = withPreview(
    ({ data: { title, content, titleHtmlTag }, isExpanded, onChange }: AccordionItemBlockProps) => {
        const headlineId = useId();
        const contentId = useId();

        return (
            <>
                <button id={headlineId} onClick={onChange} aria-expanded={isExpanded} aria-controls={contentId} className={styles.titleWrapper}>
                    <Typography variant="h350" as={titleHtmlTag}>
                        {title}
                    </Typography>
                    <SvgUse
                        href="/assets/icons/chevron-down.svg#root"
                        className={clsx(styles.animatedChevron, isExpanded && styles.animatedChevronExpanded)}
                    />
                </button>
                <section
                    id={contentId}
                    aria-labelledby={headlineId}
                    className={clsx(styles.contentWrapper, isExpanded && styles.contentWrapperExpanded)}
                >
                    <div className={styles.contentWrapperInner}>
                        <AccordionContentBlock data={content} />
                    </div>
                </section>
            </>
        );
    },
    { label: "AccordionItem" },
);
