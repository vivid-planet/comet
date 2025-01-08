import { RteBold, RteItalic, RteRedo, RteStrikethrough, RteUndo } from "@comet/admin-icons";
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
                <div>
                    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fefefe", color: "#000000" }}>
                        <IconButton onClick={() => editor.chain().focus().undo().run()}>
                            <RteUndo />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().redo().run()}>
                            <RteRedo />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
                            <RteBold />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
                            <RteItalic />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
                            <RteStrikethrough />
                        </IconButton>

                        <EditorContent editor={editor} />
                    </div>
                </div>
            ) : (
                <FormattedMessage id="comet.admin.richTextEditor.loading" defaultMessage="Loading" />
            )}
        </div>
    );
};
