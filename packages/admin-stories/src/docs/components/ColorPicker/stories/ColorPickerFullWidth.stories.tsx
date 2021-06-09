import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Color Picker/Full Width", module).add("full width", () => {
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
});
