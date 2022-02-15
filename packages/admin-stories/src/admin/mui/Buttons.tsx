import { ArrowRight, ChevronDown, Clear, Edit, Favorite, MoreVertical, Save } from "@comet/admin-icons";
import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const ButtonsRow = ({ children }: { children: React.ReactNode[] }) => {
    return (
        <Box padding={4}>
            <Grid container spacing={4}>
                <>
                    {children.map((child, index: number) => (
                        <Grid item xs={3} key={index}>
                            {child}
                        </Grid>
                    ))}
                </>
            </Grid>
        </Box>
    );
};

export const Story: React.FC = () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant={"h2"} gutterBottom>
                            Contained buttons
                        </Typography>
                        <ButtonsRow>
                            <Button variant={"contained"} color={"primary"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} color={"secondary"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} disabled startIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant={"contained"} color={"primary"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} color={"secondary"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"contained"} disabled endIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant={"contained"} color={"primary"}>
                                Text
                            </Button>
                            <Button variant={"contained"} color={"secondary"}>
                                Text
                            </Button>
                            <Button variant={"contained"}>Text</Button>
                            <Button variant={"contained"} disabled>
                                Text
                            </Button>
                        </ButtonsRow>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant={"h2"} gutterBottom>
                            Button groups
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item>
                                <ButtonGroup variant="contained" color="primary">
                                    <Button startIcon={<Save />}>Button</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="contained" color="secondary">
                                    <Button startIcon={<Save />}>Button</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="contained">
                                    <Button startIcon={<Save />}>Button</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="contained" disabled>
                                    <Button startIcon={<Save />}>Button</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant={"h2"} gutterBottom>
                            Text buttons
                        </Typography>
                        <ButtonsRow>
                            <Button variant={"text"} color={"primary"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} color={"secondary"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} disabled startIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant={"text"} color={"primary"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} color={"secondary"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant={"text"} disabled endIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant={"text"} color={"primary"}>
                                Text
                            </Button>
                            <Button variant={"text"} color={"secondary"}>
                                Text
                            </Button>
                            <Button variant={"text"}>Text</Button>
                            <Button variant={"text"} disabled>
                                Text
                            </Button>
                        </ButtonsRow>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant={"h2"} gutterBottom>
                            Special button usage
                        </Typography>
                        <AppBar position={"relative"} style={{ padding: 20, backgroundColor: "black", color: "white", textAlign: "center" }}>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <Button variant={"text"} color={"inherit"} startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant={"text"} color={"inherit"} startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant={"text"} color={"inherit"} disabled startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                            </Grid>
                        </AppBar>
                        <Box padding={4}>
                            <Button variant={"text"} startIcon={<Favorite />}>
                                Aligned left
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} style={{ textAlign: "center" }}>
                            <Button variant={"text"} startIcon={<Favorite />}>
                                Centered
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} style={{ textAlign: "center" }}>
                            <Button variant={"text"} color={"primary"} startIcon={<Favorite />}>
                                Centered Blue
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} display={"flex"} justifyContent={"space-between"}>
                            <Button variant={"text"} startIcon={<Clear />}>
                                Cancel
                            </Button>
                            <Button variant={"contained"} color={"primary"} startIcon={<Save />}>
                                Save
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} display={"flex"} justifyContent={"space-between"}>
                            <Button variant={"text"} disabled startIcon={<Clear />}>
                                Cancel
                            </Button>
                            <Button variant={"contained"} disabled color={"primary"} startIcon={<Save />}>
                                Save
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Box padding={4}>
                            <Typography variant={"h2"} gutterBottom>
                                Icon buttons
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Foo</TableCell>
                                        <TableCell>Bar</TableCell>
                                        <TableCell align="right">Icon Buttons</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[...Array(3)].map((n, i) => (
                                        <TableRow key={i}>
                                            <TableCell component="th" scope="row">
                                                Lorem ipsum {i}
                                            </TableCell>
                                            <TableCell>Foo bar</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="large">
                                                    <Edit color={"primary"} />
                                                </IconButton>
                                                <IconButton size="large">
                                                    <Favorite />
                                                </IconButton>
                                                <IconButton size="large">
                                                    <MoreVertical />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

storiesOf("@comet/admin/mui", module)
    .addDecorator(storyRouterDecorator())
    .add("Buttons", () => <Story />);
