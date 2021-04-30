import { ArrowLeft } from "@comet/admin-icons";
import { IconButton, Toolbar as MUIToolbar, Typography } from "@material-ui/core";
import * as React from "react";

export interface ToolbarProps {}

const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
    return (
        <div style={{ backgroundColor: "green" }}>
            <MUIToolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <ArrowLeft />
                </IconButton>
                <Typography variant="h6">Toolbar - all things start small</Typography>
            </MUIToolbar>
        </div>
    );
};

export { Toolbar };
