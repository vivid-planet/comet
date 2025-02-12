import { Button, Tooltip } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

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

export const AllTooltipTriggers = {
    render: () => {
        const [clicks, setClicks] = useState(0);

        const NonClickable = ({ children }: { children: ReactNode }) => {
            return (
                <Typography
                    sx={{ background: "lightgray", p: 2, borderRadius: 5, ":focus": { outline: "5px solid lime" } }}
                    variant="body1"
                    tabIndex={0}
                >
                    {children}
                </Typography>
            );
        };

        return (
            <Stack spacing={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Tooltips around buttons
                            <Box sx={{ fontSize: 12 }} component="pre">
                                Click count: {clicks}
                            </Box>
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Tooltip title="This is a tooltip" trigger="hover">
                                <Button variant="primary" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
                                    Trigger: Hover
                                </Button>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="click">
                                <Button variant="primary" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
                                    Trigger: Click
                                </Button>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="focus">
                                <Button variant="primary" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
                                    Trigger: Focus
                                </Button>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Tooltips around non-clickable elements
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Tooltip title="This is a tooltip" trigger="hover">
                                <div>
                                    <NonClickable>Trigger: Hover</NonClickable>
                                </div>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="click">
                                <div>
                                    <NonClickable>Trigger: Click</NonClickable>
                                </div>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="focus">
                                <div>
                                    <NonClickable>Trigger: Focus</NonClickable>
                                </div>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        );
    },
};
