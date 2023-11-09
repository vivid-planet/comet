import { AdminComponentAlerts } from "@comet/admin";
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
            <AdminComponentAlerts severity="info" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="warning" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="error" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="success" title="Title" text="Notification Text" />
            <Typography variant="h4">Without Title</Typography>
            <AdminComponentAlerts text="Notification Text" />
            <Typography variant="h4">Without Close Button</Typography>
            <AdminComponentAlerts severity="success" title="Title" text="Notification Text" hideCloseButton />
            <Typography variant="h4">With Action Button</Typography>
            <AdminComponentAlerts title="Title" text="Notification Text" action={{ text: "Action Title" }} />
            <AdminComponentAlerts severity="warning" text="Notification Text" action={{ text: "Action Title" }} />
            <Typography variant="h4">With Custom Action Button Icon</Typography>
            <AdminComponentAlerts severity="error" title="Title" text="Notification Text" action={{ text: "Undo", startIcon: <Close /> }} />
            <AdminComponentAlerts severity="success" text="Notification Text" action={{ text: "Undo", startIcon: <PunchClock /> }} />
        </Stack>
    );
}

storiesOf("@comet/admin/alerts/Alerts", module).add("Alerts", () => <Story />);
