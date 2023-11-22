import { OkayButton, SaveButton } from "@comet/admin";
import { Alert } from "@comet/admin/lib/alert/Alert";
import { ArrowRight, Close } from "@comet/admin-icons";
import { PunchClock } from "@mui/icons-material";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { storiesOf } from "@storybook/react";
import React from "react";

function Story() {
    return (
        <>
            <Typography variant="h3">Alert</Typography>
            <Typography>The default severity for alerts is info</Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" marginBottom={4}>
                        Default Versions? with Title
                    </Typography>
                    <Stack spacing={4} direction="row">
                        <div>
                            <Typography>Info</Typography>
                            <Alert
                                severity="info"
                                title="Title"
                                action={
                                    <Button variant="text" startIcon={<ArrowRight />}>
                                        Action Text
                                    </Button>
                                }
                            >
                                <Typography>Notification Text</Typography>
                            </Alert>
                        </div>

                        <Alert
                            severity="warning"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert
                            severity="error"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert
                            severity="success"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            <Typography>Notification Text</Typography>
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h4" marginBottom={4}>
                        Default Versions? without Title
                    </Typography>
                    <Stack spacing={4} direction="row" marginBottom={6}>
                        <Alert>
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert severity="warning">
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert severity="error">
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert severity="success">
                            <Typography>Notification Text</Typography>
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>

            <Stack spacing={4}>
                <Typography variant="h4">Without Close Button</Typography>
                <Alert title="Title" disableCloseButton>
                    <Typography>Notification Text</Typography>
                </Alert>
                <Alert severity="warning" disableCloseButton>
                    <Typography>Notification Text</Typography>
                </Alert>
                <Typography variant="h4">With Custom Actions</Typography>
                <Alert title="Title" action={<SaveButton />} />
                <Alert severity="warning" action={<OkayButton />} />
                <Typography variant="h4">Headline</Typography>
                <Alert severity="error" title="Title" action={<Close />} />
                <Alert severity="success" action={<PunchClock />} />
            </Stack>
        </>
    );
}

storiesOf("@comet/admin/alert/Alert", module).add("Alerts", () => <Story />);
