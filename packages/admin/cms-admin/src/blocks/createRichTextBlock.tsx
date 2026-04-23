import { type IRteOptions, makeRteApi, pasteAndFilterText, Rte, stateToHtml } from "@comet/admin-rte";
import {
    BlockMapBuilder,
    convertFromHTML,
    convertFromRaw,
    convertToRaw,
    type DraftDecorator,
    EditorState,
    type EntityInstance,
    Modifier,
    type RawDraftContentState,
} from "draft-js";
import isEqual from "lodash.isequal";
import { FormattedMessage, type MessageDescriptor } from "react-intl";

import type { RichTextBlockData, RichTextBlockInput } from "../blocks.generated";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { createCmsLinkToolbarButton } from "./rte/extension/CmsLink/createCmsLinkToolbarButton";
import { Decorator as CmsLinkDecorator } from "./rte/extension/CmsLink/Decorator";
import { BlockCategory, type BlockInterface, type LinkBlockInterface } from "./types";

export interface RichTextBlockState {
    editorState: EditorState;
}

export interface RichTextBlockEntityOptions {
    block: BlockInterface;
    decorator: DraftDecorator;
    toolbarButton?: NonNullable<IRteOptions["customToolbarButtons"]>[number];
}

const [, defaultStaticFunctions] = makeRteApi<RawDraftContentState>({
    decorators: [CmsLinkDecorator],
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
        return isEqual(
            defaultStaticFunctions.convertStateToRawContent(a.editorState),
            defaultStaticFunctions.convertStateToRawContent(b.editorState),
        );
    }
};

// map thru all registered entities of a RawDraftContentState

function mapEntitiesData(
    rawContent: RawDraftContentState,
    entityBlockMap: Record<string, BlockInterface>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (block: BlockInterface, data: any) => any,
) {
    const convertedEntityMap = Object.fromEntries(
        Object.entries(rawContent.entityMap).map(([key, val]) => {
            const entityBlock = entityBlockMap[val.type];
            if (entityBlock) {
                return [
                    key,
                    {
                        ...val,
                        data: fn(entityBlock, val.data),
                    },
                ];
            } else {
                return [key, val];
            }
        }),
    );
    return { ...rawContent, entityMap: convertedEntityMap };
}

async function mapEntitiesDataAsync(
    rawContent: RawDraftContentState,
    entityBlockMap: Record<string, BlockInterface>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (block: BlockInterface, data: any) => Promise<any>,
) {
    const convertedEntityMap = await Promise.all(
        Object.entries(rawContent.entityMap).map(async ([key, val]) => {
            const entityBlock = entityBlockMap[val.type];
            if (entityBlock) {
                return [
                    key,
                    {
                        ...val,
                        data: await fn(entityBlock, val.data),
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
    link: BlockInterface & LinkBlockInterface;
    entities?: Record<string, RichTextBlockEntityOptions>;
    rte?: IRteOptions;
    minHeight?: number;
    tags?: Array<MessageDescriptor | string>;
}

export type RichTextBlock = BlockInterface<RichTextBlockData, RichTextBlockState>;

export const createRichTextBlock = (
    options: RichTextBlockFactoryOptions,
    override?: (
        block: BlockInterface<RichTextBlockData, RichTextBlockState, RichTextBlockInput>,
    ) => BlockInterface<RichTextBlockData, RichTextBlockState, RichTextBlockInput>,
): BlockInterface<RichTextBlockData, RichTextBlockState, RichTextBlockInput> => {
    const customEntities = options.entities ?? {};

    if ("LINK" in customEntities) {
        throw new Error("'LINK' is a reserved entity type handled by the 'link' option. Use a different key in 'entities'.");
    }

    // Build a combined map of entity type → BlockInterface for all entity types
    const entityBlockMap: Record<string, BlockInterface> = {
        LINK: options.link,
        ...Object.fromEntries(Object.entries(customEntities).map(([type, opts]) => [type, opts.block])),
    };

    // Create RTE API with custom decorators if custom entities are provided
    const hasCustomEntities = Object.keys(customEntities).length > 0;
    const customDecorators = Object.values(customEntities).map((opts) => opts.decorator);

    const { createEmptyState, createStateFromRawContent, convertStateToRawContent } = hasCustomEntities
        ? makeRteApi<RawDraftContentState>({
              decorators: [CmsLinkDecorator, ...customDecorators],
              parse: convertFromRaw,
              format: convertToRaw,
          })[1]
        : defaultStaticFunctions;

    const CmsLinkToolbarButton = createCmsLinkToolbarButton({ link: options.link });

    // Collect custom toolbar buttons from entity options
    const entityToolbarButtons: NonNullable<IRteOptions["customToolbarButtons"]> = Object.values(customEntities)
        .filter(
            (opts): opts is RichTextBlockEntityOptions & { toolbarButton: NonNullable<IRteOptions["customToolbarButtons"]>[number] } =>
                opts.toolbarButton != null,
        )
        .map((opts) => opts.toolbarButton);

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
            "non-breaking-space",
            "soft-hyphen",
        ],
        draftJsProps: {
            spellCheck: true,
        },
        standardBlockType: "unstyled",

        overwriteLinkButton: CmsLinkToolbarButton,
        customToolbarButtons: entityToolbarButtons,
    };
    const LinkBlock = options.link;
    const rteOptions = {
        ...defaultRteOptions,
        ...(options.rte ?? {}),
        customToolbarButtons: [...entityToolbarButtons, ...(options.rte?.customToolbarButtons ?? [])],
    };

    const RichTextBlock: BlockInterface<RichTextBlockData, RichTextBlockState> = {
        ...createBlockSkeleton(),

        name: "RichText",

        displayName: <FormattedMessage id="comet.blocks.richtext" defaultMessage="Rich Text" />,

        defaultValues: () => ({ editorState: createEmptyState() }),

        category: BlockCategory.TextAndContent,

        tags: options.tags,

        input2State: ({ draftContent }) => {
            return {
                editorState: draftContent
                    ? createStateFromRawContent(
                          mapEntitiesData(draftContent as RawDraftContentState, entityBlockMap, (block, data) => {
                              return block.input2State(data);
                          }),
                      )
                    : createEmptyState(),
            };
        },

        state2Output: ({ editorState }) => {
            const rawContent = convertStateToRawContent(editorState);
            return {
                draftContent: mapEntitiesData(rawContent, entityBlockMap, (block, state) => block.state2Output(state)),
            };
        },

        output2State: async ({ draftContent }: { draftContent?: RawDraftContentState }, context) => {
            if (!draftContent) {
                return { editorState: createEmptyState() };
            }

            return {
                editorState: createStateFromRawContent(
                    await mapEntitiesDataAsync(draftContent, entityBlockMap, (block, data) => block.output2State(data, context)),
                ),
            };
        },

        createPreviewState: ({ editorState }, previewCtx) => {
            const rawContent = convertStateToRawContent(editorState);
            return {
                draftContent: mapEntitiesData(rawContent, entityBlockMap, (block, state) => block.createPreviewState(state, previewCtx)),
                adminMeta: { route: previewCtx.parentUrl },
            };
        },

        AdminComponent: ({ state, updateState }) => {
            return (
                <SelectPreviewComponent>
                    <Rte
                        minHeight={options.minHeight}
                        options={{
                            ...rteOptions,
                            draftJsProps: {
                                ...rteOptions.draftJsProps,
                                handlePastedText: (text, html, editorState) => {
                                    const nextEditorState = pasteAndFilterText(html, editorState, rteOptions);

                                    if (nextEditorState) {
                                        // Paste is from one Draft.js instance to another -> update directly
                                        updateState({ editorState: nextEditorState });
                                        return "handled";
                                    }

                                    // Pasted text comes from an external source, e.g. a Word document
                                    if (html !== undefined) {
                                        const { contentBlocks } = convertFromHTML(html);

                                        let nextContent = Modifier.replaceWithFragment(
                                            state.editorState.getCurrentContent(),
                                            state.editorState.getSelection(),
                                            BlockMapBuilder.createFromArray(contentBlocks),
                                        );

                                        const entities = (nextContent.getEntityMap().__getAll() as Immutable.Map<string, EntityInstance>).entries();

                                        // @ts-expect-error Immutable.Map#entries is iterable, but missing [Symbol.iterator]()
                                        for (const [key, entity] of entities) {
                                            if (entity.getType() === "LINK") {
                                                const data = entity.getData();

                                                if (typeof data.url === "string") {
                                                    nextContent = nextContent.replaceEntityData(
                                                        key,
                                                        LinkBlock.url2State?.(data.url) || LinkBlock.defaultValues(),
                                                    );
                                                }
                                            }
                                        }

                                        const newEditorState = EditorState.push(state.editorState, nextContent, "insert-fragment");

                                        updateState({ editorState: newEditorState });
                                        return "handled";
                                    }

                                    return "not-handled";
                                },
                            },
                        }}
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
        previewContent: function (state) {
            // get first text block
            const content = state.editorState.getCurrentContent();
            const MAX_CHARS = 100;

            return content.hasText() ? [{ type: "text", content: content.getPlainText().slice(0, MAX_CHARS) }] : [];
        },
        extractTextContents: function (state) {
            const content = state.editorState.getCurrentContent();
            return content.hasText() ? [stateToHtml({ editorState: state.editorState, options: rteOptions }).html] : [];
        },
    };

    if (override) {
        return override(RichTextBlock);
    }

    return RichTextBlock;
};
