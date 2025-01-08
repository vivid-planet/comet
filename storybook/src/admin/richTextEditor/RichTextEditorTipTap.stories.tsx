import { RichTextEditorTipTap } from "@comet/admin";
import { useState } from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/rich-text-editor",
    decorators: [storyRouterDecorator()],
};

export const RichTextEditorTipTapStory = function Story() {
    const [content, setContent] = useState("<p>Hello, Comet!</p>");

    const handleContentChange = (updatedContent: string) => {
        console.log("Editor Content:", updatedContent);
        setContent(updatedContent);
    };

    return (
        <div>
            <h1>TipTap Rich Text Editor POC</h1>
            <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <RichTextEditorTipTap content={content} onChange={handleContentChange} />
            </div>
            <div
                style={{
                    marginTop: "20px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    color: "#fefefe",
                    backgroundColor: "#000000",
                }}
            >
                <h2>Content HTML</h2>
                <pre>{content}</pre>
            </div>
        </div>
    );
};

RichTextEditorTipTapStory.storyName = "TipTap Rich Text Editor";
