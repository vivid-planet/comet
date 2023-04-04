import { RawDraftContentBlock } from "draft-js";

const extractInlineStyles = (block: RawDraftContentBlock): string => {
    let text = "";

    // As multiple inline styles with same offset and length are possible, items with same offset and length are removed
    const filteredInlineStyles = block.inlineStyleRanges
        .map((inlineStyle) => ({ start: inlineStyle.offset, end: inlineStyle.offset + inlineStyle.length, type: "inlineStyle" }))
        .reduce((previous: { start: number; end: number; type: string }[], current) => {
            if (!previous.some((style: { start: number; end: number }) => style.start === current.start && style.end === current.end)) {
                previous.push(current);
            }
            return previous;
        }, []);

    const combinedSettings = [
        ...filteredInlineStyles,
        ...block.entityRanges.map((entityRange) => ({
            start: entityRange.offset,
            end: entityRange.offset + entityRange.length,
            type: "entityRange",
        })),
    ];

    for (let i = 0; i < block.text.length; i++) {
        const startTags = combinedSettings.filter((setting) => setting.start === i);
        const endTags = combinedSettings.filter((setting) => setting.end === i);

        text += `${endTags.map((tag) => (tag.type === "inlineStyle" ? "</i>" : "</e>"))}${startTags.map((tag) =>
            tag.type === "inlineStyle" ? "<i>" : "<e>",
        )}${block.text[i]}`;
    }

    return text;
};

export default extractInlineStyles;
