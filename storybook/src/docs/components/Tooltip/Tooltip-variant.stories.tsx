import { Tooltip } from "@comet/admin";
import { Grid } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Tooltip",
};

export const TooltipVariant = () => {
    return (
        <Grid container justifyContent="center" spacing={4}>
            <Grid item>
                <Tooltip title="This is a light tooltip" variant="light">
                    <div>Hover over me - light</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip title="This is a dark tooltip" variant="dark">
                    <div>Hover over me - dark</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip title="This is a neutral tooltip" variant="neutral">
                    <div>Hover over me - neutral</div>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip title="This is a primary tooltip" variant="primary">
                    <div>Hover over me - primary</div>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

TooltipVariant.storyName = "TooltipVariant";
