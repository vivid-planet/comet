import { PrettyBytes } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/PrettyBytes/Custom Maximum Fraction Digits", module).add("Custom Maximum Fraction Digits", () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
            <span>6.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000} unit="megabyte" maximumFractionDigits={4} />{" "}
            </span>
        </div>
    );
});
