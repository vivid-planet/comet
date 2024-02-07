import { readClipboardText, writeClipboardText } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/helper/clipboard", module)
    .add("Write", () => {
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
    })
    .add("Read", () => {
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
    });
