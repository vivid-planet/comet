import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import { ButtonGroup } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import {
    DefaultDraftBlockRenderMap,
    DraftBlockRenderConfig,
    DraftBlockType,
    DraftEditorCommand,
    DraftInlineStyleType,
    Editor as DraftJsEditor,
    EditorState,
    getDefaultKeyBinding,
    RichUtils,
} from "draft-js";
import * as Immutable from "immutable";
import * as React from "react";

import ContextButtonGroupLists from "./ContextButtonGroupLists";
import { ToolbarButton as LinkToolbarButton } from "./extension/Link";
import getCurrentBlock from "./utils/getCurrentBlock";

type CustomInlineStyleType = "SUP" | "SUB";

type InlineStyleType = CustomInlineStyleType | DraftInlineStyleType;

function supportsInlineStyleType(inlineStyle: InlineStyleType, supportedthings: SuportedThings[]) {
    switch (inlineStyle) {
        case "BOLD":
            return supportedthings.includes("bold");
        case "ITALIC":
            return supportedthings.includes("italic");
        case "UNDERLINE":
            return supportedthings.includes("underline");
        case "SUB":
            return supportedthings.includes("sub");
        case "SUP":
            return supportedthings.includes("sup");
        default:
            return false;
    }
}

function supportsBlockType(blockType: DraftBlockType, supportedthings: SuportedThings[]) {
    switch (blockType) {
        case "unordered-list-item":
            return supportedthings.includes("unordered-list");
        case "ordered-list-item":
            return supportedthings.includes("ordered-list");
        case "header-one":
            return supportedthings.includes("header-one");
        case "header-two":
            return supportedthings.includes("header-two");
        case "header-three":
            return supportedthings.includes("header-three");
        default:
            return false;
    }
}

// Components
function ToolbarIcon({ type, selected }: { type: InlineStyleType | DraftBlockType | "undo" | "redo"; selected?: boolean }) {
    const color = selected ? "primary" : "inherit";

    switch (type) {
        case "BOLD":
            return <FormatBoldIcon color={color} />;
        case "ITALIC":
            return <FormatItalicIcon color={color} />;
        case "UNDERLINE":
            return <FormatUnderlinedIcon color={color} />;
        case "unordered-list-item":
            return <FormatListBulletedIcon color={color} />;
        case "ordered-list-item":
            return <FormatListNumberedIcon color={color} />;
        case "SUB":
            return <ArrowDropDownIcon color={color} />;
        case "SUP":
            return <ArrowDropUpIcon color={color} />;
        case "redo":
            return <RedoIcon color={color} />;
        case "undo":
            return <UndoIcon color={color} />;
        default:
            return <NotListedLocationIcon />;
    }
}

type SuportedThings =
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
    | "link";
interface IRteOptions {
    supports: SuportedThings[];
    listLevelMax: number;
    customBlockMap?: ICustomRenderBlockMap;
}

export type IOptions = Partial<IRteOptions>;

type OnEditorStateChangeFn = (newValue: EditorState) => void;
export interface IProps {
    value: EditorState;
    onChange: OnEditorStateChangeFn;
    options?: IOptions;
    addToolbarButtons?: Array<React.FunctionComponent<{ editorState: EditorState; onChange: OnEditorStateChangeFn }>>;
}

interface ICustomRenderBlock {
    renderConfig: DraftBlockRenderConfig;
    label: string;
}

interface ICustomRenderBlockMap {
    [key: string]: ICustomRenderBlock;
}

type BlockTypeSelectOptions = Array<{ type: DraftBlockType; label: string }>;

const defaultOptions: IRteOptions = {
    supports: ["bold", "italic", "sub", "sup", "header-one", "header-two", "header-three", "ordered-list", "unordered-list", "history", "link"],
    listLevelMax: 4,
};

export interface IRteRef {
    focus: () => void;
}
const Rte: React.RefForwardingComponent<any, IProps> = (props, ref) => {
    const { value: editorState, onChange, options: passedOptions, addToolbarButtons = [] } = props;
    const editorRef = React.useRef<DraftJsEditor>(null);
    const options = passedOptions ? { ...defaultOptions, ...passedOptions } : defaultOptions; // merge default options with passed options

    let customBlockRenderMap = null;
    let customBlockSelectOptions = null;

    if (options.customBlockMap) {
        const customBlockRenderMapObject = Object.entries<ICustomRenderBlock>(options.customBlockMap).reduce<{
            [key: string]: DraftBlockRenderConfig;
        }>((a, [key, config]) => {
            a[key] = config.renderConfig;
            return a;
        }, {});
        customBlockRenderMap = Immutable.Map<DraftBlockType, DraftBlockRenderConfig>(customBlockRenderMapObject);

        customBlockSelectOptions = Object.entries<ICustomRenderBlock>(options.customBlockMap).reduce<BlockTypeSelectOptions>((a, [key, config]) => {
            a.push({
                type: key,
                label: config.label,
            });
            return a;
        }, []);
    }

    const standardBlockTypeSelectOptions: BlockTypeSelectOptions = [
        {
            type: "header-one",
            label: "Header 1",
        },
        {
            type: "header-two",
            label: "Header 2",
        },
        {
            type: "header-three",
            label: "Header 3",
        },
    ];

    const blockRenderMap = customBlockRenderMap ? DefaultDraftBlockRenderMap.merge(customBlockRenderMap) : DefaultDraftBlockRenderMap;

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

    function handleInlineStyleButtonClick(draftInlineStyleType: InlineStyleType, e: React.MouseEvent) {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, draftInlineStyleType));
    }

    function handleBlockTypeButtonClick(blockType: DraftBlockType, e: React.MouseEvent) {
        e.preventDefault();
        onChange(RichUtils.toggleBlockType(editorState, blockType));
    }

    function handleBlockTypeChange(e: React.ChangeEvent<{ value: DraftBlockType }>) {
        e.preventDefault();

        if (!e.target.value) {
            const currentBlock = getCurrentBlock(editorState);
            if (currentBlock) {
                onChange(RichUtils.toggleBlockType(editorState, currentBlock.getType()));
            }
        } else {
            onChange(RichUtils.toggleBlockType(editorState, e.target.value));
        }
        // keeps editor focused
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        }, 0);
    }

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

    function handleUndoClick(e: React.MouseEvent) {
        // nested lists for ol and ul
        e.preventDefault();
        const newEditorState = EditorState.undo(editorState);
        onChange(newEditorState);
    }

    function handleRedoClick(e: React.MouseEvent) {
        // nested lists for ol and ul
        e.preventDefault();
        const newEditorState = EditorState.redo(editorState);
        onChange(newEditorState);
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

    function inlineStyleActive(draftInlineStyleType: InlineStyleType) {
        const currentStyle = editorState.getCurrentInlineStyle();
        return currentStyle.has(draftInlineStyleType);
    }

    function blockTypeActive(blockType: DraftBlockType) {
        const currentBlock = getCurrentBlock(editorState);
        if (!currentBlock) {
            return false;
        }
        return currentBlock.getType() === blockType;
    }

    function canRedo() {
        return !editorState.getRedoStack().isEmpty();
    }

    function canUndo() {
        return !editorState.getUndoStack().isEmpty();
    }

    const inlineStyleButtons: InlineStyleType[] = ["UNDERLINE", "BOLD", "ITALIC", "SUP", "SUB"];
    const blockTypeButtons: DraftBlockType[] = ["unordered-list-item", "ordered-list-item"];
    const standardBlockTypeSelects: DraftBlockType[] = standardBlockTypeSelectOptions.map(c => c.type);
    const customBlockTypeSelects: DraftBlockType[] = customBlockSelectOptions ? customBlockSelectOptions.map(c => c.type) : [];
    const blockTypeSelects = [...standardBlockTypeSelects, ...customBlockTypeSelects];

    const blockTypeSelected = blockTypeSelects.find(c => blockTypeActive(c)) || "unstyled";

    return (
        <div>
            <div>
                {(blockTypeSelects.filter(c => supportsBlockType(c, options.supports)).length > 0 ||
                    (customBlockSelectOptions && customBlockSelectOptions.length > 0)) && (
                    <FormControl>
                        <Select
                            value={blockTypeSelected}
                            displayEmpty
                            onChange={handleBlockTypeChange} // change is handled via mousedown events
                        >
                            <MenuItem value="unstyled">
                                <>P</>
                            </MenuItem>
                            {standardBlockTypeSelectOptions
                                .filter(c => supportsBlockType(c.type, options.supports))
                                .map(c => (
                                    <MenuItem key={c.type} value={c.type}>
                                        {c.label}
                                    </MenuItem>
                                ))}
                            {customBlockSelectOptions &&
                                customBlockSelectOptions.map(c => (
                                    <MenuItem key={c.type} value={c.type}>
                                        {c.label}
                                    </MenuItem>
                                ))}
                        </Select>
                        <FormHelperText>Heading</FormHelperText>
                    </FormControl>
                )}
                <ButtonGroup>
                    {inlineStyleButtons
                        .filter(c => supportsInlineStyleType(c, options.supports))
                        .map(c => (
                            <IconButton
                                key={c}
                                color={inlineStyleActive(c) ? "primary" : "default"}
                                onMouseDown={handleInlineStyleButtonClick.bind(null, c)}
                            >
                                <ToolbarIcon type={c} selected={inlineStyleActive(c)} />
                            </IconButton>
                        ))}
                    {blockTypeButtons
                        .filter(c => supportsBlockType(c, options.supports))
                        .map(c => (
                            <IconButton key={c} onMouseDown={handleBlockTypeButtonClick.bind(null, c)}>
                                <ToolbarIcon type={c} selected={blockTypeActive(c)} />
                            </IconButton>
                        ))}

                    {options.supports.includes("history") && [
                        <IconButton disabled={!canUndo()} color="default" key="undo" onMouseDown={handleUndoClick}>
                            <ToolbarIcon type="undo" />
                        </IconButton>,
                        <IconButton disabled={!canRedo()} color="default" key="redo" onMouseDown={handleRedoClick}>
                            <ToolbarIcon type="redo" />
                        </IconButton>,
                    ]}

                    {options.supports.includes("link") && (
                        <LinkToolbarButton
                            editorState={editorState}
                            onChange={onChange}
                            // onFocusEditor={() => editorRef.current && editorRef.current.focus()}
                        />
                    )}
                    {addToolbarButtons.map((c, i) => c({ editorState, onChange }))}
                </ButtonGroup>
            </div>
            <div>
                <ContextButtonGroupLists editorState={editorState} onChange={onChange} listLevelMax={options.listLevelMax} />
            </div>
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
