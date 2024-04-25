import { ChevronDown } from "@comet/admin-icons";
import { Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Chips
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Medium
                    </Typography>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                variant="outlined"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                variant="outlined"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                variant="outlined"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                variant="outlined"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                color="primary"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                color="primary"
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="primary"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="primary"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                color="success"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="success"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="success"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="success"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                color="error"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="error"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="error"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="error"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                color="warning"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="warning"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="warning"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                color="warning"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h4" gutterBottom>
                        Small
                    </Typography>

                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                variant="outlined"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                variant="outlined"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                variant="outlined"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                variant="outlined"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                color="primary"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                clickable
                                color="primary"
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                icon={<ChevronDown />}
                                clickable
                                color="primary"
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="primary"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                color="success"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="success"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="success"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="success"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                color="error"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="error"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="error"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="error"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} my={5}>
                        <Grid item>
                            <Chip
                                size="small"
                                color="warning"
                                label="Normal"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="warning"
                                clickable
                                label="Clickable"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="warning"
                                icon={<ChevronDown />}
                                clickable
                                label="With Icon"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
                                color="warning"
                                label="Disabled"
                                onDelete={() => {
                                    console.log("Delete");
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
}

storiesOf("@comet/admin/mui", module).add("Chip", () => <Story />);
