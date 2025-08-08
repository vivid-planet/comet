import { FormControlLabel, RadioGroup } from "@mui/material";
import MuiRadio from "@mui/material/Radio";
import { type ReactNode } from "react";

import { Field, type FieldProps } from "../../form/Field";

type RadioGroupFieldOption<Value extends string> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

export type RadioGroupFieldProps<FormValues, Value extends string> = FieldProps<FormValues, Value, HTMLInputElement> & {
    options: RadioGroupFieldOption<Value>[];
    layout?: "row" | "column";
};

export const RadioGroupField = <FormValues, Value extends string>({
    options,
    layout = "row",
    ...restProps
}: RadioGroupFieldProps<FormValues, Value>) => {
    return (
        <Field<FormValues, Value> {...restProps}>
            {({ input: { checked, value, onBlur, onFocus, ...restInput } }) => (
                <RadioGroup {...restInput} row={layout === "row"} value={value}>
                    {options.map(({ value, label, disabled }) => (
                        <FormControlLabel key={value} label={label} value={value} disabled={disabled} control={<MuiRadio />} />
                    ))}
                </RadioGroup>
            )}
        </Field>
    );
};
