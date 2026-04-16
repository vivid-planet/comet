import { createTipTapRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./link.block";

export const TipTapRichTextBlock = createTipTapRichTextBlock({
    link: LinkBlock,
    blockStyles: [
        { name: "paragraph300", appliesTo: ["paragraph"] },
        { name: "paragraph200", appliesTo: ["paragraph"] },
        { name: "eyebrow600", appliesTo: ["paragraph"] },
        { name: "eyebrow550", appliesTo: ["paragraph"] },
        { name: "eyebrow500", appliesTo: ["paragraph"] },
        { name: "eyebrow450", appliesTo: ["paragraph"] },
        { name: "list300", appliesTo: ["ordered-list", "unordered-list"] },
        { name: "list200", appliesTo: ["ordered-list", "unordered-list"] },
    ],
});
