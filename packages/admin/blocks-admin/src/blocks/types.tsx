import * as React from "react";
import { FormattedMessage } from "react-intl";

export type SetStateFn<S> = (prevState: S) => S;
export type SetStateAction<S> = S | SetStateFn<S>;
export type DispatchSetStateAction<S> = (setStateAction: SetStateAction<S>) => void;
export interface IPreviewContext {
    showVisibleOnly?: boolean;
    parentUrl: string;
}

interface AdminMetaInterface {
    route: string;
}

export interface PreviewStateInterface {
    adminMeta?: AdminMetaInterface;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BlockAdminComponentProps<S = any> {
    state: S;
    updateState: DispatchSetStateAction<S>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockAdminComponent<S = any> = React.ComponentType<BlockAdminComponentProps<S>>;
export type BindBlockAdminComponent<T extends BlockAdminComponent> = T extends React.ComponentType<infer BlockAdminComponentProps>
    ? React.ComponentType<Partial<BlockAdminComponentProps>>
    : never;

export interface AdminComponentPart {
    key: string;
    label: React.ReactNode;
    content: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockContext = any;

export interface PreviewImage {
    src: string;
    width: number;
    height: number;
}

export type PreviewContentImage = { type: "image"; content: PreviewImage };
export function isPreviewContentTextRule(content: PreviewContent): content is PreviewContentText {
    return content.type === "text";
}

export type PreviewContentText = { type: "text"; content: React.ReactNode };

export function isPreviewContentImageRule(content: PreviewContent): content is PreviewContentImage {
    return content.type === "image";
}

export type PreviewContent = PreviewContentImage | PreviewContentText;

export interface BlockMethods<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState = InputApi & PreviewStateInterface,
> {
    defaultValues: () => State;
    input2State: (v: InputApi) => State;
    state2Output: (v: State) => OutputApi;
    output2State: (output: OutputApi, context?: BlockContext) => Promise<State>;
    createPreviewState: (v: State, previewCtx: IPreviewContext & BlockContext) => PreviewState;
    isValid: (state: State) => Promise<boolean> | boolean;
    childBlockCount?: (state: State) => number;
    previewContent: (state: State, context?: BlockContext) => PreviewContent[];
    dynamicDisplayName?: (state: State) => React.ReactNode;
}

export interface AnonymousBlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState extends PreviewStateInterface = InputApi & PreviewStateInterface,
> extends BlockMethods<InputApi, State, OutputApi, PreviewState> {
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
    definesOwnTitle?: boolean;
}

export interface BlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState extends PreviewStateInterface = InputApi & PreviewStateInterface,
> extends AnonymousBlockInterface<InputApi, State, OutputApi, PreviewState> {
    name: string;
    displayName: React.ReactNode;
    category: BlockCategory;
}

export interface RootBlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState extends PreviewStateInterface = InputApi & PreviewStateInterface,
> extends Omit<BlockInterface<InputApi, State, OutputApi, PreviewState>, "AdminComponent" | "Preview"> {
    adminComponentParts: (p: BlockAdminComponentProps<State>) => AdminComponentPart[];
}

// internal helper to extract one of the 3 generic-types from BlockInterface
type ExtractGenericTypesFromBlockInterface<B extends BlockMethods, IDX extends 0 | 1 | 2 = 1> = B extends BlockMethods
    ? B extends BlockMethods<infer InputApi, infer State, infer OutputApi>
        ? [InputApi, State, OutputApi][IDX]
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any;

// public helper to extract InputApi | State | OutputApi from a block-interface or a block-factory
export type BlockState<B extends BlockMethods> = ExtractGenericTypesFromBlockInterface<B, 1>; // State is the 2. generic
export type BlockInputApi<B extends BlockMethods> = ExtractGenericTypesFromBlockInterface<B, 0>; // InputApi is the 1. generic
export type BlockOutputApi<B extends BlockMethods> = ExtractGenericTypesFromBlockInterface<B, 2>; // OutputApi is the 3. generic

export enum BlockCategory {
    TextAndContent = "TextAndContent",
    Media = "Media",
    Navigation = "Navigation",
    Teaser = "Teaser",
    StructuredContent = "StructuredContent",
    Layout = "Layout",
    Form = "Form",
    Other = "Other",
}

export const blockCategoryLabels = {
    [BlockCategory.TextAndContent]: <FormattedMessage id="comet.blocks.category.textAndContent" defaultMessage="Text & Content" />,
    [BlockCategory.Media]: <FormattedMessage id="comet.blocks.category.media" defaultMessage="Media" />,
    [BlockCategory.Navigation]: <FormattedMessage id="comet.blocks.category.navigation" defaultMessage="Navigation" />,
    [BlockCategory.Teaser]: <FormattedMessage id="comet.blocks.category.teaser" defaultMessage="Teaser" />,
    [BlockCategory.StructuredContent]: <FormattedMessage id="comet.blocks.category.structuredContent" defaultMessage="Structured Content" />,
    [BlockCategory.Layout]: <FormattedMessage id="comet.blocks.category.layout" defaultMessage="Layout" />,
    [BlockCategory.Form]: <FormattedMessage id="comet.blocks.category.form" defaultMessage="Form" />,
    [BlockCategory.Other]: <FormattedMessage id="comet.blocks.category.other" defaultMessage="Other" />,
};

export interface LinkBlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
> {
    url2State?: (url: string) => State | false;
}
