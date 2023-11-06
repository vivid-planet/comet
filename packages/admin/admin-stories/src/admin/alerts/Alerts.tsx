import { AdminComponentAlerts } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import React from "react";

function Story() {
    return (
        <>
            <AdminComponentAlerts severity="info" title="Title" text="Notification Text" />
            <br />
            <AdminComponentAlerts severity="warning" title="Title" text="Notification Text" />
            <br />
            <AdminComponentAlerts severity="error" title="Title" text="Notification Text" />
            <br />
            <AdminComponentAlerts severity="success" title="Title" text="Notification Text" />
            <br />
            <AdminComponentAlerts severity="success" text="Notification Text" />
        </>
    );
}

storiesOf("@comet/admin/alerts/Alerts", module).add("Alerts", () => <Story />);
