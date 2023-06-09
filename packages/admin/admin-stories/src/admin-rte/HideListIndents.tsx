import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

/**
 * Development story for testing the hiding of list indent option.
 */
function Story() {
    const { editorState, setEditorState } = useRteApi({
        defaultValue: JSON.stringify({
            blocks: [],
            entityMap: {},
        }),
    });

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardHeader title="Hide indents with listLevelMax = 0" />
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={{ listLevelMax: 0 }} />
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardHeader title="listLevelMax > 0" />
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={{ listLevelMax: 1 }} />
                    </CardContent>
                </Card>
            </Box>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Hide List Indents", () => <Story />);
