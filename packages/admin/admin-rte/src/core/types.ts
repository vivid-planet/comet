import { SvgIconProps } from "@mui/material/SvgIcon";
import { DraftInlineStyleType, Editor, EditorState } from "draft-js";
import { ComponentType, CSSProperties, MouseEvent, ReactNode, RefObject } from "react";

import { IRteOptions, SupportedThings } from "./Rte";

// overwrite draftjs' insufficient type for Draft.DraftBlockRenderConfig
interface DraftBlockRenderConfig {
    element: string | ComponentType;
    wrapper?: ReactNode;
    aliasedElements?: string[];
}

export interface IBlocktypeConfig {
    renderConfig?: DraftBlockRenderConfig; // visual appearance of the blocktype
    label?: string | ReactNode; // displayed in the dropdown
    group?: "dropdown" | "button"; // displays the element in the dropdown or as button
    icon?: (props: SvgIconProps) => JSX.Element | null;
    supportedBy?: SupportedThings; // blocktype is active when this "supported thing" is active
}

export interface IBlocktypeMap {
    [key: string]: IBlocktypeConfig;
}

export interface IFeatureConfig<T extends string = string> {
    name: T;
    label: ReactNode;
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: MouseEvent) => void;
    icon?: (props: SvgIconProps) => JSX.Element | null;
    tooltipText?: ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element | null;
}

type CustomInlineStyleType = "SUP" | "SUB" | string;

export type InlineStyleType = CustomInlineStyleType | DraftInlineStyleType;

export interface IControlProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    options: IRteOptions;
    editorRef: RefObject<Editor>;
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

export interface CustomInlineStyles {
    [name: string]: {
        label: ReactNode;
        icon?: (props: SvgIconProps) => JSX.Element | null;
        tooltipText?: ReactNode;
        style: CSSProperties;
    };
}
