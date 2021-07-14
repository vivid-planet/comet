import { FormPaper, Toolbar, ToolbarActions, ToolbarFillSpace } from "@comet/admin";
import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { exampleContent, PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

function Story() {
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
                <FormPaper variant="outlined">
                    <Rte value={editorState} onChange={setEditorState} ref={editorRef} disabled={disabled} />
                </FormPaper>
            </Box>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("comet-admin-rte", module).add("Rte, disable", () => <Story />);
