type ChildBlockConfig = {
    name: string;
    type: "block";
    block: string;
};

type ChildTextFieldConfig = {
    name: string;
    type: "textfield";
};

export type CompositeBlockChild = ChildBlockConfig | ChildTextFieldConfig;

export type BlockConfig = {
    name: string;
    type: "composite";
    children: Array<CompositeBlockChild>;
};

// TODO: This should be generated from a the cli-command.
export const exampleBlockConfig: BlockConfig = {
    name: "Highlight Teaser",
    type: "composite",
    children: [
        {
            name: "Title",
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

export const getBlockConfig = () => {
    return exampleBlockConfig;
};
