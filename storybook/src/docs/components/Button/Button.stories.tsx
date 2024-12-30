import { Button, ButtonFeedbackState, FeedbackButton, ToolbarActionButton } from "@comet/admin";
import { Add, ArrowRight, Favorite } from "@comet/admin-icons";
import { Box, Card, CardContent, CardHeader, Chip, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Children, cloneElement, ReactElement, ReactNode, useState } from "react";

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
                            <Button
                                responsiveBehavior={{
                                    breakpoint: "md",
                                    mobileIcon: "endIcon",
                                }}
                                startIcon={<ArrowRight />}
                                endIcon={<Favorite />}
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
        const [firstButtonLoading, setFirstButtonLoading] = useState(false);
        const [secondButtonLoading, setSecondButtonLoading] = useState(false);

        const [firstButtonHasErrors, setFirstButtonHasErrors] = useState(false);
        const [secondButtonHasErrors, setSecondButtonHasErrors] = useState(false);

        const [thirdButtonState, setThirdButtonState] = useState<ButtonFeedbackState>("none");
        const [fourthButtonState, setFourthButtonState] = useState<ButtonFeedbackState>("none");

        return (
            <Stack gap={4}>
                <Card>
                    <CardHeader title="Legacy (FeedbackButton)" />
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Uncontrolled (feedback state depends on the promise)
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
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
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            Controlled (feedback state depends on the props)
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
                            <FeedbackButton
                                loading={firstButtonLoading}
                                hasErrors={firstButtonHasErrors}
                                startIcon={<Add />}
                                onClick={() => {
                                    setFirstButtonLoading(true);

                                    setTimeout(() => {
                                        setFirstButtonLoading(false);
                                        setFirstButtonHasErrors(false);
                                    }, 1000);
                                }}
                            >
                                This will succeed
                            </FeedbackButton>
                            <FeedbackButton
                                loading={secondButtonLoading}
                                hasErrors={secondButtonHasErrors}
                                startIcon={<Add />}
                                onClick={() => {
                                    setSecondButtonLoading(true);

                                    setTimeout(() => {
                                        setSecondButtonLoading(false);
                                        setSecondButtonHasErrors(true);

                                        setTimeout(() => {
                                            setSecondButtonHasErrors(false);
                                        }, 1000);
                                    }, 1000);
                                }}
                            >
                                This will fail
                            </FeedbackButton>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            With custom messages and no icon
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
                            <FeedbackButton
                                onClick={() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }}
                                tooltipErrorMessage="This failed but at least it has a custom message"
                                tooltipSuccessMessage="This worked and has a custom message"
                            >
                                Custom message (succeeds)
                            </FeedbackButton>
                            <FeedbackButton
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                                tooltipErrorMessage="This failed but at least it has a custom message"
                                tooltipSuccessMessage="This worked and has a custom message"
                            >
                                Custom message (fails)
                            </FeedbackButton>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="New (Button)" />
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Uncontrolled (feedback state depends on the promise)
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
                            <Button
                                variant="contained"
                                responsiveBehavior
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
                                responsiveBehavior
                                startIcon={<Add />}
                                feedbackBehavior
                                onClick={() => {
                                    return new Promise((_, reject) => setTimeout(reject, 500));
                                }}
                            >
                                This will fail
                            </Button>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            Controlled (feedback state depends on the props)
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
                            <Button
                                variant="contained"
                                responsiveBehavior
                                startIcon={<Add />}
                                feedbackBehavior={{
                                    state: thirdButtonState,
                                }}
                                onClick={() => {
                                    setThirdButtonState("loading");

                                    setTimeout(() => {
                                        setThirdButtonState("success");

                                        setTimeout(() => {
                                            setThirdButtonState("none");
                                        }, 2000);
                                    }, 1000);
                                }}
                            >
                                This will succeed
                            </Button>
                            <Button
                                variant="contained"
                                responsiveBehavior
                                startIcon={<Add />}
                                feedbackBehavior={{
                                    state: fourthButtonState,
                                }}
                                onClick={() => {
                                    setFourthButtonState("loading");

                                    setTimeout(() => {
                                        setFourthButtonState("error");

                                        setTimeout(() => {
                                            setFourthButtonState("none");
                                        }, 5000);
                                    }, 1000);
                                }}
                            >
                                This will fail
                            </Button>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            With custom messages and no icon
                        </Typography>
                        <Stack direction="row" gap={4} mb={8}>
                            <Button
                                variant="contained"
                                responsiveBehavior={{
                                    mobileIcon: <Add />,
                                }}
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
                                responsiveBehavior={{
                                    mobileIcon: <Add />,
                                }}
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
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        );
    },
};
