import { AdminComponentAlerts } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <AdminComponentAlerts severity="info" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="warning" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="error" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="success" title="Title" text="Notification Text" />
            <AdminComponentAlerts severity="success" text="Notification Text" />
        </Stack>
    );
}

storiesOf("@comet/admin/alerts/Alerts", module).add("Alerts", () => <Story />);
