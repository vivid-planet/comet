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
import { styled } from "@mui/material/styles";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const ButtonsRow = styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(2)};
    margin-bottom: ${(props) => props.theme.spacing(4)};
`;

export const Story: React.FC = () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h2" gutterBottom>
                            Contained buttons
                        </Typography>
                        <ButtonsRow>
                            <Button variant="contained" startIcon={<ArrowRight />}>
                                Contained Primary
                            </Button>
                            <Button variant="contained" color="secondary" startIcon={<ArrowRight />}>
                                Contained Secondary
                            </Button>
                            <Button variant="contained" disabled startIcon={<ArrowRight />}>
                                Contained Disabled
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant="contained" endIcon={<ArrowRight />}>
                                Contained Primary
                            </Button>
                            <Button variant="contained" color="secondary" endIcon={<ArrowRight />}>
                                Contained Secondary
                            </Button>
                            <Button variant="contained" disabled endIcon={<ArrowRight />}>
                                Contained Disabled
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant="contained">Contained Primary</Button>
                            <Button variant="contained" color="secondary">
                                Contained Secondary
                            </Button>
                            <Button variant="contained" disabled>
                                Contained Disabled
                            </Button>
                        </ButtonsRow>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h2" gutterBottom>
                            Outlined buttons
                        </Typography>
                        <ButtonsRow>
                            <Button variant="outlined" startIcon={<ArrowRight />}>
                                Outlined Primary
                            </Button>
                            <Button variant="outlined" endIcon={<ArrowRight />}>
                                Outlined Primary
                            </Button>
                            <Button variant="outlined">Outlined Primary</Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant="outlined" startIcon={<ArrowRight />} disabled>
                                Outlined Disabled
                            </Button>
                            <Button variant="outlined" endIcon={<ArrowRight />} disabled>
                                Outlined Disabled
                            </Button>
                            <Button variant="outlined" disabled>
                                Outlined Disabled
                            </Button>
                        </ButtonsRow>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h2" gutterBottom>
                            Button groups
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item>
                                <ButtonGroup variant="contained">
                                    <Button startIcon={<Save />}>Contained Primary</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="contained" color="secondary">
                                    <Button startIcon={<Save />}>Contained Secondary</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="contained" disabled>
                                    <Button startIcon={<Save />}>Contained Disabled</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="outlined">
                                    <Button startIcon={<Save />}>Outlined Primary</Button>
                                    <Button>
                                        <ChevronDown />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup variant="outlined" disabled>
                                    <Button startIcon={<Save />}>Outlined Disabled</Button>
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
                        <Typography variant="h2" gutterBottom>
                            Text buttons
                        </Typography>
                        <ButtonsRow>
                            <Button variant="text" startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" color="secondary" startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" color="info" startIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" disabled startIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant="text" endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" color="secondary" endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" color="info" endIcon={<ArrowRight />}>
                                Text
                            </Button>
                            <Button variant="text" disabled endIcon={<ArrowRight />}>
                                Text
                            </Button>
                        </ButtonsRow>
                        <ButtonsRow>
                            <Button variant="text">Text</Button>
                            <Button variant="text" color="secondary">
                                Text
                            </Button>
                            <Button variant="text" color="info">
                                Text
                            </Button>
                            <Button variant="text" disabled>
                                Text
                            </Button>
                        </ButtonsRow>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h2" gutterBottom>
                            Special button usage
                        </Typography>
                        <AppBar position="relative" style={{ padding: 20, backgroundColor: "black", color: "white", textAlign: "center" }}>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <Button variant="text" color="inherit" startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="text" color="inherit" startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="text" color="inherit" disabled startIcon={<ArrowRight />}>
                                        Text
                                    </Button>
                                </Grid>
                            </Grid>
                        </AppBar>
                        <Box padding={4}>
                            <Button variant="text" color="info" startIcon={<Favorite />}>
                                Aligned left
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} style={{ textAlign: "center" }}>
                            <Button variant="text" color="info" startIcon={<Favorite />}>
                                Centered
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} style={{ textAlign: "center" }}>
                            <Button variant="text" startIcon={<Favorite />}>
                                Centered Blue
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} display="flex" justifyContent="space-between">
                            <Button variant="text" color="info" startIcon={<Clear />}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" startIcon={<Save />}>
                                Save
                            </Button>
                        </Box>
                        <Divider />
                        <Box padding={4} display="flex" justifyContent="space-between">
                            <Button variant="text" disabled startIcon={<Clear />}>
                                Cancel
                            </Button>
                            <Button variant="contained" disabled color="primary" startIcon={<Save />}>
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
                            <Typography variant="h2" gutterBottom>
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
                                                <IconButton size="large" color="primary">
                                                    <Edit />
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
