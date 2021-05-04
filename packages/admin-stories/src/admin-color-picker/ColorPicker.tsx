import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { Favorite, Warning } from "@comet/admin-icons";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const initialFormValues = { color1: "#ff00ff", color2: "navy", color4: "lime", color5: "peachpuff", color6: "salmon", color7: "teal" };
const colorPalette1 = ["f94144", "f3722c", "f8961e", "f9844a", "f9c74f", "90be6d", "43aa8b", "4d908e", "577590", "277da1"];
const colorPalette2 = ["crimson", "cornsilk", "lightblue", "steelblue", "midnightblue", "orange"];

const Story = () => (
    <div style={{ width: 350 }}>
        <Form
            initialValues={initialFormValues}
            onSubmit={(values) => {
                console.log("values: ", values);
            }}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Field name="color1" label="Color-Picker" type="text" component={FinalFormColorPicker} showPicker />
                    <Field name="color2" label="Color-Palette" type="text" component={FinalFormColorPicker} colorPalette={colorPalette1} />
                    <Field
                        name="color3"
                        label="Color-Palette & Picker"
                        type="text"
                        component={FinalFormColorPicker}
                        showPicker
                        colorPalette={colorPalette2}
                    />
                    <Field
                        name="color4"
                        label="Color-Palette & Picker, full-width"
                        type="text"
                        component={FinalFormColorPicker}
                        showPicker
                        colorPalette={colorPalette2}
                        fullWidth
                    />
                    <Field
                        name="color5"
                        label="Color-Palette & Picker, with clear-button"
                        type="text"
                        component={FinalFormColorPicker}
                        showPicker
                        colorPalette={colorPalette2}
                        showClearButton
                    />
                    <Field
                        name="color6"
                        label="Color-Palette & Picker, with icon"
                        type="text"
                        component={FinalFormColorPicker}
                        showPicker
                        colorPalette={colorPalette2}
                        endAdornment={<Favorite />}
                    />
                    <Field
                        name="color7"
                        label="Color-Palette & Picker, colored icon"
                        type="text"
                        component={FinalFormColorPicker}
                        showPicker
                        colorPalette={colorPalette2}
                        startAdornment={values.color7 ? <Favorite htmlColor={`#${values.color7}`} /> : <Warning color={"disabled"} />}
                        showClearButton
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </form>
            )}
        />
    </div>
);

storiesOf("@comet/admin-color-picker", module).add("Color Picker", () => <Story />);
