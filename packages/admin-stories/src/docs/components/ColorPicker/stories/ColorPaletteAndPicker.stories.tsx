import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { Favorite, Warning } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Color Picker/Color Palette and Color Picker", module)
    .add("Color Palette and Color Picker", () => {
        return (
            <div style={{ minHeight: 350 }}>
                <Form
                    initialValues={{ color: "crimson" }}
                    onSubmit={(values) => {
                        console.log("values: ", values);
                    }}
                >
                    {() => {
                        return (
                            <Field
                                name="color"
                                label="Color-Palette & Picker"
                                type="text"
                                component={FinalFormColorPicker}
                                showPicker
                                colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                            />
                        );
                    }}
                </Form>
            </div>
        );
    })
    .add("full width", () => {
        return (
            <div style={{ minHeight: 350 }}>
                <Form
                    initialValues={{ color: "crimson" }}
                    onSubmit={(values) => {
                        console.log("values: ", values);
                    }}
                >
                    {() => {
                        return (
                            <Field
                                name="color"
                                label="Color-Palette & Picker"
                                type="text"
                                component={FinalFormColorPicker}
                                showPicker
                                colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                                fullWidth
                            />
                        );
                    }}
                </Form>
            </div>
        );
    })
    .add("with clear button", () => {
        return (
            <div style={{ minHeight: 350 }}>
                <Form
                    initialValues={{ color: "crimson" }}
                    onSubmit={(values) => {
                        console.log("values: ", values);
                    }}
                >
                    {() => {
                        return (
                            <Field
                                name="color"
                                label="Color-Palette & Picker"
                                type="text"
                                component={FinalFormColorPicker}
                                showPicker
                                colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                                showClearButton
                            />
                        );
                    }}
                </Form>
            </div>
        );
    })
    .add("with icon", () => {
        return (
            <div style={{ minHeight: 350 }}>
                <Form
                    initialValues={{ color: "crimson" }}
                    onSubmit={(values) => {
                        console.log("values: ", values);
                    }}
                >
                    {() => {
                        return (
                            <Field
                                name="color"
                                label="Color-Palette & Picker"
                                type="text"
                                component={FinalFormColorPicker}
                                showPicker
                                colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                                endAdornment={<Favorite />}
                            />
                        );
                    }}
                </Form>
            </div>
        );
    })
    .add("with colored icon", () => {
        return (
            <div style={{ minHeight: 350 }}>
                <Form
                    initialValues={{ color: "crimson" }}
                    onSubmit={(values) => {
                        console.log("values: ", values);
                    }}
                >
                    {({ values }) => {
                        return (
                            <Field
                                name="color"
                                label="Color-Palette & Picker"
                                type="text"
                                component={FinalFormColorPicker}
                                showPicker
                                colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                                startAdornment={values.color ? <Favorite htmlColor={`#${values.color}`} /> : <Warning color={"disabled"} />}
                            />
                        );
                    }}
                </Form>
            </div>
        );
    });
