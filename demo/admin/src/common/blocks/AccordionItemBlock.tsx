import { SwitchField } from "@comet/admin";
import {
    BlockCategory,
    BlocksFinalForm,
    createBlocksBlock,
    createCompositeBlock,
    createCompositeBlockField,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
} from "@comet/cms-admin";
import { type AccordionItemBlockData } from "@src/blocks.generated";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { FormattedMessage } from "react-intl";

import { StandaloneHeadingBlock } from "./StandaloneHeadingBlock";
import { TextImageBlock } from "./TextImageBlock";

const AccordionContentBlock = createBlocksBlock({
    name: "AccordionContent",
    supportedBlocks: {
        richtext: RichTextBlock,
        space: SpaceBlock,
        heading: StandaloneHeadingBlock,
        callToActionList: StandaloneCallToActionListBlock,
        textImage: TextImageBlock,
    },
});

export const AccordionItemBlock = createCompositeBlock(
    {
        name: "AccordionItem",
        displayName: <FormattedMessage id="accordionBlock.accordionItem.displayName" defaultMessage="Accordion Item" />,
        blocks: {
            title: {
                block: createCompositeBlockTextField({
                    label: <FormattedMessage id="accordionBlock.accordionItem.title" defaultMessage="Title" />,
                }),
                hiddenInSubroute: true,
            },
            htmlTag: {
                block: createCompositeBlockSelectField<AccordionItemBlockData["htmlTag"]>({
                    label: <FormattedMessage id="accordionItem.htmlTag" defaultMessage="HTML tag" />,
                    defaultValue: "h3",
                    options: [
                        { value: "h1", label: <FormattedMessage id="accordionItem.headline1" defaultMessage="Headline 1" /> },
                        { value: "h2", label: <FormattedMessage id="accordionItem.headline2" defaultMessage="Headline 2" /> },
                        { value: "h3", label: <FormattedMessage id="accordionItem.headline3" defaultMessage="Headline 3" /> },
                        { value: "h4", label: <FormattedMessage id="accordionItem.headline4" defaultMessage="Headline 4" /> },
                        { value: "h5", label: <FormattedMessage id="accordionItem.headline5" defaultMessage="Headline 5" /> },
                        { value: "h6", label: <FormattedMessage id="accordionItem.headline6" defaultMessage="Headline 6" /> },
                    ],
                    required: true,
                }),
            },
            content: {
                block: AccordionContentBlock,
                title: <FormattedMessage id="accordionBlock.accordionItem.content" defaultMessage="Content" />,
            },
            openByDefault: {
                block: createCompositeBlockField<AccordionItemBlockData["openByDefault"]>({
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
