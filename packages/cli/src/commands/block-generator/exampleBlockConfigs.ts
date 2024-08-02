import { BlockConfig } from "./getBlockConfig";

export const exampleTeaserBlockConfig: BlockConfig = {
    name: "Example Teaser",
    type: "composite",
    children: [
        {
            name: "Headline",
            type: "textfield",
        },
        {
            name: "Description",
            type: "block",
            block: "RichTextBlock",
        },
        {
            name: "Image",
            type: "block",
            block: "DamImageBlock",
        },
    ],
};
