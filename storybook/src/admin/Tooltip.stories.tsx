import { Tooltip } from "@comet/admin";
import { Add, StatusErrorSolid, StatusSuccessSolid, StatusWarningSolid } from "@comet/admin-icons";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { type Decorator } from "@storybook/react-webpack5";
import { useEffect, useState } from "react";

export default {
    title: "@comet/admin/Tooltip",
};

export const IconWithTooltip = {
    render: () => {
        return (
            <Tooltip title="Add something">
                <Add />
            </Tooltip>
        );
    },

    name: "Icon with Tooltip",
};

export const StatusIndicators = {
    render: () => {
        return (
            <Stack py={5} spacing={5}>
                <Tooltip title="Success variant" placement="top-start" variant="success">
                    <StatusSuccessSolid color="success" />
                </Tooltip>
                <Tooltip title="Warning variant" placement="top-start" variant="warning">
                    <StatusWarningSolid color="warning" />
                </Tooltip>
                <Tooltip title="Error variant" placement="top-start" variant="error">
                    <StatusErrorSolid color="error" />
                </Tooltip>
            </Stack>
        );
    },
};

// Makes it easier to see the light variant of the tooltip
const lightGrayBackgroundDecorator: Decorator = (Story) => (
    <Box sx={{ backgroundColor: "#f0f0f0", margin: "-40px -30px", padding: "40px 30px" }}>
        <Story />
    </Box>
);

export const StackedTooltipsFromDesign = {
    decorators: [lightGrayBackgroundDecorator],
    render: () => {
        const [showTooltips, setShowTooltips] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                // Delay showing tooltips to prevent them being rendered in the wrong place due to the underlying element not being rendered properly yet.
                setShowTooltips(true);
            }, 1000);
        }, []);

        return (
            <Stack pb={8} spacing={16} direction="row">
                <Tooltip
                    title={
                        <>
                            <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                                Title
                            </Typography>
                            <Typography variant="body2">Notification Text</Typography>
                        </>
                    }
                    variant="light"
                    placement="bottom-start"
                    open={showTooltips}
                >
                    <Chip label="Light" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip
                    title={
                        <>
                            <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                                Title
                            </Typography>
                            <Typography variant="body2">Notification Text</Typography>
                        </>
                    }
                    variant="dark"
                    placement="bottom-start"
                    open={showTooltips}
                >
                    <Chip label="Dark" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip
                    title={
                        <>
                            <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                                Title
                            </Typography>
                            <Typography variant="body2">Notification Text</Typography>
                        </>
                    }
                    variant="neutral"
                    placement="bottom-start"
                    open={showTooltips}
                >
                    <Chip label="Neutral (deprecated)" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip
                    title={
                        <>
                            <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                                Title
                            </Typography>
                            <Typography variant="body2">Notification Text</Typography>
                        </>
                    }
                    variant="primary"
                    placement="bottom-start"
                    open={showTooltips}
                >
                    <Chip label="Primary (deprecated)" sx={{ width: 140 }} />
                </Tooltip>
            </Stack>
        );
    },
};

export const FeedbackTooltipsFromDesign = {
    render: () => {
        const [showTooltips, setShowTooltips] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                // Delay showing tooltips to prevent them being rendered in the wrong place due to the underlying element not being rendered properly yet.
                setShowTooltips(true);
            }, 1000);
        }, []);

        return (
            <Stack pb={8} spacing={10} direction="row">
                <Tooltip title="Notification text" variant="dark" placement="bottom-start" open={showTooltips}>
                    <Chip label="Dark" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" variant="success" placement="bottom-start" open={showTooltips}>
                    <Chip label="Success" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" variant="error" placement="bottom-start" open={showTooltips}>
                    <Chip label="Error" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" variant="warning" placement="bottom-start" open={showTooltips}>
                    <Chip label="Warning" sx={{ width: 70 }} />
                </Tooltip>
            </Stack>
        );
    },
};
