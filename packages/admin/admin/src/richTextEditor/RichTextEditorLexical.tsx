import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";

import DebugTreeViewPlugin from "./RichTextEditorLexicalDebug";
import ToolbarPlugin from "./RichTextEditorLexicalToolbar";

const theme = {
    ltr: "ltr",
    rtl: "rtl",
    paragraph: "editor-paragraph",
    quote: "editor-quote",
    heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
        h4: "editor-heading-h4",
        h5: "editor-heading-h5",
        h6: "editor-heading-h6",
    },
    list: {
        nested: {
            listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol",
        ul: "editor-list-ul",
        listitem: "editor-listItem",
        listitemChecked: "editor-listItemChecked",
        listitemUnchecked: "editor-listItemUnchecked",
    },
    hashtag: "editor-hashtag",
    image: "editor-image",
    link: "editor-link",
    text: {
        bold: "editor-textBold",
        code: "editor-textCode",
        italic: "editor-textItalic",
        strikethrough: "editor-textStrikethrough",
        subscript: "editor-textSubscript",
        superscript: "editor-textSuperscript",
        underline: "editor-textUnderline",
        underlineStrikethrough: "editor-textUnderlineStrikethrough",
    },
    code: "editor-code",
    codeHighlight: {
        atrule: "editor-tokenAttr",
        attr: "editor-tokenAttr",
        boolean: "editor-tokenProperty",
        builtin: "editor-tokenSelector",
        cdata: "editor-tokenComment",
        char: "editor-tokenSelector",
        class: "editor-tokenFunction",
        "class-name": "editor-tokenFunction",
        comment: "editor-tokenComment",
        constant: "editor-tokenProperty",
        deleted: "editor-tokenProperty",
        doctype: "editor-tokenComment",
        entity: "editor-tokenOperator",
        function: "editor-tokenFunction",
        important: "editor-tokenVariable",
        inserted: "editor-tokenSelector",
        keyword: "editor-tokenAttr",
        namespace: "editor-tokenVariable",
        number: "editor-tokenProperty",
        operator: "editor-tokenOperator",
        prolog: "editor-tokenComment",
        property: "editor-tokenProperty",
        punctuation: "editor-tokenPunctuation",
        regex: "editor-tokenVariable",
        selector: "editor-tokenSelector",
        string: "editor-tokenSelector",
        symbol: "editor-tokenProperty",
        tag: "editor-tokenProperty",
        url: "editor-tokenOperator",
        variable: "editor-tokenVariable",
    },
};

function onError(error: Error) {
    console.error(error);
}

export interface RichTextEditorLexicalProps {
    content?: string;
}

function OnChangePlugin({ onChange }: { onChange: (editorState: { toJSON: () => any }) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

export const RichTextEditorLexical: React.FC<RichTextEditorLexicalProps> = ({ content }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [editorState, setEditorState] = useState(content);

    function onChange(editorState: { toJSON: () => any }) {
        const editorStateJSON = editorState.toJSON();

        setEditorState(JSON.stringify(editorStateJSON));
    }

    const initialConfig = {
        namespace: "RichTextEditorLexical",
        theme,
        onError,
        editorState: content,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <RichTextWrapper style={{}}>
                <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
            </RichTextWrapper>

            <HistoryPlugin />
            <OnChangePlugin onChange={onChange} />
            <DebugTreeViewPlugin />
        </LexicalComposer>
    );
};

const RichTextWrapper = styled("div")`
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fefefe;
    color: #000000;
    margin-bottom: 20px;

    .editor-textBold {
        font-weight: bold;
    }

    .editor-textItalic {
        font-style: italic;
    }

    .editor-textUnderline {
        text-decoration: underline;
    }

    .editor-textStrikethrough {
        text-decoration: line-through;
    }

    .editor-textUnderlineStrikethrough {
        text-decoration: underline line-through;
    }
`;
