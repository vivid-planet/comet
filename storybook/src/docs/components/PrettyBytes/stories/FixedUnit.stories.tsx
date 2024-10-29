import { PrettyBytes } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/components/PrettyBytes/Fixed Unit",
};

export const FixedUnit = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
            <span>6.000.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000000} unit="kilobyte" />{" "}
            </span>
        </div>
    );
};
