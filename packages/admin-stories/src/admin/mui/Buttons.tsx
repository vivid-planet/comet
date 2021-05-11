import { ArrowRight, ChevronDown, Clear, Edit, Favorite, MoreVertical, Save } from "@comet/admin-icons";
import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

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
                <Paper>
                    <Box padding={4}>
                        <Typography variant={"h2"}>Contained buttons</Typography>
                    </Box>
                    <ButtonsRow>
                        <Button variant={"contained"} color={"primary"} startIcon={<ArrowRight />}>
                            Text
                        </Button>
                        <Button variant={"contained"} color={"secondary"} startIcon={<ArrowRight />}>
                            Text
                        </Button>
                        <Button variant={"contained"} color={"default"} startIcon={<ArrowRight />}>
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
                        <Button variant={"contained"} color={"default"} endIcon={<ArrowRight />}>
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
                        <Button variant={"contained"} color={"default"}>
                            Text
                        </Button>
                        <Button variant={"contained"} disabled>
                            Text
                        </Button>
                    </ButtonsRow>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <Box padding={4}>
                        <Typography variant={"h2"}>Button groups</Typography>
                    </Box>
                    <Box padding={4}>
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
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <Box padding={4}>
                        <Typography variant={"h2"}>Text buttons</Typography>
                    </Box>
                    <ButtonsRow>
                        <Button variant={"text"} color={"primary"} startIcon={<ArrowRight />}>
                            Text
                        </Button>
                        <Button variant={"text"} color={"secondary"} startIcon={<ArrowRight />}>
                            Text
                        </Button>
                        <Button variant={"text"} color={"default"} startIcon={<ArrowRight />}>
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
                        <Button variant={"text"} color={"default"} endIcon={<ArrowRight />}>
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
                        <Button variant={"text"} color={"default"}>
                            Text
                        </Button>
                        <Button variant={"text"} disabled>
                            Text
                        </Button>
                    </ButtonsRow>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Box padding={4}>
                        <Typography variant={"h2"}>Special button usage</Typography>
                    </Box>
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
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Box padding={4}>
                        <Typography variant={"h2"}>Icon buttons</Typography>
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
                                            <IconButton>
                                                <Edit color={"primary"} />
                                            </IconButton>
                                            <IconButton>
                                                <Favorite />
                                            </IconButton>
                                            <IconButton>
                                                <MoreVertical />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

storiesOf("@comet/admin/mui", module)
    .addDecorator(StoryRouter())
    .add("Buttons", () => <Story />);
