import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Copy, Delete, Edit, Online, Paste, Settings } from "@comet/admin-icons";
import { Divider, Paper } from "@mui/material";
import { ComponentMeta } from "@storybook/react";
import * as React from "react";

export default {
    title: "stories/components/RowActions/RowActions",

    decorators: [
        (Story) => (
            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: 2,
                    maxWidth: 320,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <Story />
            </Paper>
        ),
    ],
} as ComponentMeta<typeof RowActionsMenu>;

export const EditContextMenuExample = () => {
    return (
        <RowActionsMenu>
            <RowActionsItem icon={<Edit />} componentsProps={{ iconButton: { color: "primary" } }}>
                Edit
            </RowActionsItem>
            <RowActionsMenu>
                <RowActionsItem icon={<Copy />}>Copy</RowActionsItem>
                <RowActionsItem icon={<Paste />}>Paste</RowActionsItem>
                <RowActionsMenu text="More" icon={<Settings />}>
                    <RowActionsItem icon={<Online />}>Additional Item 1</RowActionsItem>
                    <RowActionsItem icon={<Online />}>Additional Item 2</RowActionsItem>
                    <RowActionsItem icon={<Online />}>Additional Item 3</RowActionsItem>
                </RowActionsMenu>
                <Divider />
                <RowActionsItem icon={<Delete />}>Delete</RowActionsItem>
            </RowActionsMenu>
        </RowActionsMenu>
    );
};

EditContextMenuExample.storyName = "Edit & Context Menu Example";
