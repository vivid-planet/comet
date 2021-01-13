import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { DraftBlockRenderConfig, DraftInlineStyleType, Editor, EditorState } from "draft-js";

import { IRteOptions } from "./Rte";

export interface ICustomBlockType {
    renderConfig: DraftBlockRenderConfig;
    label: string;
}

export interface ICustomBlockTypeMap {
    [key: string]: ICustomBlockType;
}

export interface IFeatureConfig<T extends string = string> {
    name: T;
    label: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    Icon?: (props: SvgIconProps) => JSX.Element;
    tooltipText?: React.ReactNode;
}

type CustomInlineStyleType = "SUP" | "SUB";

export type InlineStyleType = CustomInlineStyleType | DraftInlineStyleType;

export interface IControlProps {
    editorState: EditorState;
    setEditorState: (s: EditorState) => void;
    options: IRteOptions;
    editorRef: React.RefObject<Editor>;
}

export type ToolbarButtonComponent = (props: IControlProps) => JSX.Element;

export type FilterEditorStateFn = (nextState: EditorState) => EditorState;
