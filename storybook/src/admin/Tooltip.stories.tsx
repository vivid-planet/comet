import { Button, Tooltip } from "@comet/admin";
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
            <Stack pb={12} spacing={16} direction="row">
                <Tooltip title="Title" description="Notification Text" variant="light" placement="bottom-start" open={showTooltips}>
                    <Chip label="Light" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip title="Title" description="Notification Text" variant="dark" placement="bottom-start" open={showTooltips}>
                    <Chip label="Dark" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip title="Title" description="Notification Text" variant="neutral" placement="bottom-start" open={showTooltips}>
                    <Chip label="Neutral (deprecated)" sx={{ width: 140 }} />
                </Tooltip>
                <Tooltip title="Title" description="Notification Text" variant="primary" placement="bottom-start" open={showTooltips}>
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
            <Stack pb={8} spacing={12} direction="row">
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

/**
 * This demonstrates using custom content in tooltips where a simple title and description is not sufficient. <br/>
 * Currently, ther is no obvious correct way to do this, which causes inconsistent styling, depending on how the content is provided.
 */
export const TooltipsWithCustomContent = {
    decorators: [lightGrayBackgroundDecorator],
    render: () => {
        const [showTooltips, setShowTooltips] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                // Delay showing tooltips to prevent them being rendered in the wrong place due to the underlying element not being rendered properly yet.
                setShowTooltips(true);
            }, 1000);
        }, []);

        const customElementsContent = (
            <>
                <Typography variant="subtitle1">Title</Typography>
                <Typography variant="caption">Detail information</Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "primary.main",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        marginTop: 1,
                    }}
                >
                    <Typography variant="overline">Custom</Typography>
                    <Typography variant="overline">Element</Typography>
                </Box>
            </>
        );

        const imageContent = <Box sx={{ width: 200, height: 100 }} component="img" src="https://picsum.photos/400/200" />;

        const imageWithDescriptionContent = (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: 200 }}>
                <Box sx={{ width: 200, height: 100 }} component="img" src="https://picsum.photos/400/200" />
                <Typography variant="caption" sx={{ textAlign: "center" }}>
                    This could be some information about the image above.
                </Typography>
            </Box>
        );

        return (
            <Stack pb={32} spacing={24} direction="row">
                <Tooltip customContent={customElementsContent} variant="light" open={showTooltips}>
                    <Chip label="Custom elements" sx={{ width: 150 }} />
                </Tooltip>
                <Tooltip customContent={imageContent} variant="light" open={showTooltips}>
                    <Chip label="Image" sx={{ width: 150 }} />
                </Tooltip>
                <Tooltip customContent={imageWithDescriptionContent} variant="light" open={showTooltips}>
                    <Chip label="Image with description" sx={{ width: 150 }} />
                </Tooltip>
            </Stack>
        );
    },
};

/**
 * This is to test how the focus-behavior works with different tooltip children.
 */
export const FocusTest = {
    render: () => {
        return (
            <>
                <Typography variant="h4">Without tooltip (standalone elements)</Typography>
                <Typography variant="overline">Only the button should be focusable</Typography>
                <Stack p={2} mt={2} mb={8} spacing={12} direction="row" alignItems="center" sx={{ backgroundColor: "#f0f0f0" }}>
                    <Typography>Typography</Typography>
                    <Chip label="Chip" />
                    <Button>Button</Button>
                    <span>Span</span>
                </Stack>
                <Typography variant="h4">With tooltip</Typography>
                <Typography variant="overline">All elements should be focusable</Typography>
                <Stack p={2} mt={2} mb={8} spacing={12} direction="row" alignItems="center" sx={{ backgroundColor: "#f0f0f0" }}>
                    <Tooltip title="Hello Tooltip">
                        <Typography>Typography</Typography>
                    </Tooltip>
                    <Tooltip title="Hello Tooltip">
                        <Chip label="Chip" />
                    </Tooltip>
                    <Tooltip title="Hello Tooltip">
                        <Button>Button</Button>
                    </Tooltip>
                    <Tooltip title="Hello Tooltip">
                        <span>Span</span>
                    </Tooltip>
                </Stack>
                <Typography variant="h4">With tooltip and disabled tabindex</Typography>
                <Typography variant="overline">Nothing should be focusable</Typography>
                <Stack p={2} mt={2} mb={8} spacing={12} direction="row" alignItems="center" sx={{ backgroundColor: "#f0f0f0" }}>
                    <Tooltip title="Hello Tooltip" tabIndex={-1}>
                        <Typography>Typography</Typography>
                    </Tooltip>
                    <Tooltip title="Hello Tooltip" tabIndex={-1}>
                        <Chip label="Chip" />
                    </Tooltip>
                    <Tooltip title="Hello Tooltip" tabIndex={-1}>
                        <Button>Button</Button>
                    </Tooltip>
                    <Tooltip title="Hello Tooltip" tabIndex={-1}>
                        <span>Span</span>
                    </Tooltip>
                </Stack>
            </>
        );
    },
};
