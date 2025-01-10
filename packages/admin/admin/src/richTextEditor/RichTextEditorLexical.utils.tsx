import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, CLEAR_HISTORY_COMMAND } from "lexical";
import React, { FunctionComponent, useEffect, useLayoutEffect } from "react";
import { FormattedMessage } from "react-intl";

export const SetInitialValuePlugin: FunctionComponent<{ initHtml: string }> = ({ initHtml = "" }) => {
    const [editor] = useLexicalComposerContext();

    useLayoutEffect(() => {
        if (editor && initHtml) {
            editor.update(() => {
                const content = $generateHtmlFromNodes(editor, null);

                if (!!initHtml && content !== initHtml) {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(initHtml, "text/html");
                    const nodes = $generateNodesFromDOM(editor, dom);

                    const root = $getRoot();
                    root.clear();

                    const selection = root.select();
                    selection.removeText();
                    selection.insertNodes(nodes);
                    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
                }
            });
        }
    }, [editor, initHtml]);

    return null;
};

export const HtmlViewerPlugin: FunctionComponent = () => {
    const [editor] = useLexicalComposerContext();
    const [editorHtml, setEditorHtml] = React.useState("");

    useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);

                setEditorHtml(htmlString);
            });
        });
        return () => {
            removeUpdateListener();
        };
    }, [editor]);

    return (
        <div style={{ marginTop: "20px", backgroundColor: "#000", color: "#fefefe", padding: "10px" }}>
            <h1>
                <FormattedMessage defaultMessage="HTML Output" id="comet.admin.rte.lexical.htmloutput" />
            </h1>
            {editorHtml}
        </div>
    );
};

export const CustomAutoFocusPlugin: FunctionComponent = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
};
