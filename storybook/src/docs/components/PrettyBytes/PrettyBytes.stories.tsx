import { PrettyBytes } from "@comet/admin";
import * as React from "react";

export default {
    title: "Docs/Components/PrettyBytes",
};

export const Basic = {
    render: () => {
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
    },
};

export const FixedUnit = {
    render: () => {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
                <span>6.000.000 Bytes</span>{" "}
                <span>
                    <PrettyBytes value={6000000} unit="kilobyte" />{" "}
                </span>
            </div>
        );
    },
};

export const CustomMaximumFractionDigits = {
    render: () => {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
                <span>6.000 Bytes</span>{" "}
                <span>
                    <PrettyBytes value={6000} unit="megabyte" maximumFractionDigits={4} />{" "}
                </span>
            </div>
        );
    },
};
