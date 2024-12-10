import { SwitchField } from "@comet/admin";
import {
    BlockCategory,
    BlocksFinalForm,
    createBlocksBlock,
    createCompositeBlock,
    createCompositeBlockTextField,
    createCompositeSetting,
    SpaceBlock,
} from "@comet/blocks-admin";
import { AccordionItemBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { RichTextBlock } from "./RichTextBlock";
import { StandaloneCallToActionListBlock } from "./StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "./StandaloneHeadingBlock";

const AccordionContentBlock = createBlocksBlock({
    name: "AccordionContent",
    supportedBlocks: {
        richtext: RichTextBlock,
        space: SpaceBlock,
        heading: StandaloneHeadingBlock,
        callToActionList: StandaloneCallToActionListBlock,
    },
});

export const AccordionItemBlock = createCompositeBlock(
    {
        name: "AccordionItem",
        displayName: <FormattedMessage id="accordionBlock.accordionItem.displayName" defaultMessage="Accordion Item" />,
        blocks: {
            title: {
                block: createCompositeBlockTextField({
                    fieldProps: { fullWidth: true, label: <FormattedMessage id="accordionBlock.accordionItem.title" defaultMessage="Title" /> },
                }),
                hiddenInSubroute: true,
            },
            content: {
                block: AccordionContentBlock,
                title: <FormattedMessage id="accordionBlock.accordionItem.content" defaultMessage="Content" />,
            },
            openByDefault: {
                block: createCompositeSetting<AccordionItemBlockData["openByDefault"]>({
                    defaultValue: false,
                    AdminComponent: ({ state, updateState }) => {
                        return (
                            <BlocksFinalForm<{ openByDefault: typeof state }>
                                onSubmit={({ openByDefault }) => updateState(openByDefault)}
                                initialValues={{ openByDefault: state }}
                            >
                                <SwitchField
                                    name="openByDefault"
                                    label={<FormattedMessage id="accordionBlock.accordionItem.openByDefault" defaultMessage="Open by default" />}
                                />
                            </BlocksFinalForm>
                        );
                    },
                }),
                hiddenInSubroute: true,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.TextAndContent;
        block.previewContent = (state) => (state.title !== undefined ? [{ type: "text", content: state.title }] : []);
        return block;
    },
);
