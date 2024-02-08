import { Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Small Chips
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="small" label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="small" disabled label="Filled Default Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" disabled color="primary" label="Filled Primary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" disabled color="secondary" label="Filled Secondary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" disabled variant="outlined" label="Outlined Default Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" disabled variant="outlined" color="primary" label="Outlined Primary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" disabled variant="outlined" color="secondary" label="Outlined Secondary Disabled" />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Medium Chips
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="medium" label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="medium" disabled label="Filled Default Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" disabled color="primary" label="Filled Primary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" disabled color="secondary" label="Filled Secondary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" disabled variant="outlined" label="Outlined Default Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" disabled variant="outlined" color="primary" label="Outlined Primary Disabled" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" disabled variant="outlined" color="secondary" label="Outlined Secondary Disabled" />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Small Chips - Clickable & Deletable
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="small" clickable label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" clickable color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" clickable color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" clickable variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" clickable variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" clickable variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="small" onDelete={() => {}} variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Medium Chips - Clickable & Deletable
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="medium" clickable label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" clickable color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" clickable color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" clickable variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" clickable variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" clickable variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} label="Filled Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} color="primary" label="Filled Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} color="secondary" label="Filled Secondary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} variant="outlined" label="Outlined Default" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} variant="outlined" color="primary" label="Outlined Primary" />
                        </Grid>
                        <Grid item>
                            <Chip size="medium" onDelete={() => {}} variant="outlined" color="secondary" label="Outlined Secondary" />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
}

storiesOf("@comet/admin/mui", module).add("Chip", () => <Story />);
