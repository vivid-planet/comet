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
                <RowActionsItem text="Edit" icon={<Edit />} componentsProps={{ iconButton: { color: "primary" } }} />
                <RowActionsMenu>
                    <RowActionsItem text="Copy" icon={<Copy />} />
                    <RowActionsItem text="Paste" icon={<Paste />} />
                    <RowActionsMenu text="More" icon={<Settings />}>
                        <RowActionsItem text="Additional Item 1" icon={<Online />} />
                        <RowActionsItem text="Additional Item 2" icon={<Online />} />
                        <RowActionsItem text="Additional Item 3" icon={<Online />} />
                    </RowActionsMenu>
                    <Divider />
                    <RowActionsItem text="Delete" icon={<Delete />} />
                </RowActionsMenu>
            </RowActionsMenu>
        );
    })
    .add("More Complex & Deeply Nested Example", () => {
        return (
            <RowActionsMenu>
                <RowActionsItem text="Level 0, item 1" icon={<Add />} />
                <RowActionsItem text="Level 0, item 2" icon={<Accept />} />
                <RowActionsItem text="Level 0, item 3" icon={<Info />} />
                <RowActionsMenu>
                    <RowActionsItem text="Level 1, item 1" icon={<FileData />} />
                    <RowActionsItem text="Level 1, item 2" icon={<FileData />} />
                    <RowActionsItem text="Level 1, item 3" textSecondary="Additional Text" icon={<FileData />} endIcon={<LinkExternal />} />
                    <Divider />
                    <RowActionsMenu text="Submenu 1/1" textSecondary="Additional Text" icon={<Favorite />}>
                        <RowActionsItem text="Level 2, item 1" icon={<Favorite />} />
                        <RowActionsItem text="Level 2, item 2" icon={<Favorite />} />
                        <RowActionsItem text="Level 2, item 3" icon={<Favorite />} />
                        <Divider />
                        <RowActionsMenu text="Submenu 2" icon={<Favorite />}>
                            <RowActionsItem text="Level 3, item 1" icon={<Favorite />} />
                            <RowActionsItem text="Level 3, item 2" icon={<Favorite />} />
                            <RowActionsItem text="Level 3, item 3" icon={<Favorite />} />
                        </RowActionsMenu>
                    </RowActionsMenu>
                    <RowActionsMenu text="Submenu 1/2" icon={<BallTriangle />}>
                        <RowActionsItem text="Level 2, item 1" icon={<BallTriangle />} />
                        <RowActionsItem text="Level 2, item 2" icon={<BallTriangle />} />
                        <RowActionsItem text="Level 2, item 3" icon={<BallTriangle />} />
                        <Divider />
                        <RowActionsMenu text="Submenu 2" icon={<BallTriangle />}>
                            <RowActionsItem text="Level 3, item 1" icon={<BallTriangle />} />
                            <RowActionsItem text="Level 3, item 2" icon={<BallTriangle />} />
                            <RowActionsItem text="Level 3, item 3" icon={<BallTriangle />} />
                        </RowActionsMenu>
                    </RowActionsMenu>
                </RowActionsMenu>
            </RowActionsMenu>
        );
    });
