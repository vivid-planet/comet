import { Field, FinalFormRangeInput, Toolbar, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, Card, CardContent, styled, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Thumb = styled("div")`
    && {
        margin-top: -9px;
        height: 20px;
        width: 20px;

        &:hover {
            box-shadow: none;
        }

        &:after {
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(-45deg);
            display: inline-block;
            position: relative;
            padding: 2px;
            content: "";
            left: -1px;
            top: 0;
        }

        &[data-index="1"] {
            &:after {
                transform: rotate(135deg);
                left: 1px;
            }
        }
    }
`;

function Story() {
    return (
        <>
            <Box marginBottom={4}>
                <Toolbar>
                    <ToolbarTitleItem>Final Form Range Input</ToolbarTitleItem>
                </Toolbar>
            </Box>
            <div style={{ width: 400 }}>
                <Box marginBottom={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h3" gutterBottom>
                                with initialValues
                            </Typography>
                            <Form
                                onSubmit={(values) => {
                                    // values
                                }}
                                initialValues={{ price: { min: 0, max: 100 } }}
                                render={({ handleSubmit, values, form, initialValues }) => (
                                    <>
                                        <Field
                                            component={FinalFormRangeInput}
                                            name="price"
                                            min={0}
                                            max={100}
                                            endAdornment={<span>€</span>}
                                            sliderProps={{ ThumbComponent: Thumb }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                form.reset();
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <pre>{JSON.stringify(values, undefined, 2)}</pre>
                                    </>
                                )}
                            />
                        </CardContent>
                    </Card>
                </Box>

                <Box marginBottom={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h3" gutterBottom>
                                without initialValues
                            </Typography>
                            <Form
                                onSubmit={(values) => {
                                    // values
                                }}
                                render={({ values, form }) => (
                                    <>
                                        <Field
                                            component={FinalFormRangeInput}
                                            name="price"
                                            min={0}
                                            max={150}
                                            endAdornment={<span>€</span>}
                                            sliderProps={{ ThumbComponent: Thumb }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                form.reset();
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <pre>{JSON.stringify(values, undefined, 2)}</pre>
                                    </>
                                )}
                            />
                        </CardContent>
                    </Card>
                </Box>
                <Box marginBottom={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h3" gutterBottom>
                                with initialValues and different MinMax Values
                            </Typography>
                            <Form
                                onSubmit={(values) => {
                                    // values
                                }}
                                initialValues={{ price: { min: 50, max: 80 } }}
                                render={({ values, form, initialValues }) => (
                                    <>
                                        <Field
                                            component={FinalFormRangeInput}
                                            name="price"
                                            min={20}
                                            max={150}
                                            endAdornment={<span>€</span>}
                                            sliderProps={{ ThumbComponent: Thumb }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                form.reset();
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <pre>{JSON.stringify(values, undefined, 2)}</pre>
                                    </>
                                )}
                            />
                        </CardContent>
                    </Card>
                </Box>
            </div>
        </>
    );
}

storiesOf("@comet/admin/form", module).add("Range Input", () => <Story />);
