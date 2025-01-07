import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import React, { useEffect, useState } from "react";

import ToolbarPlugin from "./RichTextEditorLexicalToolbar";

const theme = {
    // Theme styling goes here
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
            <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />

            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin onChange={onChange} />
        </LexicalComposer>
    );
};
