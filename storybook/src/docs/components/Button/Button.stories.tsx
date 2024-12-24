import { Button, ToolbarActionButton } from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { Box, Card, CardContent, CardHeader, Chip, Stack, SxProps, Theme } from "@mui/material";
import { Children, cloneElement, ReactElement, ReactNode } from "react";

export default {
    title: "Docs/Components/Button",
};

const GroupOfElements = ({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) => {
    return (
        <Stack flexDirection="row" flexWrap="wrap" gap={{ xs: 2, md: 4 }} p={{ xs: 2, md: 4 }} sx={sx}>
            {Children.map(children, (child: ReactElement) => (
                <Box sx={{ flex: 1 }}>{cloneElement(child)}</Box>
            ))}
        </Stack>
    );
};

/**
 * TODO:
 * - Fix minWidth of icon-only buttons
 * - Fix size-increase due to chip
 * - Fix requiring custom styling
 */
export const AllButtonVariants = {
    render: () => {
        return (
            <Card>
                <CardContent>
                    <GroupOfElements>
                        <Button variant="contained">Button</Button>
                        <Button variant="contained" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="contained" startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="contained" sx={{ minWidth: 0 }}>
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                    <GroupOfElements>
                        <Button variant="contained" color="secondary">
                            Button
                        </Button>
                        <Button variant="contained" color="secondary" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" color="secondary" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" color="secondary" endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="contained" color="secondary" startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ minWidth: 0 }}>
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                    <GroupOfElements>
                        <Button variant="outlined">Button</Button>
                        <Button variant="outlined" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="outlined" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="outlined" endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="outlined" startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="outlined" sx={{ minWidth: 0 }}>
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                    <GroupOfElements>
                        <Button variant="outlined" color="error">
                            Button
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="outlined" color="error" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="outlined" color="error" endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="outlined" color="error" sx={{ minWidth: 0 }}>
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                    <GroupOfElements>
                        <Button variant="contained" color="success">
                            Button
                        </Button>
                        <Button variant="contained" color="success" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" color="success" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="contained" color="success" endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="contained" color="success" startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="contained" color="success" sx={{ minWidth: 0 }}>
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                    <GroupOfElements sx={(theme) => ({ backgroundColor: theme.palette.grey[800] })}>
                        {/* TODO: Move this color-variant to the theme */}
                        <Button variant="text" sx={{ color: "white" }}>
                            Button
                        </Button>
                        <Button variant="text" sx={{ color: "white" }} startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="text" sx={{ color: "white" }} endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="text" sx={{ color: "white" }} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button variant="text" sx={{ color: "white" }} startIcon={<ArrowRight />} endIcon={<Chip label={4} />}>
                            Button
                        </Button>
                        <Button
                            variant="text"
                            sx={{ color: "white" }}
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label={4} />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                color: "white",
                                minWidth: 0,
                            }}
                        >
                            <ArrowRight />
                        </Button>
                    </GroupOfElements>
                </CardContent>
            </Card>
        );
    },
};

export const ResponsiveBehavior = {
    render: () => {
        return (
            <Stack gap={4}>
                <Card>
                    <CardHeader title="Legacy (ToolbarActionButton)" />
                    <CardContent>
                        <GroupOfElements sx={{ alignItems: "center" }}>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="contained">
                                Button
                            </ToolbarActionButton>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="contained" color="secondary">
                                Button
                            </ToolbarActionButton>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="outlined">
                                Button
                            </ToolbarActionButton>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="outlined" color="error">
                                Button
                            </ToolbarActionButton>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="contained" color="success">
                                Button
                            </ToolbarActionButton>
                            <Box p={4} sx={(theme) => ({ backgroundColor: theme.palette.grey[800] })}>
                                <ToolbarActionButton startIcon={<ArrowRight />} variant="text" sx={{ color: "white" }}>
                                    Button
                                </ToolbarActionButton>
                            </Box>
                        </GroupOfElements>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="New (Button)" />
                    <CardContent>
                        <GroupOfElements sx={{ alignItems: "center" }}>
                            <Button responsiveBehavior startIcon={<ArrowRight />} variant="contained">
                                Button
                            </Button>
                            <Button responsiveBehavior startIcon={<ArrowRight />} variant="contained" color="secondary">
                                Button
                            </Button>
                            <Button responsiveBehavior startIcon={<ArrowRight />} variant="outlined">
                                Button
                            </Button>
                            <Button responsiveBehavior startIcon={<ArrowRight />} variant="outlined" color="error">
                                Button
                            </Button>
                            <Button responsiveBehavior startIcon={<ArrowRight />} variant="contained" color="success">
                                Button
                            </Button>
                            <Box p={4} sx={(theme) => ({ backgroundColor: theme.palette.grey[800] })}>
                                <Button responsiveBehavior startIcon={<ArrowRight />} variant="text" sx={{ color: "white" }}>
                                    Button
                                </Button>
                            </Box>
                        </GroupOfElements>
                    </CardContent>
                </Card>
            </Stack>
        );
    },
};

export const FeedbackBehavior = {
    // TODO
    render: () => {
        return <div>Feedback Behavior</div>;
    },
};
