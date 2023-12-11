import { OkayButton, SaveButton } from "@comet/admin";
import { Alert } from "@comet/admin/lib/alert/Alert";
import { ArrowRight } from "@comet/admin-icons";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { storiesOf } from "@storybook/react";
import React from "react";

function dummyOnClose(): string {
    return "";
}

function Story() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 50 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" marginBottom={4}>
                        With Title
                    </Typography>
                    <Stack spacing={4} direction="column">
                        <Alert
                            severity="info"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={dummyOnClose}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="warning"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={dummyOnClose}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel vehicula est. Nunc congue velit sem, ac porttitor
                            massa semper nec. Proin quis volutpat magna. Mauris eget libero et mi imperdiet ultrices. Donec eget interdum odio.
                            Maecenas blandit ipsum et eros tempus porttitor. Aliquam erat volutpat.
                        </Alert>
                        <Alert
                            severity="error"
                            title="Title"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={dummyOnClose}
                        >
                            Notification Text
                        </Alert>
                        <Alert severity="success" title="Title" onClose={dummyOnClose}>
                            Notification Text
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h4" marginBottom={4}>
                        Without Title
                    </Typography>
                    <Stack spacing={4} marginBottom={6}>
                        <Alert onClose={dummyOnClose}>Notification Text</Alert>
                        <Alert severity="warning" onClose={dummyOnClose}>
                            Notification Text
                        </Alert>
                        <Alert severity="error" onClose={dummyOnClose}>
                            Notification Text
                        </Alert>
                        <Alert
                            severity="success"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={dummyOnClose}
                        >
                            Notification Text
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack spacing={4}>
                        <Typography variant="h4">Without Close Button</Typography>
                        <Alert title="Title">
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert severity="warning">
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert
                            severity="warning"
                            action={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Typography variant="h4">Other Actions</Typography>
                        <Alert title="Title" action={<SaveButton />}>
                            Text
                        </Alert>
                        <Alert severity="warning" action={<OkayButton />} />
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}

storiesOf("@comet/admin/alert/Alert", module).add("Alerts", () => <Story />);
