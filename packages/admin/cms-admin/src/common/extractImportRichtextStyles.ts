import { RawDraftContentBlock, RawDraftInlineStyleRange } from "draft-js";

export const extractRichtextStyles = (block: RawDraftContentBlock): string => {
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

    for (let i = 0; i < block.text.length + 1; i++) {
        const startTags = combinedSettings.filter((setting) => setting.start === i);
        const endTags = combinedSettings.filter((setting) => setting.end === i);

        text += `${endTags.map((tag) => (tag.type === "inlineStyle" ? "</i>" : "</e>"))}${startTags.map((tag) =>
            tag.type === "inlineStyle" ? "<i>" : "<e>",
        )}${block.text[i] ?? ""}`;
    }

    return text;
};

export const importRichtextStyles = (block: RawDraftContentBlock): RawDraftContentBlock => {
    const onlyInlineStyleTags = block.text.replace(/<e>|<\/e>/g, "");
    const onlyEntityRangeTags = block.text.replace(/<i>|<\/i>/g, "");

    let replacedInlineStyleText = onlyInlineStyleTags;
    let replacedEntityRangeText = onlyEntityRangeTags;

    const newInlineStyleRanges: Array<RawDraftInlineStyleRange> = [];

    block.inlineStyleRanges.forEach((inlineStyleRange, index) => {
        // this handles inlineStyleRanges with identical ranges
        if (
            index > 0 &&
            inlineStyleRange.offset === block.inlineStyleRanges[index - 1].offset &&
            inlineStyleRange.length === block.inlineStyleRanges[index - 1].length
        ) {
            newInlineStyleRanges.push({
                ...inlineStyleRange,
                offset: newInlineStyleRanges[index - 1].offset,
                length: newInlineStyleRanges[index - 1].length,
            });

            return;
        }
        const firstOpeningTag = replacedInlineStyleText.search(/<i>/);
        const firstEndingTag = replacedInlineStyleText.search(/<\/i>/);

        replacedInlineStyleText = replacedInlineStyleText.replace(/<i>/, "").replace(/<\/i>/, "");

        newInlineStyleRanges.push({ ...inlineStyleRange, offset: firstOpeningTag, length: firstEndingTag - firstOpeningTag - 3 });
    });

    const newEntityRanges = block.entityRanges.map((inlineStyleRange) => {
        const firstOpeningTag = replacedEntityRangeText.search(/<e>/);
        const firstEndingTag = replacedEntityRangeText.search(/<\/e>/);

        replacedEntityRangeText = replacedEntityRangeText.replace(/<e>/, "").replace(/<\/e>/, "");

        return { ...inlineStyleRange, offset: firstOpeningTag, length: firstEndingTag - firstOpeningTag - 3 };
    });

    return { ...block, text: block.text.replace(/<i>|<\/i>|<e>|<\/e>/g, ""), inlineStyleRanges: newInlineStyleRanges, entityRanges: newEntityRanges };
};
