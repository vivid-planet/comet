import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlocksFinalForm, createCompositeBlock, createCompositeSetting } from "@comet/blocks-admin";
import { createCompositeBlockSelectField } from "@comet/blocks-admin/lib/blocks/helpers/createCompositeBlockSelectField";
import { createRichTextBlock } from "@comet/cms-admin";
import { HeadlineBlockData } from "@src/blocks.generated";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import * as React from "react";

const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "non-breaking-space"],
        blocktypeMap: {},
    },
    minHeight: 0,
});

export const HeadlineBlock = createCompositeBlock(
    {
        name: "Headline",
        displayName: "Headline",
        blocks: {
            eyebrow: {
                block: createCompositeSetting<HeadlineBlockData["eyebrow"]>({
                    defaultValue: undefined,
                    AdminComponent: ({ state, updateState }) => (
                        <BlocksFinalForm<Pick<HeadlineBlockData, "eyebrow">>
                            onSubmit={({ eyebrow }) => updateState(eyebrow)}
                            initialValues={{ eyebrow: state }}
                        >
                            <Field name="eyebrow" label="Eyebrow" component={FinalFormInput} fullWidth />
                        </BlocksFinalForm>
                    ),
                }),
            },
            headline: {
                block: RichTextBlock,
                title: "Headline",
            },
            level: {
                block: createCompositeBlockSelectField<HeadlineBlockData["level"]>({
                    defaultValue: "header-one",
                    fieldProps: { label: "Level", fullWidth: true },
                    options: [
                        { value: "header-one", label: "Header One" },
                        { value: "header-two", label: "Header Two" },
                        { value: "header-three", label: "Header Three" },
                        { value: "header-four", label: "Header Four" },
                        { value: "header-five", label: "Header Five" },
                        { value: "header-six", label: "Header Six" },
                    ],
                }),
            },
        },
    },
    (block) => ({
        ...block,
        category: BlockCategory.TextAndContent,
    }),
);
