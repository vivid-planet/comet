import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import {
    DraftBlockType,
    DraftEditorCommand,
    Editor as DraftJsEditor,
    EditorProps as DraftJsEditorProps,
    EditorState,
    getDefaultKeyBinding,
    RichUtils,
} from "draft-js";
import * as React from "react";

import Controls from "./Controls";
import defaultBlocktypeMap, { mergeBlocktypeMaps } from "./defaultBlocktypeMap";
import composeFilterEditorFns from "./filterEditor/composeFilterEditorFns";
import defaultFilterEditorStateBeforeUpdate from "./filterEditor/default";
import manageDefaultBlockType from "./filterEditor/manageStandardBlockType";
import removeBlocksExceedingBlockLimit from "./filterEditor/removeBlocksExceedingBlockLimit";
import * as sc from "./Rte.sc";
import { IBlocktypeMap, ICustomBlockTypeMap_Deprecated, ToolbarButtonComponent } from "./types";
import createBlockRenderMap from "./utils/createBlockRenderMap";

const mandatoryFilterEditorStateFn = composeFilterEditorFns([removeBlocksExceedingBlockLimit, manageDefaultBlockType]);

export type SupportedThings =
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "sub"
    | "sup"
    | "header-one"
    | "header-two"
    | "header-three"
    | "header-four"
    | "header-five"
    | "header-six"
    | "ordered-list"
    | "unordered-list"
    | "blockquote"
    | "history"
    | "link"
    | "links-remove";

export interface IRteOptions {
    supports: SupportedThings[];
    listLevelMax: number;
    blocktypeMap: IBlocktypeMap;
    overwriteLinkButton?: ToolbarButtonComponent;
    overwriteLinksRemoveButton?: ToolbarButtonComponent;
    customToolbarButtons?: ToolbarButtonComponent[];
    draftJsProps: Partial<
        Pick<
            DraftJsEditorProps,
            "placeholder" | "autoComplete" | "autoCorrect" | "readOnly" | "spellCheck" | "stripPastedStyles" | "tabIndex" | "editorKey"
        >
    >;
    filterEditorStateBeforeUpdate?: FilterEditorStateBeforeUpdateFn;
    maxBlocks?: number;
    standardBlockType: DraftBlockType;

    // @deprecated
    customBlockMap?: ICustomBlockTypeMap_Deprecated;
}

export type IOptions = Partial<IRteOptions>;

type OnEditorStateChangeFn = (newValue: EditorState) => void;
export type FilterEditorStateBeforeUpdateFn = (
    newState: EditorState,
    context: Pick<IRteOptions, "supports" | "listLevelMax" | "maxBlocks" | "standardBlockType">,
) => EditorState;
export interface IProps {
    value: EditorState;
    onChange: OnEditorStateChangeFn;
    options?: IOptions;
    disabled?: boolean;
}

const defaultOptions: IRteOptions = {
    supports: [
        "bold",
        "italic",
        "sub",
        "sup",
        "header-one",
        "header-two",
        "header-three",
        "ordered-list",
        "unordered-list",
        "history",
        "link",
        "links-remove",
    ],
    listLevelMax: 4,
    customToolbarButtons: [],
    draftJsProps: {},
    filterEditorStateBeforeUpdate: defaultFilterEditorStateBeforeUpdate,
    maxBlocks: undefined,
    // standardBlockType can be set to any supported block-type,
    // when set to something other than "unstyled" the unstyled-blockType is disabled (does not show up in the Dropdown)
    standardBlockType: "unstyled",
    blocktypeMap: defaultBlocktypeMap,
};

export interface IRteRef {
    focus: () => void;
}

export const styleMap = {
    SUP: {
        verticalAlign: "super",
        fontSize: "smaller",
    },
    SUB: {
        verticalAlign: "sub",
        fontSize: "smaller",
    },
};

const Rte: React.RefForwardingComponent<any, IProps> = (props, ref) => {
    const { value: editorState, onChange, options: passedOptions, disabled } = props;
    const editorRef = React.useRef<DraftJsEditor>(null);
    const editorWrapperRef = React.useRef<HTMLDivElement>(null);

    // merge default options with passed options
    let options = passedOptions ? { ...defaultOptions, ...passedOptions } : defaultOptions;

    // extract deprecated options and handle them specially
    let deprecatedCustomBlockMap: ICustomBlockTypeMap_Deprecated = {};
    if (options.customBlockMap) {
        deprecatedCustomBlockMap = options.customBlockMap;
        delete options.customBlockMap;
    }

    // blocktypes need an extra merge as they have their own merge strategy
    options = {
        ...options,
        blocktypeMap: mergeBlocktypeMaps(defaultBlocktypeMap, deprecatedCustomBlockMap, options.blocktypeMap),
    };

    // force draftjs to be readonly when rte is disabled
    if (disabled) {
        options.draftJsProps = { ...options.draftJsProps, readOnly: true };
    }

    /**
     * Expose methods
     */
    React.useImperativeHandle(ref, () => ({
        focus: () => {
            if (editorRef && editorRef.current) {
                editorRef.current.focus();
            }
        },
    }));

    const { filterEditorStateBeforeUpdate, supports, listLevelMax, maxBlocks, standardBlockType } = options;

    const decoratedOnChange = React.useCallback(
        (nextEditorState: EditorState) => {
            let modifiedState = nextEditorState;
            const context = {
                supports: supports,
                listLevelMax: listLevelMax,
                maxBlocks: maxBlocks,
                standardBlockType: standardBlockType,
            };
            // apply optional filter to editorState
            if (filterEditorStateBeforeUpdate) {
                modifiedState = filterEditorStateBeforeUpdate(modifiedState, context);
            }
            // apply mandatory filter to editorState
            modifiedState = mandatoryFilterEditorStateFn(modifiedState, context);

            // pass the modified filter to original onChange
            onChange(modifiedState);
        },
        [filterEditorStateBeforeUpdate, supports, listLevelMax, maxBlocks, standardBlockType, onChange],
    );

    const blockRenderMap = createBlockRenderMap({ blocktypeMap: options.blocktypeMap });

    function handleKeyCommand(command: DraftEditorCommand) {
        const commandToSupportsMap: Partial<Record<DraftEditorCommand, SupportedThings>> = {
            bold: "bold",
            italic: "italic",
            strikethrough: "strikethrough",
            underline: "underline",
        };

        const relevantSupports = commandToSupportsMap[command];
        if (relevantSupports && options.supports.includes(relevantSupports)) {
            const newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
                onChange(newState);
                return "handled";
            }
        }

        // disallow user to add a new block when block limit is already reached
        if (command === "split-block" && options.maxBlocks) {
            const content = editorState.getCurrentContent();
            const blockSize = content.getBlockMap().count();

            const userTriesToAddTooMuchBlocks = blockSize >= options.maxBlocks;
            if (userTriesToAddTooMuchBlocks) {
                return "handled"; // do nothing
            }
        }
        return "not-handled";
    }

    function handleReturn(e: React.KeyboardEvent, innerEditorState: EditorState) {
        // inserts a newline "\n" on SHIFT+ENTER-key
        if (e.shiftKey) {
            onChange(RichUtils.insertSoftNewline(innerEditorState));
            return "handled";
        }
        return "not-handled";
    }

    function keyBindingFn(e: React.KeyboardEvent) {
        if (e.keyCode === 13 /* ENTER */) {
            //
        }
        return getDefaultKeyBinding(e);
    }

    function handleOnTab(e: React.KeyboardEvent) {
        // nested lists for ol and ul
        e.preventDefault();
        const newEditorState = RichUtils.onTab(e, editorState, options.listLevelMax /* maxDepth */);
        if (newEditorState !== editorState) {
            onChange(newEditorState);
        }
    }

    return (
        <sc.Root ref={editorWrapperRef}>
            <Controls editorRef={editorRef} editorState={editorState} setEditorState={onChange} options={options} disabled={disabled} />
            <sc.EditorWrapper disabled={disabled}>
                <DraftJsEditor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={decoratedOnChange}
                    handleKeyCommand={handleKeyCommand}
                    handleReturn={handleReturn}
                    keyBindingFn={keyBindingFn}
                    customStyleMap={styleMap}
                    onTab={handleOnTab}
                    blockRenderMap={blockRenderMap}
                    {...options.draftJsProps}
                />
            </sc.EditorWrapper>
        </sc.Root>
    );
};

export default React.forwardRef(Rte);
