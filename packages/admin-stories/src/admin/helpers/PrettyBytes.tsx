import { PrettyBytes } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const Story = () => {
    return (
        <div>
            <div>
                <h1>Normal Behavior</h1>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
                    <span>6 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6} />{" "}
                    </span>
                    <span>6.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000} />{" "}
                    </span>
                    <span>6.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000} />{" "}
                    </span>
                    <span>6.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000} />{" "}
                    </span>
                    <span>6.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000} />{" "}
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000000} />{" "}
                    </span>
                </div>
            </div>

            <div>
                <h1>Fixed Unit (kilobyte)</h1>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
                    <span>6 Bytes</span>
                    <span>
                        <PrettyBytes value={6} unit="kilobyte" />{" "}
                    </span>
                    <span>6.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000} unit="kilobyte" />{" "}
                    </span>
                    <span>6.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000} unit="kilobyte" />{" "}
                    </span>
                    <span>6.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000} unit="kilobyte" />{" "}
                    </span>
                    <span>6.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000} unit="kilobyte" />{" "}
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000000} unit="kilobyte" />{" "}
                    </span>
                </div>
            </div>

            <div>
                <h1>Custom maximumFractionDigits (5 digits)</h1>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px" }}>
                    <span>6 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                    <span>6.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                    <span>6.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                    <span>6.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                    <span>6.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>{" "}
                    <span>
                        <PrettyBytes value={6000000000000000} unit="megabyte" maximumFractionDigits={6} />{" "}
                    </span>
                </div>
            </div>
        </div>
    );
};

storiesOf("@comet/admin/helpers/pretty-bytes", module).add("PrettyBytes", () => <Story />);
