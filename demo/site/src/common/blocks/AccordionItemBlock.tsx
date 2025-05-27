import { BlocksBlock, type PropsWithData, type SupportedBlocks, withPreview } from "@comet/site-nextjs";
import { type AccordionContentBlockData, type AccordionItemBlockData } from "@src/blocks.generated";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { useIntl } from "react-intl";
import styled, { css } from "styled-components";

import { Typography } from "../components/Typography";

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
        const intl = useIntl();

        const ariaLabelText = isExpanded
            ? intl.formatMessage({ id: "accordionBlock.ariaLabel.expanded", defaultMessage: "Collapse accordion item" })
            : intl.formatMessage({ id: "accordionBlock.ariaLabel.collapsed", defaultMessage: "Expand accordion item" });

        return (
            <>
                <TitleWrapper onClick={() => onChange()} aria-label={ariaLabelText}>
                    <Typography variant="h350">{title}</Typography>
                    <IconWrapper>
                        <AnimatedChevron href="/assets/icons/chevron-down.svg#root" $isExpanded={isExpanded} />
                    </IconWrapper>
                </TitleWrapper>
                <ContentWrapper $isExpanded={isExpanded}>
                    <ContentWrapperInner>
                        <AccordionContentBlock data={content} />
                    </ContentWrapperInner>
                </ContentWrapper>
            </>
        );
    },
    { label: "AccordionItem" },
);

const TitleWrapper = styled.button`
    appearance: none;
    border: none;
    background-color: transparent;
    color: inherit;

    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-top: 1px solid ${({ theme }) => theme.palette.gray["300"]};
    padding: ${({ theme }) => theme.spacing.S300} 0;
`;

const IconWrapper = styled.div`
    display: inline-block;
    width: 32px;
    height: 32px;
    position: relative;
`;

const AnimatedChevron = styled(SvgUse)<{ $isExpanded: boolean }>`
    width: 100%;
    height: 100%;
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? "-180deg" : "0deg")});
    transition: transform 0.4s ease;
`;

const ContentWrapper = styled.div<{ $isExpanded: boolean }>`
    position: relative;
    display: grid;
    grid-template-rows: 0fr;
    transition:
        grid-template-rows 0.5s ease-out,
        visibility 0s linear 0.5s;
    visibility: hidden;

    ${({ $isExpanded }) =>
        $isExpanded &&
        css`
            grid-template-rows: 1fr;
            padding-bottom: ${({ theme }) => theme.spacing.S300};
            visibility: visible;
            transition-delay: 0s;
        `}
`;

const ContentWrapperInner = styled.div`
    overflow: hidden;
`;
