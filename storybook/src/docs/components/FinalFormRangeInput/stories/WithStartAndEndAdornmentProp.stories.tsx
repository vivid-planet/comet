import { Field, FinalFormRangeInput } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Final Form Range Input/With Start And End Adornment Prop", module)
    .add("Start Adornment", () => {
        return (
            <Form
                onSubmit={(values) => {
                    // values
                }}
                initialValues={{ price: { min: 0, max: 100 } }}
                render={({ handleSubmit, values, form, initialValues }) => (
                    <Field component={FinalFormRangeInput} name="price" min={0} max={100} startAdornment={<span>€</span>} />
                )}
            />
        );
    })
    .add("End Adornment", () => {
        return (
            <Form
                onSubmit={(values) => {
                    // values
                }}
                initialValues={{ price: { min: 0, max: 100 } }}
                render={({ handleSubmit, values, form, initialValues }) => (
                    <Field component={FinalFormRangeInput} name="price" min={0} max={100} endAdornment={<span>€</span>} />
                )}
            />
        );
    });
