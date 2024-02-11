import { PrettyBytes } from "@comet/admin";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const Content = styled("div")`
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
`;

function Normal() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" gutterBottom>
                    Normal Behavior
                </Typography>
                <Content>
                    <span>0 Bytes</span>
                    <span>
                        <PrettyBytes value={0} />
                    </span>
                    <span>6 Bytes</span>
                    <span>
                        <PrettyBytes value={6} />
                    </span>
                    <span>6.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000} />
                    </span>
                    <span>6.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000} />
                    </span>
                    <span>6.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000} />
                    </span>
                    <span>6.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000} />
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000000} />
                    </span>
                </Content>
            </CardContent>
        </Card>
    );
}

function FixedUnit() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" gutterBottom>
                    Fixed Unit (kilobyte)
                </Typography>
                <Content>
                    <span>0 Bytes</span>
                    <span>
                        <PrettyBytes value={0} unit="kilobyte" />
                    </span>
                    <span>6 Bytes</span>
                    <span>
                        <PrettyBytes value={6} unit="kilobyte" />
                    </span>
                    <span>6.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000} unit="kilobyte" />
                    </span>
                    <span>6.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000} unit="kilobyte" />
                    </span>
                    <span>6.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000} unit="kilobyte" />
                    </span>
                    <span>6.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000} unit="kilobyte" />
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000000} unit="kilobyte" />
                    </span>
                </Content>
            </CardContent>
        </Card>
    );
}

function CustomMaximumFractionDigits() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" gutterBottom>
                    Custom maximumFractionDigits (6 digits)
                </Typography>
                <Content>
                    <span>0 Bytes</span>
                    <span>
                        <PrettyBytes value={0} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6 Bytes</span>
                    <span>
                        <PrettyBytes value={6} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                    <span>6.000.000.000.000.000 Bytes</span>
                    <span>
                        <PrettyBytes value={6000000000000000} unit="megabyte" maximumFractionDigits={6} />
                    </span>
                </Content>
            </CardContent>
        </Card>
    );
}

storiesOf("@comet/admin/helpers", module).add("PrettyBytes", () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Normal />
            </Grid>
            <Grid item xs={12}>
                <FixedUnit />
            </Grid>
            <Grid item xs={12}>
                <CustomMaximumFractionDigits />
            </Grid>
        </Grid>
    );
});
