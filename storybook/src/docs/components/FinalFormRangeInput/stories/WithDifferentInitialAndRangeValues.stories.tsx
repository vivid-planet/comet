import { Field, FinalFormRangeInput } from "@comet/admin";
import * as React from "react";
import { Form } from "react-final-form";

export default {
    title: "stories/components/Final Form Range Input/With Different Initial And Range Values",
};

export const WithDifferentInitialAndRangeValues = () => {
    return (
        <Form
            onSubmit={(values) => {
                // values
            }}
            initialValues={{ price: { min: 50, max: 80 } }}
            render={({ values, form, initialValues }) => <Field component={FinalFormRangeInput} name="price" min={20} max={150} />}
        />
    );
};
