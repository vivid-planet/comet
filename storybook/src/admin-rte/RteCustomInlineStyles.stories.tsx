import { Favorite } from "@comet/admin-icons";
import { type IRteOptions, type IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { useRef } from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const rteOptions: IRteOptions = {
    supports: ["header-one", "header-two", "bold", "italic", "strikethrough", "sub", "sup"],
    customInlineStyles: {
        HIGHLIGHT: {
            label: "Highlight!",
            icon: Favorite,
            style: {
                backgroundColor: "yellow",
            },
        },
    },
};

const [useRteApi] = makeRteApi();

export default {
    title: "@comet/admin-rte",
};

export const CustomInlineStyles = {
    render: () => {
        const { editorState, setEditorState } = useRteApi();

        // focus the editor to see the cursor immediately
        const editorRef = useRef<IRteRef>();
        useAutoFocus(editorRef);

        return (
            <>
                <Box marginBottom={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
                        </CardContent>
                    </Card>
                </Box>
                <PrintEditorState editorState={editorState} />
            </>
        );
    },

    name: "Custom inline styles",
};
