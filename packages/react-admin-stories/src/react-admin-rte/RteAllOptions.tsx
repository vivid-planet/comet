import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { IMakeRteApiProps, IRteApiProps, IRteOptions, IRteRef, LinkDecorator, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import { convertFromRaw, convertToRaw } from "draft-js";
import * as React from "react";
import styled from "styled-components";
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
const StyledUnorderedList = styled.ul`
    text-transform: uppercase;
    background-color: lightblue;
    color: red;
`;
const StyledH1Wrapper = styled(Typography)`
    text-transform: uppercase;
    letter-spacing: 10px;
    font-weight: bold;
`;
const StyledH2 = styled.h2`
    text-transform: uppercase;
    letter-spacing: 5px;
`;

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
    coreBlockMap: {
        unstyled: {
            label: "Unstyled (custom label)",
            renderConfig: {
                element: "p",
                wrapper: <Typography variant="body1" />,
            },
        },
        "header-one": {
            label: "Headline 1 (custom label)",
            renderConfig: {
                element: "h1",
                wrapper: <StyledH1Wrapper />,
            },
        },
        "header-two": {
            label: "Headline 2 (custom label)",
            renderConfig: {
                element: StyledH2, // React-Components can be used instead of html-elements, but then pasted html (h2) is not mapped to this block, so better use a wrapper for styling like in 'header-one'
            },
        },
        "unordered-list-item": {
            renderConfig: {
                element: "li",
                wrapper: <StyledUnorderedList />,
            },
        },
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
