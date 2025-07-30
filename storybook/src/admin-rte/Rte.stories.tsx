import { type IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { useRef } from "react";

import { exampleContent, PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

export default {
    title: "@comet/admin-rte",
};

export const RteMinimalConfiguration = {
    render: () => {
        const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional

        // focus the editor to see the cursor immediately
        const editorRef = useRef<IRteRef>();
        useAutoFocus(editorRef);

        return (
            <>
                <Box marginBottom={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Rte value={editorState} onChange={setEditorState} ref={editorRef} />
                        </CardContent>
                    </Card>
                </Box>
                <PrintEditorState editorState={editorState} />
            </>
        );
    },

    name: "Rte, minimal configuration",
};
