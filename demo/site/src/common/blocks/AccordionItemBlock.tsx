import { BlocksBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
import { AccordionContentBlockData, AccordionItemBlockData } from "@src/blocks.generated";
import clsx from "clsx";
import { useState } from "react";
import { useIntl } from "react-intl";

import { Typography } from "../components/Typography";
import { SvgUse } from "../helpers/SvgUse";
import styles from "./AccordionItemBlock.module.scss";
import { RichTextBlock } from "./RichTextBlock";
import { SpaceBlock } from "./SpaceBlock";
import { StandaloneCallToActionListBlock } from "./StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "./StandaloneHeadingBlock";

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

type AccordionItemBlockProps = PropsWithData<AccordionItemBlockData>;

export const AccordionItemBlock = withPreview(
    ({ data: { title, content, openByDefault } }: AccordionItemBlockProps) => {
        const intl = useIntl();
        const [isExpanded, setIsExpanded] = useState<boolean>(openByDefault);

        const ariaLabelText = isExpanded
            ? intl.formatMessage({ id: "accordionBlock.ariaLabel.expanded", defaultMessage: "Collapse accordion item" })
            : intl.formatMessage({ id: "accordionBlock.ariaLabel.collapsed", defaultMessage: "Expand accordion item" });

        return (
            <>
                <button className={styles.titleWrapper} onClick={() => setIsExpanded(!isExpanded)} aria-label={ariaLabelText}>
                    <Typography variant="h350">{title}</Typography>
                    <div className={styles.iconWrapper}>
                        <SvgUse
                            className={clsx(styles.animatedChevron, isExpanded && styles.animatedChevronExpanded)}
                            href="/assets/icons/chevron-down.svg#chevron-down"
                        />
                    </div>
                </button>
                <div className={styles.contentWrapper} aria-hidden={!isExpanded}>
                    <div className={clsx(styles.contentWrapperInner, isExpanded && styles.contentWrapperInnerExpanded)}>
                        <AccordionContentBlock data={content} />
                    </div>
                </div>
            </>
        );
    },
    { label: "AccordionItem" },
);
