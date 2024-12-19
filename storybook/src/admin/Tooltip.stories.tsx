import { Tooltip } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Box, Button, ButtonBase, Card, CardContent, IconButton, Link, Stack, Typography } from "@mui/material";
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

        const [clicksOnButton, setClicksOnButton] = useState(0);
        const [clicksOnIconButton, setClicksOnIconButton] = useState(0);
        const [clicksOnButtonBase, setClicksOnButtonBase] = useState(0);
        const [clicksOnLink, setClicksOnLink] = useState(0);

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
                            Hover Tooltips around different types of elements
                        </Typography>
                        <Stack direction={{ md: "row" }} gap={4} alignItems={{ xs: "stretch", md: "center" }}>
                            <Tooltip title="This is a Button">
                                <Button variant="contained" onClick={() => setClicksOnButton(clicksOnButton + 1)}>
                                    {clicksOnButton} clicks
                                </Button>
                            </Tooltip>
                            <Tooltip title="This is an IconButton">
                                <IconButton color="primary" size="large" onClick={() => setClicksOnIconButton(clicksOnIconButton + 1)}>
                                    <Typography variant="h5" sx={{ width: 16, height: 16 }}>
                                        {clicksOnIconButton}
                                    </Typography>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="This is an ButtonBase">
                                <ButtonBase onClick={() => setClicksOnButtonBase(clicksOnButtonBase + 1)}>
                                    <Typography variant="h5" sx={{ p: 2 }}>
                                        {clicksOnButtonBase} clicks
                                    </Typography>
                                </ButtonBase>
                            </Tooltip>
                            <Tooltip title="This is an non-clickable element">
                                <div>
                                    <NonClickable>Just a div</NonClickable>
                                </div>
                            </Tooltip>
                            <Tooltip title="This is a link">
                                <Link
                                    href="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setClicksOnLink(clicksOnLink + 1);
                                    }}
                                >
                                    {clicksOnLink} clicks
                                </Link>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Tooltips around buttons
                            <Box sx={{ fontSize: 12 }} component="pre">
                                Click count: {clicks}
                            </Box>
                        </Typography>
                        <Stack direction={{ md: "row" }} gap={4} alignItems={{ xs: "stretch", md: "center" }}>
                            <Tooltip title="This is a tooltip">
                                <Button variant="contained" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
                                    Trigger: Hover
                                </Button>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="click">
                                <Button variant="contained" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
                                    Trigger: Click
                                </Button>
                            </Tooltip>
                            <Tooltip title="This is a tooltip" trigger="focus">
                                <Button variant="contained" startIcon={<Add />} onClick={() => setClicks(clicks + 1)}>
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
                        <Stack direction={{ md: "row" }} gap={4} alignItems={{ xs: "stretch", md: "center" }}>
                            <Tooltip title="This is a tooltip">
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
