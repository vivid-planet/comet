import { DialogTitle } from "@comet/admin";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

const textContent =
    "Dialog content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

storiesOf("@comet/admin/DialogTitle", module)
    .add("DialogTitle", () => (
        <Dialog open>
            <DialogTitle>Title</DialogTitle>
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ))
    .add("DialogTitle with Close Button", () => (
        <Dialog open>
            <DialogTitle onClose={() => {}}>Title</DialogTitle>
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ))
    .add("DialogTitle without children", () => (
        <Dialog open>
            <DialogTitle onClose={() => {}} />
            <DialogContent>
                <Typography>{textContent}</Typography>
            </DialogContent>
        </Dialog>
    ));
