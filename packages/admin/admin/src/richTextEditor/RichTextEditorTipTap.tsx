"use strict";

import { RteBold, RteItalic, RteOl, RteRedo, RteStrikethrough, RteUl, RteUndo } from "@comet/admin-icons";
import { IconButton, MenuItem, Select } from "@mui/material";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { FontSize } from "./RichTextEditorTipTap.utils";

export type RichTextEditorTipTapProps = {
    content?: string; // Optional initial content
    onChange?: (content: string) => void; // Callback for content change
};

export const RichTextEditorTipTap: React.FC<RichTextEditorTipTapProps> = ({ content = "", onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit, TextStyle, FontSize],
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

                        <Select value="12" onChange={(e) => editor.commands.setFontSize(e.target.value)}>
                            <MenuItem value="12">12</MenuItem>
                            <MenuItem value="14">14</MenuItem>
                            <MenuItem value="16">16</MenuItem>
                            <MenuItem value="18">18</MenuItem>
                        </Select>

                        <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
                            <RteUl />
                        </IconButton>

                        <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                            <RteOl />
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
