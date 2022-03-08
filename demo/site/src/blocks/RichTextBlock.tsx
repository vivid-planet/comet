import { PreviewSkeleton, PropsWithData, withPreview } from "@comet/site-cms";
import { LinkBlockData, RichTextBlockData } from "@src/blocks.generated";
import { useColorTheme } from "@src/blocks/ColorThemeContext";
import { Typography } from "@src/components/common/Typography";
import * as React from "react";
import redraft, { Renderers } from "redraft";
import styled from "styled-components";

import { LinkBlock } from "./LinkBlock";
import * as sc from "./RichTextBlock.sc";

const GreenCustomHeader: React.FC = ({ children }) => <h3 style={{ color: "green" }}>{children}</h3>;

export const DefaultStyleLink = styled.a`
    color: ${({ theme }) => theme.colors.primary};
`;

/**
 * Define the renderers
 */
const defaultRenderers: Renderers = {
    /**
     * Those callbacks will be called recursively to render a nested structure
     */
    inline: {
        // The key passed here is just an index based on rendering order inside a block
        BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
        ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    },
    /**
     * Blocks receive children and depth
     * Note that children are an array of blocks with same styling,
     */
    blocks: {
        // Paragraph
        unstyled: (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="paragraph250" component="p" disableMargin={false} key={keys[idx]}>
                    {child}
                </Typography>
            )),
        // Headlines
        "header-one": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline600" component="h1" key={keys[idx]}>
                    {child}
                </Typography>
            )),
        "header-two": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline550" component="h2" key={keys[idx]} disableMargin>
                    {child}
                </Typography>
            )),
        "header-three": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline500" component="h3" key={keys[idx]} disableMargin>
                    {child}
                </Typography>
            )),
        "header-four": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline450" component="h4" key={keys[idx]} disableMargin>
                    {child}
                </Typography>
            )),
        "header-five": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline400" component="h5" key={keys[idx]} disableMargin>
                    {child}
                </Typography>
            )),
        "header-six": (children, { keys }) =>
            children.map((child, idx) => (
                <Typography variant="headline350" component="h6" key={keys[idx]} disableMargin>
                    {child}
                </Typography>
            )),
        // List
        // or depth for nested lists
        "unordered-list-item": (children, { depth, keys }) => (
            <sc.UnorderedList key={keys[keys.length - 1]} className={`ul-level-${depth}`}>
                {children.map((child, index) => (
                    <Typography variant="paragraph250" component="li" key={keys[index]}>
                        {child}
                    </Typography>
                ))}
            </sc.UnorderedList>
        ),
        "ordered-list-item": (children, { depth, keys }) => (
            <ol key={keys.join("|")} className={`ol-level-${depth}`}>
                {children.map((child, index) => (
                    <Typography variant="paragraph250" component="li" key={keys[index]}>
                        {child}
                    </Typography>
                ))}
            </ol>
        ),
        "header-custom-green": (children, { keys }) => children.map((child, idx) => <GreenCustomHeader key={keys[idx]}>{child}</GreenCustomHeader>),
    },
    /**
     * Entities receive children and the entity data
     */
    entities: {
        // key is the entity key value from raw
        LINK: (children, data, { key }) => {
            return (
                <LinkBlock key={key} data={data as LinkBlockData}>
                    <DefaultStyleLink>{children}</DefaultStyleLink>
                </LinkBlock>
            );
        },
    },
};

interface RichTextBlockProps extends PropsWithData<RichTextBlockData> {
    renderers?: Renderers;
}

const RichTextBlock: React.FC<RichTextBlockProps> = ({ data: { draftContent }, renderers = defaultRenderers }) => {
    const rendered = redraft(draftContent, renderers);
    const colorTheme = useColorTheme();

    return (
        <PreviewSkeleton title={"RichText"} type={"rows"} hasContent={hasDraftContent(draftContent)}>
            <sc.Wrapper colorTheme={colorTheme}>{rendered}</sc.Wrapper>
        </PreviewSkeleton>
    );
};

export function hasDraftContent(draftContent: RichTextBlockData["draftContent"]): boolean {
    return !(draftContent.blocks.length == 1 && draftContent.blocks[0].text === "");
}
export default withPreview(RichTextBlock, { label: "RichText" });
