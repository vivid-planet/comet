import { storiesOf } from "@storybook/react";
import { IMakeRteApiProps, IRteApiProps, IRteOptions, IRteRef, LinkDecorator, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import { convertFromRaw, convertToRaw } from "draft-js";
import * as React from "react";
import { exampleContent, PrintEditorState, RteLayout, useAutoFocus } from "./helper";

type StringifiedRawDraftContentState = string;

export type ContentFormat = StringifiedRawDraftContentState;

export const defaultContent: ContentFormat = JSON.stringify(exampleContent);

export const makeApiOptions: IMakeRteApiProps<ContentFormat> = {
    decorators: [LinkDecorator], // define additional Draft decorators, https://draftjs.org/docs/advanced-topics-decorators/
    parse: v => convertFromRaw(JSON.parse(v)), // parse your content-format to draft-js internal ContentState
    format: v => JSON.stringify(convertToRaw(v)), // format draft-js internal ContentState to your content-format
};

export const apiOptions: IRteApiProps<ContentFormat> = {
    defaultValue: defaultContent, // initial content of the editor
    onDebouncedContentChange: (editorState, convertEditorStateToRawContent) => {
        const saveableContent = convertEditorStateToRawContent(editorState); // save this result to your api
    }, // receive updates of editorstate
    debounceDelay: 400, // delay when onDebouncedContentChange after editor content changed
};

const GreenCustomHeader: React.FC = ({ children }) => <span style={{ color: "green" }}>{children}</span>;
export const rteOptions: IRteOptions = {
    supports: [
        "bold",
        "italic",
        "underline",
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
    listLevelMax: 2,
    customBlockMap: {
        "header-custom-green": {
            label: "Custom Green Header",
            renderConfig: {
                element: "h1",
                wrapper: <GreenCustomHeader />,
            },
        },
    },
    draftJsProps: {
        placeholder: "Your Content...",
        autoCorrect: "on",
        autoComplete: "on",
        editorKey: "id-for-ssr",
        readOnly: false,
        spellCheck: true,
        stripPastedStyles: true,
        tabIndex: 0,
    },
};

const [useRteApi] = makeRteApi<ContentFormat>(makeApiOptions);

function Story() {
    const { editorState, setEditorState } = useRteApi(apiOptions);

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, all options", () => <Story />);
