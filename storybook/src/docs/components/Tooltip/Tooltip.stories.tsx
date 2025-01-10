import { Tooltip } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Grid, IconButton } from "@mui/material";

export default {
    title: "Docs/Components/Tooltip",
};

export const BasicTooltip = {
    render: () => {
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
    },

    name: "BasicTooltip",
};

export const TooltipVariant = {
    render: () => {
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
    },

    name: "TooltipVariant",
};
