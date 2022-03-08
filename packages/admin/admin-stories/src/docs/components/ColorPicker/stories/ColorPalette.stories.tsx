import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Color Picker/Color Palette", module).add("Color Palette", () => {
    return (
        <div style={{ minHeight: 100 }}>
            <Form
                initialValues={{ color: "#f94144" }}
                onSubmit={(values) => {
                    console.log("values: ", values);
                }}
            >
                {() => {
                    return (
                        <Field
                            name="color"
                            label="Color-Palette"
                            type="text"
                            component={FinalFormColorPicker}
                            colorPalette={[
                                "#f94144",
                                "#f3722c",
                                "#f8961e",
                                "#f9844a",
                                "#f9c74f",
                                "#90be6d",
                                "#43aa8b",
                                "#4d908e",
                                "#577590",
                                "#277da1",
                            ]}
                        />
                    );
                }}
            </Form>
        </div>
    );
});
