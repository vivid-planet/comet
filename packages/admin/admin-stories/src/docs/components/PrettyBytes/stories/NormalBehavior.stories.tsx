import { PrettyBytes } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/PrettyBytes/Normal Behavior", module).add("Normal Behavior", () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
            <span>6.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000} />{" "}
            </span>
            <span>6.000.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000000} />{" "}
            </span>
        </div>
    );
});
