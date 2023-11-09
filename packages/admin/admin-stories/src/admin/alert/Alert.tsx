import { Alert } from "@comet/admin/lib/alert/Alerts";
import { Close } from "@comet/admin-icons";
import { PunchClock } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { storiesOf } from "@storybook/react";
import React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <Typography variant="h4">With Title</Typography>
            <Alert severity="info" title="Title" text="Notification Text" />
            <Alert severity="warning" title="Title" text="Notification Text" />
            <Alert severity="error" title="Title" text="Notification Text" />
            <Alert severity="success" title="Title" text="Notification Text" />
            <Typography variant="h4">Without Title</Typography>
            <Alert text="Notification Text" />
            <Typography variant="h4">Without Close Button</Typography>
            <Alert severity="success" title="Title" text="Notification Text" hideCloseButton />
            <Typography variant="h4">With Action Button</Typography>
            <Alert title="Title" text="Notification Text" action={{ text: "Action Title" }} />
            <Alert severity="warning" text="Notification Text" action={{ text: "Action Title" }} />
            <Typography variant="h4">With Custom Action Button Icon</Typography>
            <Alert severity="error" title="Title" text="Notification Text" action={{ text: "Undo", startIcon: <Close /> }} />
            <Alert severity="success" text="Notification Text" action={{ text: "Undo", startIcon: <PunchClock /> }} />
        </Stack>
    );
}

storiesOf("@comet/admin/alert/Alert", module).add("Alerts", () => <Story />);
