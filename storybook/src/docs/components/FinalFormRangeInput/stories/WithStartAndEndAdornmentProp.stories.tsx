import { Field, FinalFormRangeInput } from "@comet/admin";
import * as React from "react";
import { Form } from "react-final-form";

export default {
    title: "stories/components/Final Form Range Input/With Start And End Adornment Prop",
};

export const StartAdornment = () => {
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
};

export const EndAdornment = () => {
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
};
