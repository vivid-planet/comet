import { Field, FinalFormRangeInput } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Final Form Range Input/With Different Initial And Range Values", module).add(
    "With Different Initial And Range Values",
    () => {
        return (
            <Form
                onSubmit={(values) => {
                    // values
                }}
                initialValues={{ price: { min: 50, max: 80 } }}
                render={({ values, form, initialValues }) => <Field component={FinalFormRangeInput} name="price" min={20} max={150} />}
            />
        );
    },
);
