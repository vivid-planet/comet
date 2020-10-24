import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import {
    DraftEditorCommand,
    Editor as DraftJsEditor,
    EditorProps as DraftJsEditorProps,
    EditorState,
    getDefaultKeyBinding,
    RichUtils,
} from "draft-js";
import * as React from "react";
import Controls from "./Controls";
import defaultFilterEditorStateBeforeUpdate from "./filterEditor/default";
import * as sc from "./Rte.sc";
import { ICustomBlockTypeMap, ToolbarButtonComponent } from "./types";
import createBlockRenderMap from "./utils/createBlockRenderMap";

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
    | "history"
    | "link"
    | "links-remove";

export interface IRteOptions {
    supports: SupportedThings[];
    listLevelMax: number;
    customBlockMap?: ICustomBlockTypeMap;
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
}

export type IOptions = Partial<IRteOptions>;

type OnEditorStateChangeFn = (newValue: EditorState) => void;
export type FilterEditorStateBeforeUpdateFn = (newState: EditorState, context: { supports: SupportedThings[]; listLevelMax: number }) => EditorState;
export interface IProps {
    value: EditorState;
    onChange: OnEditorStateChangeFn;
    options?: IOptions;
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
    const { value: editorState, onChange, options: passedOptions } = props;
    const editorRef = React.useRef<DraftJsEditor>(null);
    const editorWrapperRef = React.useRef<HTMLDivElement>(null);
    const options = passedOptions ? { ...defaultOptions, ...passedOptions } : defaultOptions; // merge default options with passed options

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

    const decoratedOnChange = React.useCallback(
        (nextEditorState: EditorState) => {
            if (options.filterEditorStateBeforeUpdate) {
                onChange(options.filterEditorStateBeforeUpdate(nextEditorState, { supports: options.supports, listLevelMax: options.listLevelMax })); // apply filter before onChange
            } else {
                onChange(nextEditorState); // default: undecorated
            }
        },
        [options.filterEditorStateBeforeUpdate, options.supports, options.listLevelMax],
    );

    const blockRenderMap = createBlockRenderMap({ customBlockTypeMap: options.customBlockMap });

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
            <Controls editorRef={editorRef} editorState={editorState} setEditorState={onChange} options={options} />
            <sc.EditorWrapper>
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
