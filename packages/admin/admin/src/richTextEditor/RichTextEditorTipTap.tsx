import { RteBold } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

export type RichTextEditorTipTapProps = {
    content?: string; // Optional initial content
    onChange?: (content: string) => void; // Callback for content change
};

export const RichTextEditorTipTap: React.FC<RichTextEditorTipTapProps> = ({ content = "", onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html); // Pass updated content to the parent
        },
    });

    useEffect(() => {
        return () => {
            editor?.destroy(); // Cleanup editor instance on unmount
        };
    }, [editor]);

    return (
        <div>
            {editor ? (
                <>
                    <div>
                        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
                            <RteBold />
                        </IconButton>
                    </div>

                    <EditorContent editor={editor} />
                </>
            ) : (
                <FormattedMessage id="comet.admin.richTextEditor.loading" defaultMessage="Loading" />
            )}
        </div>
    );
};
