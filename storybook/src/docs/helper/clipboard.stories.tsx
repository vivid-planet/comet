import { readClipboardText, writeClipboardText } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "Docs/Helper/Clipboard",
};

export const Write = () => {
    return (
        <Button
            variant="outlined"
            onClick={async () => {
                await writeClipboardText("Hello World");
            }}
        >
            write clipboard
        </Button>
    );
};

export const Read = () => {
    return (
        <Button
            variant="outlined"
            onClick={async () => {
                const text = await readClipboardText();
                alert(text);
            }}
        >
            read clipboard
        </Button>
    );
};
