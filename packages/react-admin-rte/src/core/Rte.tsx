import { useTheme } from "@material-ui/core";
import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import { DraftEditorCommand, Editor as DraftJsEditor, EditorState, getDefaultKeyBinding, RichUtils } from "draft-js";
import * as React from "react";
import Controls from "./Controls";
import * as sc from "./Rte.sc";
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
    overwriteLinkButton?: ToolbarButtonComponent;
    overwriteLinksRemoveButton?: ToolbarButtonComponent;
    customToolbarButtons?: ToolbarButtonComponent[];
}

export type IOptions = Partial<IRteOptions>;

type OnEditorStateChangeFn = (newValue: EditorState) => void;

export interface IColors {
    border: string;
    toolbarBackground: string;
    buttonIcon: string;
    buttonIconDisabled: string;
    buttonBackgroundHover: string;
    buttonBorderHover: string;
    buttonBorderDisabled: string;
}

export interface IProps {
    value: EditorState;
    onChange: OnEditorStateChangeFn;
    options?: IOptions;
    colors?: IColors;
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
};

export interface IRteRef {
    focus: () => void;
}

const Rte: React.RefForwardingComponent<any, IProps> = (props, ref) => {
    const theme = useTheme();

    const defaultColors: IColors = {
        border: theme.palette.grey[400],
        toolbarBackground: theme.palette.grey[100],
        buttonIcon: theme.palette.grey[600],
        buttonIconDisabled: theme.palette.grey[300],
        buttonBackgroundHover: theme.palette.grey[200],
        buttonBorderHover: theme.palette.grey[400],
        buttonBorderDisabled: theme.palette.grey[100],
    };

    const { value: editorState, onChange, options: passedOptions, colors = defaultColors } = props;
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
        <sc.Root ref={editorWrapperRef} colors={colors}>
            <Controls editorRef={editorRef} editorState={editorState} setEditorState={onChange} options={options} colors={colors} />
            <sc.EditorWrapper>
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
            </sc.EditorWrapper>
        </sc.Root>
    );
};

export default React.forwardRef(Rte);
