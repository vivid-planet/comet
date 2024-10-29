import { Dialog } from "@comet/admin";
import { DialogContent, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

const textContent =
    "Dialog content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

storiesOf("@comet/admin/Dialog", module)
    .add("Dialog", () => (
        <Dialog open title="Title">
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ))
    .add("Dialog with Close Button", () => (
        <Dialog open title="Title" onClose={() => {}}>
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ))
    .add("Dialog with empty title", () => (
        <Dialog open title="" onClose={() => {}}>
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ));
