import { SvgIconProps } from "@mui/material/SvgIcon";
import { DraftInlineStyleType, Editor, EditorState } from "draft-js";
import * as React from "react";

import { IRteOptions, SupportedThings } from "./Rte";

// overwrite draftjs' insufficient type for Draft.DraftBlockRenderConfig
interface DraftBlockRenderConfig {
    element: string | React.ComponentType;
    wrapper?: React.ReactNode;
    aliasedElements?: string[];
}

export interface IBlocktypeConfig {
    renderConfig?: DraftBlockRenderConfig; // visual appearance of the blocktype
    label?: string | React.ReactNode; // displayed in the dropdown
    group?: "dropdown" | "button"; // displays the element in the dropdown or as button
    icon?: (props: SvgIconProps) => JSX.Element;
    supportedBy?: SupportedThings; // blocktype is active when this "supported thing" is active
}

export interface IBlocktypeMap {
    [key: string]: IBlocktypeConfig;
}

export interface IFeatureConfig<T extends string = string> {
    name: T;
    label: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    icon?: (props: SvgIconProps) => JSX.Element;
    tooltipText?: React.ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element;
}

type CustomInlineStyleType = "SUP" | "SUB";

export type InlineStyleType = CustomInlineStyleType | DraftInlineStyleType;

export interface IControlProps {
    editorState: EditorState;
    setEditorState: (s: EditorState) => void;
    options: IRteOptions;
    editorRef: React.RefObject<Editor>;
    disabled?: boolean;
}

export type ToolbarButtonComponent = (props: IControlProps) => JSX.Element;

export type FilterEditorStateFn = (nextState: EditorState) => EditorState;

/**
 * @deprecated use IBlocktypeConfig instead
 */
interface ICustomBlockType_Deprecated {
    renderConfig: DraftBlockRenderConfig;
    label: string;
}

/**
 * @deprecated use IBlocktypeMap instead
 */
export interface ICustomBlockTypeMap_Deprecated {
    [key: string]: ICustomBlockType_Deprecated;
}
