"use client";
import { BlocksBlock, type PropsWithData, type SupportedBlocks, withPreview } from "@comet/site-nextjs";
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

const supportedBlocks: SupportedBlocks = {
    richtext: (props) => <RichTextBlock data={props} />,
    heading: (props) => <StandaloneHeadingBlock data={props} />,
    space: (props) => <SpaceBlock data={props} />,
    callToActionList: (props) => <StandaloneCallToActionListBlock data={props} />,
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
    ({ data: { title, content }, isExpanded, onChange }: AccordionItemBlockProps) => {
        const headlineId = useId();
        const contentId = useId();

        return (
            <>
                <button
                    className={styles.titleWrapper}
                    id={headlineId}
                    onClick={onChange}
                    aria-label={title}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                >
                    <Typography variant="h350">{title}</Typography>
                    <div className={styles.iconWrapper}>
                        <SvgUse href="/assets/icons/chevron-down.svg#root" className={clsx(styles.animatedChevron, isExpanded && styles.expanded)} />
                    </div>
                </button>
                <div className={clsx(styles.contentWrapper, isExpanded && styles.expanded)} id={contentId} role="region" aria-labelledby={headlineId}>
                    <div className={styles.contentWrapperInner}>
                        <AccordionContentBlock data={content} />
                    </div>
                </div>
            </>
        );
    },
    { label: "AccordionItem" },
);
