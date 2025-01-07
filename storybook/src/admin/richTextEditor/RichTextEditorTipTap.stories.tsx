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
        <div style={{ padding: "20px" }}>
            <h1>TipTap Rich Text Editor POC</h1>
            <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <RichTextEditorTipTap content={content} onChange={handleContentChange} />
            </div>
        </div>
    );
};

RichTextEditorTipTapStory.storyName = "TipTap Rich Text Editor";
