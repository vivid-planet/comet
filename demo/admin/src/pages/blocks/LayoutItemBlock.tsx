import { Field, FinalFormSelect } from "@comet/admin";
import { Hamburger, Image } from "@comet/admin-icons";
import { BlockCategory, BlocksFinalForm, createCompositeBlock, createCompositeSetting } from "@comet/blocks-admin";
import { MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LayoutItemBlockData } from "@src/blocks.generated";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { MediaBlock } from "@src/pages/blocks/MediaBlock";
import { Fragment, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const layoutOptions: Array<{
    value: LayoutItemBlockData["layout"];
    label: ReactNode;
    columns: Array<{ column: number; content: string }>;
    visibleBlocks: string[];
}> = [
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout1" defaultMessage="Layout 1" />,
        value: "layout1",
        columns: [
            { column: 10, content: "Image" },
            { column: 7, content: "Text" },
            { column: 7, content: "Image" },
        ],
        visibleBlocks: ["layout", "media1", "text1", "media2"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout2" defaultMessage="Layout 2" />,
        value: "layout2",
        columns: [
            { column: 7, content: "Text" },
            { column: 10, content: "Image" },
            { column: 7, content: "Text" },
        ],
        visibleBlocks: ["layout", "text1", "media1", "text2"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout3" defaultMessage="Layout 3" />,
        value: "layout3",
        columns: [
            { column: 6, content: "Image" },
            { column: 6, content: "Text" },
            { column: 12, content: "Image" },
        ],
        visibleBlocks: ["layout", "media1", "text1", "media2"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout4" defaultMessage="Layout 4" />,
        value: "layout4",
        columns: [
            { column: 14, content: "Image" },
            { column: 10, content: "Text" },
        ],
        visibleBlocks: ["layout", "media1", "text1"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout5" defaultMessage="Layout 5" />,
        value: "layout5",
        columns: [
            { column: 10, content: "Text" },
            { column: 14, content: "Image" },
        ],
        visibleBlocks: ["layout", "text1", "media1"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout6" defaultMessage="Layout 6" />,
        value: "layout6",
        columns: [
            { column: 12, content: "Image" },
            { column: 12, content: "Text" },
        ],
        visibleBlocks: ["layout", "media1", "text1"],
    },
    {
        label: <FormattedMessage id="layoutItemBlock.layout.layout7" defaultMessage="Layout 7" />,
        value: "layout7",
        columns: [
            { column: 12, content: "Text" },
            { column: 12, content: "Image" },
        ],
        visibleBlocks: ["layout", "text1", "media1"],
    },
];

export const LayoutItemBlock = createCompositeBlock(
    {
        name: "LayoutItem",
        displayName: <FormattedMessage id="layoutItemBlock.displayName" defaultMessage="Layout Item" />,
        visibleOrderedBlocksForState: (state: LayoutItemBlockData) =>
            layoutOptions.find((option) => option.value === state.layout)?.visibleBlocks ?? [],
        blocks: {
            layout: {
                block: createCompositeSetting<LayoutItemBlockData["layout"]>({
                    defaultValue: "layout1",
                    AdminComponent: ({ state, updateState }) => (
                        <BlocksFinalForm<Pick<LayoutItemBlockData, "layout">>
                            onSubmit={({ layout }) => updateState(layout)}
                            initialValues={{ layout: state }}
                        >
                            <Field name="layout" fullWidth>
                                {(props) => (
                                    <FinalFormSelect {...props}>
                                        {layoutOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <ItemWrapper>
                                                    <LayoutWrapper>
                                                        {option.columns.map((column, index) => (
                                                            <ColumnItem key={index} $width={column.column}>
                                                                {column.content === "Image" && <Image />}
                                                                {column.content === "Text" && <Hamburger />}
                                                            </ColumnItem>
                                                        ))}
                                                    </LayoutWrapper>
                                                    <TextWrapper>
                                                        <div>{option.label}</div>
                                                        <LayoutDetailLabel>
                                                            {option.columns.map((column, index) => (
                                                                <Fragment key={index}>
                                                                    {column.column}
                                                                    {index !== option.columns.length - 1 && <>-</>}
                                                                </Fragment>
                                                            ))}
                                                        </LayoutDetailLabel>
                                                    </TextWrapper>
                                                </ItemWrapper>
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>
                        </BlocksFinalForm>
                    ),
                }),
                title: <FormattedMessage id="layoutItemBlock.layout" defaultMessage="Layout" />,
                hiddenInSubroute: true,
            },
            media1: {
                title: <FormattedMessage id="layoutItemBlock.media1" defaultMessage="Media 1" />,
                block: MediaBlock,
            },
            text1: {
                block: RichTextBlock,
                title: <FormattedMessage id="layoutItemBlock.text1" defaultMessage="Text 1" />,
            },
            media2: {
                title: <FormattedMessage id="layoutItemBlock.media2" defaultMessage="Media 2" />,
                block: MediaBlock,
            },
            text2: {
                block: RichTextBlock,
                title: <FormattedMessage id="layoutItemBlock.text2" defaultMessage="Text 2" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.TextAndContent;
        return block;
    },
);

const ItemWrapper = styled("div")`
    display: flex;
    gap: 12px;
`;

const LayoutWrapper = styled("div")`
    display: inline-flex;
    width: 300px;
    gap: 6px;
`;

const ColumnItem = styled("div")<{ $width: number }>`
    background-color: #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 20px;
    width: calc((100% / 24) * ${({ $width }) => $width});
`;

const TextWrapper = styled("div")`
    justify-content: center;
    flex-direction: column;
    display: flex;
    gap: 6px;
`;

const LayoutDetailLabel = styled("div")`
    font-size: 14px;
    opacity: 0.5;
`;
