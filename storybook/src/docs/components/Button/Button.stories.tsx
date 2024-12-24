import { Button, FeedbackButton, ToolbarActionButton } from "@comet/admin";
import { Add, ArrowRight } from "@comet/admin-icons";
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
                            <ToolbarActionButton endIcon={<ArrowRight />} variant="contained" color="secondary">
                                Button
                            </ToolbarActionButton>
                            <ToolbarActionButton startIcon={<ArrowRight />} variant="outlined">
                                Button
                            </ToolbarActionButton>
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
                            <Button responsiveBehavior endIcon={<ArrowRight />} variant="contained" color="secondary">
                                Button
                            </Button>
                            <Button
                                responsiveBehavior={{
                                    mobileIcon: <ArrowRight />,
                                }}
                                variant="outlined"
                            >
                                Button
                            </Button>
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
        return (
            <Stack gap={4}>
                <Card>
                    <CardHeader title="Legacy (FeedbackButton)" />
                    <CardContent>
                        <GroupOfElements sx={{ alignItems: "center" }}>
                            <FeedbackButton
                                startIcon={<Add />}
                                onClick={() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }}
                            >
                                This will succeed
                            </FeedbackButton>
                            <FeedbackButton
                                startIcon={<Add />}
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                            >
                                This will fail
                            </FeedbackButton>
                            <FeedbackButton
                                startIcon={<Add />}
                                onClick={() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }}
                                tooltipErrorMessage="This failed but at least it has a custom message"
                                tooltipSuccessMessage="This worked and has a custom message"
                            >
                                Custom message (succeeds)
                            </FeedbackButton>
                            <FeedbackButton
                                startIcon={<Add />}
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                                tooltipErrorMessage="This failed but at least it has a custom message"
                                tooltipSuccessMessage="This worked and has a custom message"
                            >
                                Custom message (fails)
                            </FeedbackButton>
                        </GroupOfElements>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="New (Button)" />
                    <CardContent>
                        <GroupOfElements sx={{ alignItems: "center" }}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                feedbackBehavior
                                onClick={() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }}
                            >
                                This will succeed
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                feedbackBehavior
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                            >
                                This will fail
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                feedbackBehavior={{
                                    successMessage: "This worked and has a custom message",
                                    errorMessage: "This failed but at least it has a custom message",
                                }}
                                onClick={() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }}
                            >
                                Custom message (succeeds)
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                feedbackBehavior={{
                                    successMessage: "This worked and has a custom message",
                                    errorMessage: "This failed but at least it has a custom message",
                                }}
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                            >
                                Custom message (fails)
                            </Button>
                        </GroupOfElements>
                    </CardContent>
                </Card>
            </Stack>
        );
    },
};
