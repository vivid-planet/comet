import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { ColorPicker } from "@vivid-planet/react-admin-color-picker";
import { Field } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => (
    <div style={{ width: "500px" }}>
        <Form
            initialValues={{ colorPicker: "#ff00ff", colorPickerPalette: "navy" }}
            onSubmit={values => {
                // tslint:disable-next-line: no-console
                console.log("values: ", values);
            }}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <Field name="colorPicker" label="Color-Picker" type="text" fullWidth component={ColorPicker} showPicker />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <Field
                            name="colorPalette"
                            label="Color-Palette"
                            type="text"
                            fullWidth
                            component={ColorPicker}
                            colorPalette={["f94144", "f3722c", "f8961e", "f9844a", "f9c74f", "90be6d", "43aa8b", "4d908e", "577590", "277da1"]}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <Field
                            name="colorPickerPalette"
                            label="Color-Palette &amp; Picker"
                            type="text"
                            fullWidth
                            component={ColorPicker}
                            showPicker
                            colorPalette={["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"]}
                            pickerWidth={300}
                        />
                    </div>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </form>
            )}
        />
    </div>
);

storiesOf("react-admin-color-picker", module).add("Color Picker", () => <Story />);
