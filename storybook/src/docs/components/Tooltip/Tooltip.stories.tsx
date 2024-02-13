import { Tooltip } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Grid, IconButton } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Tooltip", module).add("BasicTooltip", () => {
    return (
        <Grid container justifyContent="center" spacing={4}>
            <Grid item>
                <Tooltip title="This is a basic tooltip">
                    <div>Hover over me</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip title="This is a focus or touch tooltip" trigger="focus">
                    <div>Focus or touch</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip trigger="click" title="This is a clickable tooltip">
                    <div>Click here to show tooltip</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip trigger="click" title="This is a clickable tooltip with an info icon">
                    <IconButton>
                        <Info />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
});
