import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Color Picker/Color Picker", module).add("Color Picker", () => {
    return (
        <div style={{ minHeight: 350 }}>
            <Form
                initialValues={{ color: "#ff00ff" }}
                onSubmit={(values) => {
                    console.log("values: ", values);
                }}
            >
                {() => {
                    return <Field name="color" label="Color-Picker" type="text" component={FinalFormColorPicker} showPicker />;
                }}
            </Form>
        </div>
    );
});
