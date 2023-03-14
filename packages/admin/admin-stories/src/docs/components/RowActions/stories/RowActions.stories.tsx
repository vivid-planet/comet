import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Accept, Add, BallTriangle, Copy, Delete, Edit, Favorite, FileData, Info, LinkExternal, Online, Paste, Settings } from "@comet/admin-icons";
import { Divider, Paper } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/RowActions/RowActions", module)
    .addDecorator((Story) => (
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
    ))
    .add("Edit & Context Menu Example", () => {
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
    })
    .add("More Complex & Deeply Nested Example", () => {
        return (
            <RowActionsMenu>
                <RowActionsItem icon={<Add />}>Level 0, item 1</RowActionsItem>
                <RowActionsItem icon={<Accept />}>Level 0, item 2</RowActionsItem>
                <RowActionsItem icon={<Info />}>Level 0, item 3</RowActionsItem>
                <RowActionsMenu>
                    <RowActionsItem icon={<FileData />}>Level 1, item 1</RowActionsItem>
                    <RowActionsItem icon={<FileData />}>Level 1, item 2</RowActionsItem>
                    <RowActionsItem textSecondary="Additional Text" icon={<FileData />} endIcon={<LinkExternal />}>
                        Level 1, item 3
                    </RowActionsItem>
                    <Divider />
                    <RowActionsMenu text="Submenu 1/1" textSecondary="Additional Text" icon={<Favorite />}>
                        <RowActionsItem icon={<Favorite />}>Level 2, item 1</RowActionsItem>
                        <RowActionsItem icon={<Favorite />}>Level 2, item 2</RowActionsItem>
                        <RowActionsItem icon={<Favorite />}>Level 2, item 3</RowActionsItem>
                        <Divider />
                        <RowActionsMenu text="Submenu 2" icon={<Favorite />}>
                            <RowActionsItem icon={<Favorite />}>Level 3, item 1</RowActionsItem>
                            <RowActionsItem icon={<Favorite />}>Level 3, item 2</RowActionsItem>
                            <RowActionsItem icon={<Favorite />}>Level 3, item 3</RowActionsItem>
                        </RowActionsMenu>
                    </RowActionsMenu>
                    <RowActionsMenu text="Submenu 1/2" icon={<BallTriangle />}>
                        <RowActionsItem icon={<BallTriangle />}>Level 2, item 1</RowActionsItem>
                        <RowActionsItem icon={<BallTriangle />}>Level 2, item 2</RowActionsItem>
                        <RowActionsItem icon={<BallTriangle />}>Level 2, item 3</RowActionsItem>
                        <Divider />
                        <RowActionsMenu text="Submenu 2" icon={<BallTriangle />}>
                            <RowActionsItem icon={<BallTriangle />}>Level 3, item 1</RowActionsItem>
                            <RowActionsItem icon={<BallTriangle />}>Level 3, item 2</RowActionsItem>
                            <RowActionsItem icon={<BallTriangle />}>Level 3, item 3</RowActionsItem>
                        </RowActionsMenu>
                    </RowActionsMenu>
                </RowActionsMenu>
            </RowActionsMenu>
        );
    });
