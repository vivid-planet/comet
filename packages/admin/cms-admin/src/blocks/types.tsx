import { type ComponentType, type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from "react";
import { FormattedMessage, type MessageDescriptor } from "react-intl";

import { type BlockContext } from "./context/BlockContext";

export interface BlockPreviewContext {
    showVisibleOnly?: boolean;
    parentUrl: string;
    parentUrlSubRoute?: string;
}

interface AdminMetaInterface {
    route: string;
}

export interface BlockPreviewStateInterface {
    adminMeta?: AdminMetaInterface;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BlockAdminComponentProps<S = any> {
    state: S;
    updateState: Dispatch<SetStateAction<S>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockAdminComponent<S = any> = ComponentType<BlockAdminComponentProps<S>>;

export interface BlockAdminComponentPart {
    key: string;
    label: ReactNode;
    content: ReactNode;
}

interface PreviewImage {
    src: string;
    width: number;
    height: number;
}

export type PreviewContentImage = { type: "image"; content: PreviewImage };
export function isPreviewContentTextRule(content: PreviewContent): content is PreviewContentText {
    return content.type === "text";
}

type PreviewContentText = { type: "text"; content: ReactNode };

export function isPreviewContentImageRule(content: PreviewContent): content is PreviewContentImage {
    return content.type === "image";
}

export type PreviewContent = PreviewContentImage | PreviewContentText;

export type BlockDependency = { targetGraphqlObjectType: string; id: string; data?: unknown };

export type ReplaceDependencyObject = { originalId: string; replaceWithId: string | undefined; type: string };

export interface BlockMethods<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PreviewState = any,
> {
    defaultValues: () => State;
    input2State: (v: InputApi) => State;
    state2Output: (v: State) => OutputApi;
    output2State: (output: OutputApi, context: BlockContext) => Promise<State>;
    createPreviewState: (v: State, previewCtx: BlockPreviewContext & BlockContext) => PreviewState;
    isValid: (state: State) => Promise<boolean> | boolean;
    childBlockCount?: (state: State) => number;
    previewContent: (state: State, context: BlockContext) => PreviewContent[];
    dynamicDisplayName?: (state: State) => ReactNode;
    anchors?: (state: State) => string[];
    dependencies?: (state: State) => BlockDependency[];
    replaceDependenciesInOutput: (output: OutputApi, replacements: ReplaceDependencyObject[]) => OutputApi;
    resolveDependencyPath: (state: State, jsonPath: string) => string;
    extractTextContents?: (state: State, options: { includeInvisibleContent: boolean }) => string[];
}

export interface AnonymousBlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState = InputApi & BlockPreviewStateInterface,
> extends BlockMethods<InputApi, State, OutputApi, PreviewState> {
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
    definesOwnTitle?: boolean;
    extractTextContents?: BlockMethods<InputApi, State, OutputApi, PreviewState>["extractTextContents"];
}

export interface BlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState extends BlockPreviewStateInterface = InputApi & BlockPreviewStateInterface,
> extends AnonymousBlockInterface<InputApi, State, OutputApi, PreviewState> {
    name: string;
    displayName: ReactNode;
    category: BlockCategory | CustomBlockCategory;
}

export interface RootBlockInterface<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InputApi = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputApi = any,
    PreviewState extends BlockPreviewStateInterface = InputApi & BlockPreviewStateInterface,
> extends Omit<BlockInterface<InputApi, State, OutputApi, PreviewState>, "AdminComponent" | "Preview"> {
    adminComponentParts: (p: BlockAdminComponentProps<State>) => BlockAdminComponentPart[];
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

export type CustomBlockCategory = { id: string; label: string | ReactElement<MessageDescriptor>; insertBefore?: BlockCategory };

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
