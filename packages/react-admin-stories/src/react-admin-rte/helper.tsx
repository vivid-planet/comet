import { Typography } from "@material-ui/core";
import { IRteRef } from "@vivid-planet/react-admin-rte";
import { convertToRaw, EditorState } from "draft-js";
import * as React from "react";

export function useAutoFocus(editorRef: React.MutableRefObject<IRteRef | undefined>) {
    React.useEffect(() => {
        if (editorRef && editorRef.current) {
            editorRef.current.focus();
        }
    }, []);
}

export function PrintEditorState({ editorState }: { editorState: EditorState }) {
    return (
        <div style={{ padding: "10px", background: "#ccc" }}>
            <Typography variant="h5" color="primary">
                EditorState:
            </Typography>
            <pre>{editorState && editorState.getCurrentContent() && JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, 2)}</pre>
        </div>
    );
}

export function PrintAnything({ children, label }: { children: any; label: string }) {
    return (
        <div style={{ padding: "10px", background: "#ccc" }}>
            <Typography variant="h5" color="primary">
                {label}:
            </Typography>
            <pre>{JSON.stringify(children, null, 2)}</pre>
        </div>
    );
}

export function RteLayout({ children }: { children: React.ReactNode }) {
    return <div style={{ border: "1px solid black", padding: "10px", width: "600px" }}>{children}</div>;
}
