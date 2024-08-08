import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";

import { Field, FieldProps } from "../Field";

type CheckboxGroupFieldOption<Value extends string> = {
    label: React.ReactNode;
    value: Value;
};

export type CheckboxGroupFieldProps<Value extends string> = FieldProps<[Value], HTMLInputElement> & {
    options: CheckboxGroupFieldOption<Value>[];
    layout?: "row" | "column";
};

export const CheckboxGroupField = <Value extends string>({ options, layout = "row", required, ...restProps }: CheckboxGroupFieldProps<Value>) => {
    return (
        <Field<[Value]> required={required} {...restProps}>
            {({ input: { value, onBlur, onFocus, onChange, name, ...restInput } }) => (
                <FormGroup row={layout === "row"} {...restInput}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            name={name}
                            onChange={(_, checked) => {
                                if (checked) {
                                    onChange([...value, option.value]);
                                } else if (value.length > 1) {
                                    onChange(value.filter((v) => v !== option.value));
                                } else {
                                    onChange(undefined);
                                }
                            }}
                            control={<Checkbox required={required} />}
                        />
                    ))}
                </FormGroup>
            )}
        </Field>
    );
};
