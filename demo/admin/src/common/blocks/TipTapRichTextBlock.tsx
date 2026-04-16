import { createTipTapRichTextBlock } from "@comet/cms-admin";
import { type HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

import { LinkBlock } from "./LinkBlock";

export const TipTapRichTextBlock = createTipTapRichTextBlock({
    link: LinkBlock,
    blockStyles: [
        {
            name: "paragraph300",
            label: <FormattedMessage id="tipTapRichTextBlock.paragraph300" defaultMessage="Paragraph" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 18, lineHeight: "26px" }} {...props} />,
        },
        {
            name: "paragraph200",
            label: <FormattedMessage id="tipTapRichTextBlock.paragraph200" defaultMessage="Paragraph Small" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 15, lineHeight: "22px" }} {...props} />,
        },
        {
            name: "eyebrow600",
            label: <FormattedMessage id="tipTapRichTextBlock.eyebrow600" defaultMessage="Eyebrow 600" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 30, lineHeight: "30px" }} {...props} />,
        },
        {
            name: "eyebrow550",
            label: <FormattedMessage id="tipTapRichTextBlock.eyebrow550" defaultMessage="Eyebrow 550" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 26, lineHeight: "26px" }} {...props} />,
        },
        {
            name: "eyebrow500",
            label: <FormattedMessage id="tipTapRichTextBlock.eyebrow500" defaultMessage="Eyebrow 500" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 22, lineHeight: "22px" }} {...props} />,
        },
        {
            name: "eyebrow450",
            label: <FormattedMessage id="tipTapRichTextBlock.eyebrow450" defaultMessage="Eyebrow 450" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 18, lineHeight: "18px" }} {...props} />,
        },
    ],
    inlineStyles: [
        {
            name: "highlight",
            label: <FormattedMessage id="tipTapRichTextBlock.inlineStyle.highlight" defaultMessage="Highlight" />,
        },
        {
            name: "tag",
            label: <FormattedMessage id="tipTapRichTextBlock.inlineStyle.tag" defaultMessage="Tag" />,
        },
    ],
});
