import { Alert, Button, readClipboardText, writeClipboardText } from "@comet/admin";
import { Grid } from "@mui/material";
import { useState } from "react";

export default {
    title: "@comet/admin/clipboard",
};

export const ClipboardFallbackSizeLimit = function () {
    const writtenClipboardContent = "a".repeat(1024 * 1024 * 10); // 10MB
    const [readClipboardContent, setReadClipboardContent] = useState<string | undefined>();

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Alert severity="info">To test this story, either a) disallow clipboard access in your browser, or b) try it in Firefox.</Alert>
            </Grid>
            <Grid>
                <Button
                    onClick={() => {
                        writeClipboardText(writtenClipboardContent);
                    }}
                >
                    Write clipboard
                </Button>
            </Grid>
            <Grid>
                <Button
                    onClick={async () => {
                        setReadClipboardContent(await readClipboardText());
                    }}
                >
                    Read clipboard
                </Button>
            </Grid>
            {readClipboardContent && (
                <Grid size={12}>
                    {writtenClipboardContent === readClipboardContent ? (
                        <Alert severity="success">Read clipboard content matches written clipboard content.</Alert>
                    ) : (
                        <Alert severity="error">Read clipboard content does not match written clipboard content.</Alert>
                    )}
                </Grid>
            )}
        </Grid>
    );
};

ClipboardFallbackSizeLimit.name = "Clipboard fallback size limit";
