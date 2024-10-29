import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Grid, Typography } from "@mui/material";
import { EditorState } from "draft-js";
import * as React from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

export default {
    title: "@comet/admin-rte",
};

export const SynchronizedRtEs = () => {
    const { editorState, setEditorState } = useRteApi();
    const [activeEditor, setActiveEditor] = React.useState<"left" | "right">("left");

    // focus the editor to see the cursor immediately
    const leftEditorRef = React.useRef<IRteRef>();
    useAutoFocus(leftEditorRef);

    return (
        <Grid container spacing={4}>
            <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                    Left Editor
                </Typography>
                <Rte
                    // Use EditorState.createWithContent(editorState.getCurrentContent()) to update state without losing focus in the active editor
                    value={activeEditor === "left" ? editorState : EditorState.createWithContent(editorState.getCurrentContent())}
                    onChange={(value) => {
                        setEditorState(value);
                        setActiveEditor("left");
                    }}
                    ref={leftEditorRef}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                    Right Editor
                </Typography>
                <Rte
                    // Use EditorState.createWithContent(editorState.getCurrentContent()) to update state without losing focus in the active editor
                    value={activeEditor === "right" ? editorState : EditorState.createWithContent(editorState.getCurrentContent())}
                    onChange={(value) => {
                        setEditorState(value);
                        setActiveEditor("right");
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <PrintEditorState editorState={editorState} />
            </Grid>
        </Grid>
    );
};

SynchronizedRtEs.storyName = "Synchronized RTEs";
