import { Tooltip } from "@comet/admin";
import { Add, StatusErrorSolid, StatusSuccessSolid, StatusWarningSolid } from "@comet/admin-icons";
import { Box, Chip, Stack } from "@mui/material";
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
                <Tooltip title="Success Tooltip" placement="top-start" color="success">
                    <StatusSuccessSolid color="success" />
                </Tooltip>
                <Tooltip title="Warning Tooltip" placement="top-start" color="warning">
                    <StatusWarningSolid color="warning" />
                </Tooltip>
                <Tooltip title="Error Tooltip" placement="top-start" color="error">
                    <StatusErrorSolid color="error" />
                </Tooltip>
            </Stack>
        );
    },
};

// Makes it easier to see the light tooltip
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
            <Stack pb={12} spacing={16} direction="row">
                <Tooltip title="Title" description="Notification Text" color="light" placement="bottom-start" open={showTooltips}>
                    <Chip label="Light" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip title="Title" description="Notification Text" color="dark" placement="bottom-start" open={showTooltips}>
                    <Chip label="Dark" sx={{ width: 140 }} />
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
            <Stack pb={8} spacing={12} direction="row">
                <Tooltip title="Notification text" color="dark" placement="bottom-start" open={showTooltips}>
                    <Chip label="Dark" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" color="success" placement="bottom-start" open={showTooltips}>
                    <Chip label="Success" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" color="error" placement="bottom-start" open={showTooltips}>
                    <Chip label="Error" sx={{ width: 70 }} />
                </Tooltip>
                <Tooltip title="Notification text" color="warning" placement="bottom-start" open={showTooltips}>
                    <Chip label="Warning" sx={{ width: 70 }} />
                </Tooltip>
            </Stack>
        );
    },
};
