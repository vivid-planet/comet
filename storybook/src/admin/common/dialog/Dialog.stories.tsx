import { Button, Dialog } from "@comet/admin";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";

type Story = StoryObj<typeof Dialog>;

const config: Meta<typeof Dialog> = {
    component: Dialog,
    title: "@comet/admin/common/Dialog",
};

export default config;
export const DialogStory: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <div>
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Open Dialog
                </Button>
                <Dialog
                    open={open}
                    onClose={() => {
                        setOpen(!open);
                    }}
                    title="Dialog"
                >
                    <Box padding={4}>Content</Box>
                </Dialog>
            </div>
        );
    },
};
DialogStory.name = "Dialog";
