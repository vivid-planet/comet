import { PrettyBytes } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/components/PrettyBytes/Custom Maximum Fraction Digits",
};

export const CustomMaximumFractionDigits = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
            <span>6.000 Bytes</span>{" "}
            <span>
                <PrettyBytes value={6000} unit="megabyte" maximumFractionDigits={4} />{" "}
            </span>
        </div>
    );
};
