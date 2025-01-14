"use client";

import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { AccordionContentBlockData, AccordionItemBlockData } from "@src/blocks.generated";
import { createShouldForwardPropBlockList } from "@src/util/createShouldForwardPropBlockList";
import { useState } from "react";
import { useIntl } from "react-intl";

import { Typography } from "../components/Typography";
import { SvgUse } from "../helpers/SvgUse";
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

const AccordionContentBlock = ({ data: { blocks } }: PropsWithData<AccordionContentBlockData>) => {
    return <BlocksBlock data={{ blocks }} supportedBlocks={supportedBlocks} />;
};

//const AccordionContentBlockWithPreview = withPreview(AccordionContentBlock, { label: "Accordion Content" });

type AccordionItemBlockProps = PropsWithData<AccordionItemBlockData>;

export const AccordionItemBlock = ({ data: { title, content, openByDefault } }: AccordionItemBlockProps) => {
    const intl = useIntl();
    const [isExpanded, setIsExpanded] = useState<boolean>(openByDefault);

    const ariaLabelText = isExpanded
        ? intl.formatMessage({ id: "accordionBlock.ariaLabel.expanded", defaultMessage: "Collapse accordion item" })
        : intl.formatMessage({ id: "accordionBlock.ariaLabel.collapsed", defaultMessage: "Expand accordion item" });

    return (
        <>
            <TitleWrapper onClick={() => setIsExpanded(!isExpanded)} aria-label={ariaLabelText}>
                <Typography variant="h350">{title}</Typography>
                <IconWrapper>
                    <AnimatedChevron href="/assets/icons/chevron-down.svg#root" isExpanded={isExpanded} />
                </IconWrapper>
            </TitleWrapper>
            <ContentWrapper aria-hidden={!isExpanded}>
                <ContentWrapperInner isExpanded={isExpanded}>
                    <AccordionContentBlock data={content} />
                </ContentWrapperInner>
            </ContentWrapper>
        </>
    );
};
// export default withPreview(AccordionItemBlock, { label: "AccordionItem" });

const TitleWrapper = styled("button")(({ theme }) => ({
    appearance: "none",
    border: "none",
    backgroundColor: "transparent",
    color: "inherit",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    borderTop: `1px solid ${theme.palette.gray["300"]}`,
    padding: `${theme.spacing.S300} 0`,
}));

const IconWrapper = styled.div`
    display: inline-block;
    width: 32px;
    height: 32px;
    position: relative;
`;

const AnimatedChevron = styled(SvgUse, {
    shouldForwardProp: createShouldForwardPropBlockList(["isExpanded"]),
})<{ isExpanded: boolean }>({
    width: "100%",
    height: "100%",
    variants: [
        {
            props: { isExpanded: true },
            style: {
                transform: "rotate(-180deg)",
            },
        },
        {
            props: { isExpanded: false },
            style: {
                transform: "rotate(0deg)",
            },
        },
    ],
    transition: "transform 0.4s ease",
});

const ContentWrapper = styled.div`
    overflow: hidden;
`;

const ContentWrapperInner = styled("div", {
    shouldForwardProp: createShouldForwardPropBlockList(["isExpanded"]),
})<{ isExpanded: boolean }>(({ theme }) => ({
    marginTop: "-100%",
    paddingBottom: theme.spacing.S300,
    opacity: 0,
    transition: "margin-top 0.8s ease-out 0.3s, opacity 0.3s linear",
    variants: [
        {
            props: { isExpanded: true },
            style: {
                marginTop: 0,
                opacity: 1,
                transition: "margin-top 0.5s ease-out, opacity 0.3s linear 0.4s",
            },
        },
    ],
}));
