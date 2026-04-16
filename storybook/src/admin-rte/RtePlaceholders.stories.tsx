import { type IRteOptions, type IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { useRef } from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const rteOptions: IRteOptions = {
    supports: ["bold", "italic", "header-one", "header-two", "history"],
    placeholders: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email Address" },
        { key: "company", label: "Company" },
    ],
};

const [useRteApi] = makeRteApi();

export default {
    title: "@comet/admin-rte",
};

export const Placeholders = {
    render: () => {
        const { editorState, setEditorState } = useRteApi();

        const editorRef = useRef<IRteRef>(undefined);
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
};
