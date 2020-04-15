import { CompositeDecorator, ContentState, convertFromRaw, convertToRaw, DraftDecorator, EditorState, RawDraftContentState } from "draft-js";
import * as React from "react";

import useDebounce from "../useDebounce";
import usePrevious from "../usePrevious";
import { Decorator as LinkDecorator } from "./extension/Link";
export interface IMakeRteApiProps<T = any> {
    decorators?: DraftDecorator[];
    parse?: (v: T) => ContentState;
    format?: (v: ContentState) => T;
}

export type IRteApiProps<T = any> = Partial<IRteApiOptions<T>>;

interface IRteApiOptions<T = any> {
    defaultValue?: T;
    onDebouncedContentChange?: OnDebouncedContentChangeFn<T>;
    debounceDelay: number;
}

export type OnDebouncedContentChangeFn<T = any> = (debouncedEditorState: EditorState, convertStateToRawContent: (e: EditorState) => T) => void;

const defaultRteApiOptions: IRteApiOptions = {
    debounceDelay: 400,
};

function defaultParseContent(v: any): ContentState {
    const rawDraft = JSON.parse(v) as RawDraftContentState;
    return convertFromRaw(rawDraft);
}

function defaultFormatContent(v: ContentState): any {
    return JSON.stringify(convertToRaw(v));
}

function makeRteApi<T = any>(o?: IMakeRteApiProps<T>) {
    const { decorators = [LinkDecorator], parse = defaultParseContent, format = defaultFormatContent }: IMakeRteApiProps<T> = o || {};
    const decorator = new CompositeDecorator(decorators);

    function createEmptyState() {
        return EditorState.createEmpty(decorator);
    }

    function createStateFromRawContent(rawContent: T) {
        return EditorState.createWithContent(parse(rawContent), decorator);
    }

    function convertStateToRawContent(es: EditorState) {
        return format(es.getCurrentContent());
    }

    function useRteApi(passedProps?: IRteApiProps<T>) {
        const options: IRteApiOptions<T> = passedProps ? { ...defaultRteApiOptions, ...passedProps } : defaultRteApiOptions; // merge default options with passed props
        const { defaultValue, onDebouncedContentChange, debounceDelay } = options;

        const [editorState, setEditorState] = React.useState(defaultValue ? createStateFromRawContent(defaultValue) : createEmptyState());

        const debouncedEditorState = useDebounce(editorState, debounceDelay);
        const previousDebouncedContent = usePrevious(debouncedEditorState.getCurrentContent());
        const debouncedContent = debouncedEditorState.getCurrentContent();

        React.useEffect(() => {
            if (onDebouncedContentChange) {
                if (previousDebouncedContent !== debouncedContent) {
                    onDebouncedContentChange(debouncedEditorState, convertStateToRawContent);
                }
            }
        }, [debouncedContent, previousDebouncedContent, debouncedEditorState, onDebouncedContentChange]);

        return {
            createEmptyState,
            createStateFromRawContent,
            convertStateToRawContent,
            editorState,
            setEditorState,
        };
    }
    const api: [typeof useRteApi] = [useRteApi];
    return api;
}

export default makeRteApi;
