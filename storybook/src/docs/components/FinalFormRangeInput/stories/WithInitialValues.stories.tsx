import { Field, FinalFormRangeInput } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Final Form Range Input/With Initial Values", module).add("With Initial Values", () => {
    return (
        <Form
            onSubmit={(values) => {
                // values
            }}
            initialValues={{ price: { min: 0, max: 100 } }}
            render={({ handleSubmit, values, form, initialValues }) => <Field component={FinalFormRangeInput} name="price" min={0} max={100} />}
        />
    );
});
