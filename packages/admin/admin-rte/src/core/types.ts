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
    icon?: (props: SvgIconProps) => JSX.Element | null;
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
    icon?: (props: SvgIconProps) => JSX.Element | null;
    tooltipText?: React.ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element | null;
}

type CustomInlineStyleType = "SUP" | "SUB" | string;

export type InlineStyleType = CustomInlineStyleType | DraftInlineStyleType;

export interface IControlProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    options: IRteOptions;
    editorRef: React.RefObject<Editor>;
    disabled?: boolean;
}

export type ToolbarButtonComponent = (props: IControlProps) => JSX.Element;

export type FilterEditorStateFn = (nextState: EditorState) => EditorState;

export interface CustomInlineStyles {
    [name: string]: {
        label: React.ReactNode;
        icon?: (props: SvgIconProps) => JSX.Element | null;
        tooltipText?: React.ReactNode;
        style: React.CSSProperties;
    };
}
