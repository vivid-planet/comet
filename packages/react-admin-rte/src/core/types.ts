import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { DraftBlockRenderConfig, DraftInlineStyleType, Editor, EditorState } from "draft-js";
import { IRteOptions } from "./Rte";

// CoreDraftBlockType (String Literal Type) is not exported https://github.com/DefinitelyTyped/DefinitelyTyped/blob/392fb6935a03c8e6a33943ac00a3bab8a30020c4/types/draft-js/index.d.ts#L368
export type CoreBlockType = "unstyled" | "header-one" | "header-two" | "header-three" | "unordered-list-item" | "ordered-list-item";

export interface ICustomBlockType {
    renderConfig: DraftBlockRenderConfig;
    label: string;
}

export interface ICoreBlockType {
    renderConfig: DraftBlockRenderConfig;
    label?: string;
}

export type CustomBlockTypeMap = Record<string, ICustomBlockType>;

export type CoreBlockTypeMap = Partial<Record<CoreBlockType, ICoreBlockType>>;

export interface IFeatureConfig<T extends CoreBlockType | string = string> {
    name: T;
    label: string;
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    Icon?: (props: SvgIconProps) => JSX.Element;
    tooltipText?: string;
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
