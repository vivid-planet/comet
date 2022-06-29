import { ThreeDotSaving } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/Icons/Colors", module)
    .add("Default Color", () => {
        return <ThreeDotSaving />;
    })
    .add("Primary Color", () => {
        return <ThreeDotSaving color="primary" />;
    })
    .add("Secondary Color", () => {
        return <ThreeDotSaving color="secondary" />;
    })
    .add("Error Color", () => {
        return <ThreeDotSaving color="error" />;
    })
    .add("Disabled Color", () => {
        return <ThreeDotSaving color="disabled" />;
    })
    .add("Action Color", () => {
        return <ThreeDotSaving color="action" />;
    })
    .add("Custom Color", () => {
        return <ThreeDotSaving htmlColor="#ff00ff" />;
    });
