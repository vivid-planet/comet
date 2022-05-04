import { Field, FinalFormInput, FinalFormSelect } from "@comet/admin";
import { BlockCategory, BlocksFinalForm, createCompositeBlock, createCompositeSetting } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
import { HeadlineBlockData } from "@src/blocks.generated";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import * as React from "react";

const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic"],
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
                block: createCompositeSetting<HeadlineBlockData["level"]>({
                    defaultValue: "header-one",
                    AdminComponent: ({ state, updateState }) => (
                        <BlocksFinalForm<Pick<HeadlineBlockData, "level">>
                            onSubmit={({ level }) => updateState(level)}
                            initialValues={{ level: state }}
                        >
                            <Field name="level" label="Level" fullWidth>
                                {(props) => (
                                    <FinalFormSelect {...props}>
                                        <MenuItem value="header-one">Header One</MenuItem>
                                        <MenuItem value="header-two">Header Two</MenuItem>
                                        <MenuItem value="header-three">Header Three</MenuItem>
                                        <MenuItem value="header-four">Header Four</MenuItem>
                                        <MenuItem value="header-five">Header Five</MenuItem>
                                        <MenuItem value="header-six">Header Six</MenuItem>
                                    </FinalFormSelect>
                                )}
                            </Field>
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
