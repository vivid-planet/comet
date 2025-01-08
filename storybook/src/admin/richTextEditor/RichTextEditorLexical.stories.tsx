import { RichTextEditorLexical } from "@comet/admin";
import { useState } from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/rich-text-editor",
    decorators: [storyRouterDecorator()],
};

export const RichTextEditorLexicalStory = function Story() {
    const [content] = useState();

    return (
        <div style={{ padding: "20px" }}>
            <h1>Lexical Rich Text Editor POC</h1>
            <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <RichTextEditorLexical content={content} />
            </div>
        </div>
    );
};

RichTextEditorLexicalStory.storyName = "Lexical Rich Text Editor";
