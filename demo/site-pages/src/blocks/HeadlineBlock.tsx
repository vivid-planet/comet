import { PropsWithData, withPreview } from "@comet/cms-site";
import { HeadlineBlockData } from "@src/blocks.generated";
import * as React from "react";
import { Renderers } from "redraft";

import RichTextBlock from "./RichTextBlock";

const headlineTags: { [key: string]: React.ElementType } = {
    "header-one": "h1",
    "header-two": "h2",
    "header-three": "h3",
    "header-four": "h4",
    "header-five": "h5",
    "header-six": "h6",
};

const getHeadlineRenderers = (level: HeadlineBlockData["level"]) => {
    const HeadlineTag = headlineTags[level];

    const renderers: Renderers = {
        inline: {
            BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
            ITALIC: (children, { key }) => <em key={key}>{children}</em>,
        },
        blocks: {
            unstyled: (children, { keys }) => {
                return children.map((child, index) => <HeadlineTag key={keys[index]}>{child}</HeadlineTag>);
            },
        },
    };

    return renderers;
};

export const HeadlineBlock = withPreview(
    ({ data: { eyebrow, headline, level } }: PropsWithData<HeadlineBlockData>) => {
        return (
            <>
                {eyebrow && <small>{eyebrow}</small>}
                <RichTextBlock data={headline} renderers={getHeadlineRenderers(level)} />
            </>
        );
    },
    { label: "Headline" },
);
