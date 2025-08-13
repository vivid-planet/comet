import { Tooltip } from "@comet/admin";
import { Grid } from "@mui/material";

export default {
    title: "Docs/Components/Tooltip",
};

export const BasicTooltip = {
    render: () => {
        return (
            <Grid container justifyContent="center" spacing={4}>
                <Grid>
                    <Tooltip title="This is a basic tooltip">
                        <div>Hover over me</div>
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
                <Grid>
                    <Tooltip title="This is a light tooltip" variant="light">
                        <div>Hover over me - light</div>
                    </Tooltip>
                </Grid>
                <Grid>
                    <Tooltip title="This is a dark tooltip" variant="dark">
                        <div>Hover over me - dark</div>
                    </Tooltip>
                </Grid>
                <Grid>
                    <Tooltip title="This is a neutral tooltip" variant="neutral">
                        <div>Hover over me - neutral</div>
                    </Tooltip>
                </Grid>
                <Grid>
                    <Tooltip title="This is a primary tooltip" variant="primary">
                        <div>Hover over me - primary</div>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    },

    name: "TooltipVariant",
};
