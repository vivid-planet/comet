import { Box, Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { IRteRef, makeRteApi, Rte } from "@vivid-planet/comet-admin-rte";
import * as React from "react";

import { exampleContent, PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional
    const [disabled, toggleDisabled] = React.useReducer((s) => !s, false);

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <Box p={2}>
                <Button variant="contained" color="primary" onClick={toggleDisabled}>
                    {disabled ? "Enable" : "Disable"}
                </Button>
            </Box>

            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} disabled={disabled} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("comet-admin-rte", module).add("Rte, disable", () => <Story />);
