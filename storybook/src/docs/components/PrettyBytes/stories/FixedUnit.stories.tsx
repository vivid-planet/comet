import { PrettyBytes } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/PrettyBytes/Fixed Unit", module).add("Fixed Unit", () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
            <span>6.000.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000000} unit="kilobyte" />{" "}
            </span>
        </div>
    );
});
