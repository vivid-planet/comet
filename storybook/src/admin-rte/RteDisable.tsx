import { Toolbar, ToolbarActions, ToolbarFillSpace } from "@comet/admin";
import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Button, Card, CardContent } from "@mui/material";
import * as React from "react";

import { exampleContent, PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

export default {
    title: "comet-admin-rte",
};

export const RteDisable = () => {
    const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional
    const [disabled, toggleDisabled] = React.useReducer((s) => !s, false);

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <Box marginBottom={4}>
                <Toolbar>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button variant="contained" color="primary" onClick={toggleDisabled}>
                            {disabled ? "Enable" : "Disable"}
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Box>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} ref={editorRef} disabled={disabled} />
                    </CardContent>
                </Card>
            </Box>
            <PrintEditorState editorState={editorState} />
        </>
    );
};

RteDisable.storyName = "Rte, disable";
