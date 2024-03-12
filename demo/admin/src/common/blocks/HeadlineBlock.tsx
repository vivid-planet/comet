import { SelectField } from "@comet/admin";
import { BlockCategory, BlocksFinalForm, createCompositeBlock, createCompositeSetting } from "@comet/blocks-admin";
import { createCompositeBlockTextField } from "@comet/blocks-admin/lib/blocks/helpers/createCompositeBlockTextField";
import { createRichTextBlock } from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
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
                block: createCompositeBlockTextField({
                    fieldProps: { label: "Eyebrow" },
                }),
            },
            headline: {
                block: RichTextBlock,
                title: "Headline",
            },
            level: {
                block: createCompositeSetting<HeadlineBlockData["level"]>({
                    defaultValue: "header-one",
                    AdminComponent: ({ state, updateState }) => (
                        <BlocksFinalForm<Pick<HeadlineBlockData, "level">>
                            onSubmit={({ level }) => updateState(level)}
                            initialValues={{ level: state }}
                        >
                            <SelectField name="level" label="Level" fullWidth>
                                <MenuItem value="header-one">Header One</MenuItem>
                                <MenuItem value="header-two">Header Two</MenuItem>
                                <MenuItem value="header-three">Header Three</MenuItem>
                                <MenuItem value="header-four">Header Four</MenuItem>
                                <MenuItem value="header-five">Header Five</MenuItem>
                                <MenuItem value="header-six">Header Six</MenuItem>
                            </SelectField>
                        </BlocksFinalForm>
                    ),
                }),
            },
        },
    },
    (block) => ({
        ...block,
        category: BlockCategory.TextAndContent,
    }),
);
