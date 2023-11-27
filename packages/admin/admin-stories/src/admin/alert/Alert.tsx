import { OkayButton, SaveButton } from "@comet/admin";
import { Alert } from "@comet/admin/lib/alert/Alert";
import { ArrowRight } from "@comet/admin-icons";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { storiesOf } from "@storybook/react";
import React from "react";

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
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            Notification Text
                        </Alert>

                        <Alert
                            severity="warning"
                            title="Title"
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel vehicula est. Nunc congue velit sem, ac porttitor
                            massa semper nec. Proin quis volutpat magna. Mauris eget libero et mi imperdiet ultrices. Donec eget interdum odio.
                            Maecenas blandit ipsum et eros tempus porttitor. Aliquam erat volutpat.
                        </Alert>
                        <Alert
                            severity="error"
                            title="Title"
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="success"
                            title="Title"
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                        >
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
                        <Alert>Notification Text</Alert>
                        <Alert severity="warning">Notification Text</Alert>
                        <Alert severity="error">Notification Text</Alert>
                        <Alert
                            severity="success"
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
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
                        <Alert title="Title" disableCloseButton>
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert severity="warning" disableCloseButton>
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Alert
                            severity="warning"
                            button={
                                <Button variant="text" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            disableCloseButton
                        >
                            <Typography>Notification Text</Typography>
                        </Alert>
                        <Typography variant="h4">Other Actions</Typography>
                        <Alert title="Title" button={<SaveButton />}>
                            Text
                        </Alert>
                        <Alert severity="warning" button={<OkayButton />} />
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}

storiesOf("@comet/admin/alert/Alert", module).add("Alerts", () => <Story />);
