import { ArrowRight } from "@comet/admin-icons";
import { Card, CardContent, Typography } from "@mui/material";
import { Stack } from "@mui/system";

import { Button } from "../../common/buttons/Button";
import { OkayButton } from "../../common/buttons/okay/OkayButton";
import { SaveButton } from "../../common/buttons/SaveButton";
import { Alert } from "../Alert";

export default {
    title: "components/alert/Alert",
};

export const Alerts = () => {
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
                                <Button variant="textDark" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={() => {
                                // noop
                            }}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="warning"
                            title="Title"
                            action={
                                <Button variant="textDark" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={() => {
                                // noop
                            }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel vehicula est. Nunc congue velit sem, ac porttitor
                            massa semper nec. Proin quis volutpat magna. Mauris eget libero et mi imperdiet ultrices. Donec eget interdum odio.
                            Maecenas blandit ipsum et eros tempus porttitor. Aliquam erat volutpat.
                        </Alert>
                        <Alert
                            severity="error"
                            title="Title"
                            action={
                                <Button variant="textDark" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={() => {
                                // noop
                            }}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="success"
                            title="Title"
                            onClose={() => {
                                // noop
                            }}
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
                        <Alert
                            onClose={() => {
                                // noop
                            }}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="warning"
                            onClose={() => {
                                // noop
                            }}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="error"
                            onClose={() => {
                                // noop
                            }}
                        >
                            Notification Text
                        </Alert>
                        <Alert
                            severity="success"
                            action={
                                <Button variant="textDark" startIcon={<ArrowRight />}>
                                    Action Text
                                </Button>
                            }
                            onClose={() => {
                                // noop
                            }}
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
                                <Button variant="textDark" startIcon={<ArrowRight />}>
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
};
