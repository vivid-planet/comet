import { PrettyBytes } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/components/PrettyBytes/Normal Behavior",
};

export const NormalBehavior = () => {
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
};
