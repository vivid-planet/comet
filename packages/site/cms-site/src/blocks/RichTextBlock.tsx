"use client";
import { RawDraftContentState } from "draft-js";

import { RichTextBlockData } from "../blocks.generated";

function hasRichTextBlockContent(data: RichTextBlockData) {
    const draftContent = data.draftContent as RawDraftContentState;

    return !(draftContent.blocks.length === 1 && draftContent.blocks[0].text === "");
}

export { hasRichTextBlockContent };
