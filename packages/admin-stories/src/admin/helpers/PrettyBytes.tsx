import { FormPaper, PrettyBytes } from "@comet/admin";
import { Box, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("@comet/admin/helpers", module).add("PrettyBytes", () => {
    return (
        <div>
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Typography variant="h3" gutterBottom>
                        Normal Behavior
                    </Typography>
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
                </FormPaper>
            </Box>

            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Typography variant="h3" gutterBottom>
                        Fixed Unit (kilobyte)
                    </Typography>
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
                </FormPaper>
            </Box>

            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Typography variant="h3" gutterBottom>
                        Custom maximumFractionDigits (6 digits)
                    </Typography>
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
                </FormPaper>
            </Box>
        </div>
    );
});
