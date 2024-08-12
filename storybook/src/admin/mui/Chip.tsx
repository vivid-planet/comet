import { ChevronDown } from "@comet/admin-icons";
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { boolean, select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography variant="h3" mb={10}>
                        Chips
                    </Typography>
                    <Box mb={10}>
                        <Typography variant="h4" gutterBottom>
                            Customizable Chip
                        </Typography>
                        <Typography gutterBottom variant="body2">
                            Use the story knobs to customize the props of the Chip below.
                        </Typography>
                        <Chip
                            label="Customizable Chip"
                            color={select("Color", ["default", "primary", "secondary", "success", "error", "warning"], "default")}
                            variant={select("Variant", ["filled", "outlined"], "filled")}
                            size={select("Size", ["small", "medium"], "medium")}
                            disabled={boolean("Disabled", false)}
                            clickable={boolean("Clickable", false)}
                            icon={boolean("Icon", false) ? <ChevronDown /> : undefined}
                            onDelete={boolean("Deletable", false) ? () => console.log("Delete") : undefined}
                        />
                    </Box>
                    <Box mb={10}>
                        <Typography variant="h4" gutterBottom>
                            Medium size Chips
                        </Typography>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip variant="outlined" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip variant="outlined" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip variant="outlined" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip variant="outlined" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    variant="outlined"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip color="primary" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip clickable color="primary" label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip color="primary" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip color="primary" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    color="primary"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip color="success" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip color="success" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip color="success" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip color="success" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    color="success"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip color="error" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip color="error" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip color="error" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip color="error" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    color="error"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip color="warning" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip color="warning" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip color="warning" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip color="warning" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    color="warning"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="h4" gutterBottom>
                        Small size Chips
                    </Typography>
                    <Box mb={10}>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" variant="outlined" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" variant="outlined" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" variant="outlined" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" variant="outlined" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" color="primary" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" clickable color="primary" label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" icon={<ChevronDown />} clickable color="primary" label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="primary" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" color="success" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="success" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="success" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="success" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="success"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" color="error" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="error" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="error" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="error" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="error"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={5}>
                            <Grid item>
                                <Chip size="small" color="warning" label="Normal" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="warning" clickable label="Clickable" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="warning" icon={<ChevronDown />} clickable label="With Icon" />
                            </Grid>
                            <Grid item>
                                <Chip size="small" color="warning" label="Disabled" disabled />
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="warning"
                                    label="Deletable"
                                    onDelete={() => {
                                        console.log("Delete");
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
}

storiesOf("@comet/admin/mui", module).add("Chip", () => <Story />);
