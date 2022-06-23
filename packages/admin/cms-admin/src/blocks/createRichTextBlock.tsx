import { IRteOptions, makeRteApi, Rte } from "@comet/admin-rte";
import { BlockCategory, BlockInterface, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import { convertFromRaw, convertToRaw, EditorState, RawDraftContentState } from "draft-js";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { RichTextBlockData, RichTextBlockInput } from "../blocks.generated";
import { createCmsLinkToolbarButton } from "./rte/extension/CmsLink/createCmsLinkToolbarButton";
import { Decorator as CmsLinkDecorator } from "./rte/extension/CmsLink/Decorator";
import { Decorator as SoftHyphenDecorator } from "./rte/extension/SoftHyphen/Decorator";
import { ToolbarButton as SoftHyphenToolbarButton } from "./rte/extension/SoftHyphen/ToolbarButton";

export interface RichTextBlockState {
    editorState: EditorState;
}

const [, { createEmptyState, createStateFromRawContent, convertStateToRawContent }] = makeRteApi<RawDraftContentState>({
    decorators: [CmsLinkDecorator, SoftHyphenDecorator],
    // @TODO: implement a compound decorator in rte
    // like https://jsfiddle.net/paulyoung85/2unzgt68/
    // https://github.com/facebook/draft-js/issues/542#issuecomment-275996606
    // then LinkDecorator can use a nested SoftHyphenDecorator
    parse: convertFromRaw,
    format: convertToRaw,
});

export function isRichTextEmpty(blockState: RichTextBlockState): boolean {
    return !blockState.editorState.getCurrentContent().hasText();
}
export const isRichTextEqual = (a?: RichTextBlockState, b?: RichTextBlockState): boolean => {
    if (a === b) {
        return true;
    } else if (!a?.editorState || !b?.editorState) {
        return false;
    } else {
        return isEqual(convertStateToRawContent(a.editorState), convertStateToRawContent(b.editorState));
    }
};

// map thru all LINK entities of a RawDraftContentState
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLinkEntitiesData(rawContent: RawDraftContentState, fn: (linkBlock: any) => any) {
    const convertedEntityMap = Object.fromEntries(
        Object.entries(rawContent.entityMap).map(([key, val]) => {
            if (val.type === "LINK") {
                return [
                    key,
                    {
                        ...val,
                        data: fn(val.data),
                    },
                ];
            } else {
                return [key, val];
            }
        }),
    );
    return { ...rawContent, entityMap: convertedEntityMap };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapLinkEntitiesDataAsync(rawContent: RawDraftContentState, fn: (linkBlock: any) => Promise<any>) {
    const convertedEntityMap = await Promise.all(
        Object.entries(rawContent.entityMap).map(async ([key, val]) => {
            if (val.type === "LINK") {
                return [
                    key,
                    {
                        ...val,
                        data: await fn(val.data),
                    },
                ];
            } else {
                return [key, val];
            }
        }),
    );

    return { ...rawContent, entityMap: Object.fromEntries(convertedEntityMap) };
}

export interface RichTextBlockFactoryOptions {
    link: BlockInterface;
    rte?: IRteOptions;
    minHeight?: number;
}

export type RichTextBlock = BlockInterface<RichTextBlockData, RichTextBlockState>;

export const createRichTextBlock = (
    options: RichTextBlockFactoryOptions,
): BlockInterface<RichTextBlockData, RichTextBlockState, RichTextBlockInput> => {
    const CmsLinkToolbarButton = createCmsLinkToolbarButton({ link: options.link });
    const defaultRteOptions: IRteOptions = {
        supports: [
            "bold",
            "italic",
            "sub",
            "sup",
            "header-one",
            "header-two",
            "header-three",
            "header-four",
            "header-five",
            "header-six",
            "strikethrough",
            "ordered-list",
            "unordered-list",
            "history",
            "link",
            "links-remove",
        ],
        draftJsProps: {
            spellCheck: true,
        },
        standardBlockType: "unstyled",

        overwriteLinkButton: CmsLinkToolbarButton,
        customToolbarButtons: [SoftHyphenToolbarButton],
    };
    const LinkBlock = options.link;
    const rteOptions = { ...defaultRteOptions, ...(options.rte ?? {}) };

    const RichTextBlock: BlockInterface<RichTextBlockData, RichTextBlockState> = {
        ...createBlockSkeleton(),

        name: "RichText",

        displayName: <FormattedMessage id="comet.blocks.richtext" defaultMessage="Rich Text" />,

        defaultValues: () => ({ editorState: createEmptyState() }),

        category: BlockCategory.TextAndContent,

        input2State: ({ draftContent }) => {
            return {
                editorState: draftContent
                    ? createStateFromRawContent(
                          mapLinkEntitiesData(draftContent as RawDraftContentState, (linkData) => {
                              // @TODO: bei linkdata ist targetPage noch kein object!
                              // das muss/soll von der Api auch so kommen wie beim linkblock
                              return LinkBlock.input2State(linkData);
                          }),
                      )
                    : createEmptyState(),
            };
        },

        state2Output: ({ editorState }) => {
            const rawContent = convertStateToRawContent(editorState);
            return {
                draftContent: mapLinkEntitiesData(rawContent, (linkState) => LinkBlock.state2Output(linkState)),
            };
        },

        output2State: async ({ draftContent }: { draftContent?: RawDraftContentState }, context) => {
            if (!draftContent) {
                return { editorState: createEmptyState() };
            }

            return {
                editorState: createStateFromRawContent(
                    await mapLinkEntitiesDataAsync(draftContent, (linkData) => LinkBlock.output2State(linkData, context)),
                ),
            };
        },

        createPreviewState: ({ editorState }, previewCtx) => {
            const rawContent = convertStateToRawContent(editorState);
            return {
                draftContent: mapLinkEntitiesData(rawContent, (linkState) => LinkBlock.createPreviewState(linkState, previewCtx)),
                adminMeta: { route: previewCtx.parentUrl },
            };
        },

        AdminComponent: ({ state, updateState }) => {
            return (
                <SelectPreviewComponent>
                    <Rte
                        minHeight={options.minHeight}
                        options={rteOptions}
                        value={state.editorState}
                        onChange={(c: EditorState) => {
                            updateState((prevState) => ({
                                ...prevState,
                                editorState: c,
                            }));
                        }}
                    />
                </SelectPreviewComponent>
            );
        },
        previewContent: (state) => {
            // get first text block
            const content = state.editorState.getCurrentContent();
            const MAX_CHARS = 100;

            return content.hasText() ? [{ type: "text", content: content.getPlainText().slice(0, MAX_CHARS) }] : [];
        },
    };
    return RichTextBlock;
};
