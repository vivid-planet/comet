import { Field, FinalFormRangeInput } from "@comet/admin";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import styled from "styled-components";

const Thumb = styled.div`
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
            <h1>Final Form Range Input</h1>
            <h3>with initialValues</h3>
            <div style={{ width: "400px", paddingBottom: "30px" }}>
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
                        </>
                    )}
                />
            </div>
            <div style={{ width: "400px", borderBottom: "1px solid grey" }} />
            <h3>without initialValues</h3>
            <div style={{ width: "400px", paddingBottom: "30px" }}>
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
                        </>
                    )}
                />
            </div>
            <div style={{ width: "400px", borderBottom: "1px solid grey" }} />
            <h3>with initialValues and different MinMax Values</h3>
            <div style={{ width: "400px", paddingBottom: "30px" }}>
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
                        </>
                    )}
                />
            </div>
        </>
    );
}

storiesOf("@comet/admin/form", module).add("Range Input", () => <Story />);
