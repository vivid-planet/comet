import { Alert, readClipboardText, writeClipboardText } from "@comet/admin";
import { Button, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("@comet/admin/clipboard", module).add("Clipboard fallback size limit", function () {
    const writtenClipboardContent = "a".repeat(1024 * 1024 * 10); // 10MB
    const [readClipboardContent, setReadClipboardContent] = React.useState<string | undefined>();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info">To test this story, either a) disallow clipboard access in your browser, or b) try it in Firefox.</Alert>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    onClick={() => {
                        writeClipboardText(writtenClipboardContent);
                    }}
                >
                    Write clipboard
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    onClick={async () => {
                        setReadClipboardContent(await readClipboardText());
                    }}
                >
                    Read clipboard
                </Button>
            </Grid>
            {readClipboardContent && (
                <Grid item xs={12}>
                    {writtenClipboardContent === readClipboardContent ? (
                        <Alert severity="success">Read clipboard content matches written clipboard content.</Alert>
                    ) : (
                        <Alert severity="error">Read clipboard content does not match written clipboard content.</Alert>
                    )}
                </Grid>
            )}
        </Grid>
    );
});
