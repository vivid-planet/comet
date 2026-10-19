import type { TipTapResolvedOptions } from "./createTipTapRichTextBlock";
import type { TipTapResolvedList, TipTapResolvedStyledNode, TipTapTextBlockTag } from "./textBlocks";

interface TipTapStyledNodeContentConfig {
    styles: string[];
    defaultStyle: string | null;
}

/**
 * What content a TipTap rich text block accepts, exposed in the block meta so consumers that produce
 * content outside the editor (e.g. AI agents) can stick to it. Content outside of it fails validation.
 */
export interface TipTapRichTextBlockContentConfig {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    sub: boolean;
    sup: boolean;
    nonBreakingSpace: boolean;
    softHyphen: boolean;
    textBlocks: Array<{ name: string; tag: TipTapTextBlockTag } & TipTapStyledNodeContentConfig>;
    defaultTextBlock: string;
    orderedList: false | TipTapStyledNodeContentConfig;
    unorderedList: false | TipTapStyledNodeContentConfig;
    inlineStyles: Array<{ name: string; appliesTo: string[] | null }>;
    placeholders: string[];
    /**
     * Whether a child block is stored as a `cmsBlock` or a `cmsInlineBlock` node, keyed like the
     * field's `childBlocks`.
     */
    childBlockDisplays: Record<string, "block" | "inline">;
    maxTextBlocks: number | null;
    listLevelMax: number | null;
}

function toStyledNodeContentConfig({ styles, defaultStyle }: TipTapResolvedStyledNode): TipTapStyledNodeContentConfig {
    return { styles: styles.map((style) => style.name), defaultStyle };
}

function toListContentConfig(list: false | TipTapResolvedList): false | TipTapStyledNodeContentConfig {
    return list && toStyledNodeContentConfig(list);
}

export function buildContentConfig({
    resolvedOptions,
    inlineStyles,
    placeholders,
    childBlocks,
    maxTextBlocks,
    listLevelMax,
}: {
    resolvedOptions: TipTapResolvedOptions;
    inlineStyles: Array<{ name: string; appliesTo?: string[] }>;
    placeholders: Array<{ name: string }>;
    childBlocks: Record<string, { display: "block" | "inline" }>;
    maxTextBlocks?: number;
    listLevelMax?: number;
}): TipTapRichTextBlockContentConfig {
    return {
        bold: resolvedOptions.bold,
        italic: resolvedOptions.italic,
        underline: resolvedOptions.underline,
        strike: resolvedOptions.strike,
        sub: resolvedOptions.sub,
        sup: resolvedOptions.sup,
        nonBreakingSpace: resolvedOptions.nonBreakingSpace,
        softHyphen: resolvedOptions.softHyphen,
        textBlocks: resolvedOptions.textBlocks.map((textBlock) => ({
            name: textBlock.name,
            tag: textBlock.tag,
            ...toStyledNodeContentConfig(textBlock),
        })),
        defaultTextBlock: resolvedOptions.defaultTextBlock.name,
        orderedList: toListContentConfig(resolvedOptions.orderedList),
        unorderedList: toListContentConfig(resolvedOptions.unorderedList),
        inlineStyles: inlineStyles.map(({ name, appliesTo }) => ({ name, appliesTo: appliesTo ?? null })),
        placeholders: placeholders.map(({ name }) => name),
        childBlockDisplays: Object.fromEntries(Object.entries(childBlocks).map(([key, { display }]) => [key, display])),
        maxTextBlocks: maxTextBlocks ?? null,
        listLevelMax: listLevelMax ?? null,
    };
}
