import { Field } from "@comet/admin";
import {
    BlockCategory,
    BlocksFinalForm,
    ColumnsBlockLayout,
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createCompositeBlock,
    createCompositeSetting,
    FinalFormLayoutSelect,
} from "@comet/blocks-admin";
import { LayoutBlockData } from "@src/blocks.generated";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { MediaBlock } from "@src/pages/blocks/MediaBlock";
import { FormattedMessage } from "react-intl";

const layoutOptions: ColumnsBlockLayout[] = [
    {
        name: "layout1",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 1" />,
        columns: 3,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={10} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={7} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={7} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout2",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 2" />,
        columns: 3,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={7} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={10} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={7} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout3",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 3" />,
        columns: 3,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={6} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={6} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={12} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout4",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 4" />,
        columns: 2,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={14} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={10} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout5",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 5" />,
        columns: 2,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={10} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={14} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout6",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 6" />,
        columns: 2,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={12} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={12} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "layout7",
        label: <FormattedMessage id="layoutBlock.layout.layout1" defaultMessage="Layout 7" />,
        columns: 2,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewContent width={12} />
                <ColumnsLayoutPreviewSpacing width={1} />
                <ColumnsLayoutPreviewContent width={12} />
            </ColumnsLayoutPreview>
        ),
    },
];

export const LayoutBlock = createCompositeBlock(
    {
        name: "Layout",
        displayName: <FormattedMessage id="layoutBlock.displayName" defaultMessage="Layout" />,
        blocks: {
            layout: {
                block: createCompositeSetting<LayoutBlockData["layout"]>({
                    defaultValue: "layout1",
                    AdminComponent: ({ state, updateState }) => (
                        <BlocksFinalForm<{ layout: ColumnsBlockLayout }>
                            onSubmit={({ layout }) => updateState(layout.name as LayoutBlockData["layout"])}
                            initialValues={{ layout: layoutOptions.find((layout) => layout.name === state) }}
                        >
                            <Field name="layout" component={FinalFormLayoutSelect} layouts={layoutOptions} fullWidth />
                        </BlocksFinalForm>
                    ),
                }),
                title: <FormattedMessage id="layoutBlock.layout" defaultMessage="Layout" />,
            },
            media1: {
                block: MediaBlock,
                title: <FormattedMessage id="layoutBlock.media1" defaultMessage="Media 1" />,
            },
            text1: {
                block: RichTextBlock,
                title: <FormattedMessage id="layoutBlock.text1" defaultMessage="Text 1" />,
            },
            media2: {
                block: MediaBlock,
                title: <FormattedMessage id="layoutBlock.media2" defaultMessage="Media 2" />,
            },
            text2: {
                block: RichTextBlock,
                title: <FormattedMessage id="layoutBlock.text2" defaultMessage="Text 2" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Layout;
        return block;
    },
);
