import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import { DraftEditorCommand, Editor as DraftJsEditor, EditorState, getDefaultKeyBinding, RichUtils } from "draft-js";
import * as React from "react";
import Controls from "./Controls";
import { ICustomBlockTypeMap, ToolbarButtonComponent } from "./types";
import createBlockRenderMap from "./utils/createBlockRenderMap";

export type SuportedThings =
    | "bold"
    | "italic"
    | "underline"
    | "sub"
    | "sup"
    | "header-one"
    | "header-two"
    | "header-three"
    | "ordered-list"
    | "unordered-list"
    | "history"
    | "link"
    | "links-remove";

export interface IRteOptions {
    supports: SuportedThings[];
    listLevelMax: number;
    customBlockMap?: ICustomBlockTypeMap;
    splitToolbar: ((rteWidth?: number) => boolean) | boolean;
    overwriteLinkButton?: ToolbarButtonComponent;
    overwriteLinksRemoveButton?: ToolbarButtonComponent;
    customToolbarButtons?: ToolbarButtonComponent[];
}

export type IOptions = Partial<IRteOptions>;

type OnEditorStateChangeFn = (newValue: EditorState) => void;

export interface IProps {
    value: EditorState;
    onChange: OnEditorStateChangeFn;
    options?: IOptions;
}

const DEFAULT_SPLIT_TOOLBAR_BREAKPOINT = 750;

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
    splitToolbar: (rteWidth?: number) => (!rteWidth ? false : rteWidth < DEFAULT_SPLIT_TOOLBAR_BREAKPOINT),
};

export interface IRteRef {
    focus: () => void;
}
const Rte: React.RefForwardingComponent<any, IProps> = (props, ref) => {
    const { value: editorState, onChange, options: passedOptions } = props;
    const editorRef = React.useRef<DraftJsEditor>(null);
    const editorWrapperRef = React.useRef<HTMLDivElement>(null);
    const options = passedOptions ? { ...defaultOptions, ...passedOptions } : defaultOptions; // merge default options with passed options
    const rteWidth = editorWrapperRef && editorWrapperRef.current ? editorWrapperRef.current.getBoundingClientRect().width : undefined; // @TODO: maybe add resize listener on window to get updated rte-width
    const splitToolbar = React.useMemo(() => (typeof options.splitToolbar === "boolean" ? options.splitToolbar : options.splitToolbar(rteWidth)), [
        options.splitToolbar,
        rteWidth,
    ]);

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

    const blockRenderMap = createBlockRenderMap({ customBlockTypeMap: options.customBlockMap });

    function handleKeyCommand(command: DraftEditorCommand) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            onChange(newState);
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

    const styleMap = {
        SUP: {
            verticalAlign: "super",
            fontSize: "smaller",
        },
        SUB: {
            verticalAlign: "sub",
            fontSize: "smaller",
        },
    };

    return (
        <div ref={editorWrapperRef}>
            <Controls editorRef={editorRef} editorState={editorState} setEditorState={onChange} options={options} splitToolbar={splitToolbar} />
            <DraftJsEditor
                ref={editorRef}
                editorState={editorState}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                customStyleMap={styleMap}
                onTab={handleOnTab}
                blockRenderMap={blockRenderMap}
            />
        </div>
    );
};

export default React.forwardRef(Rte);
