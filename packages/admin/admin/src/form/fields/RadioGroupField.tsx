import { FormControlLabel, RadioGroup } from "@mui/material";
import MuiRadio from "@mui/material/Radio";
import { ReactNode } from "react";

import { Field, FieldProps } from "../../form/Field";

type RadioGroupFieldOption<Value extends string> = {
    label: ReactNode;
    value: Value;
};

export type RadioGroupFieldProps<Value extends string> = FieldProps<Value, HTMLInputElement> & {
    options: RadioGroupFieldOption<Value>[];
    layout?: "row" | "column";
};

export const RadioGroupField = <Value extends string>({ options, layout = "row", ...restProps }: RadioGroupFieldProps<Value>) => {
    return (
        <Field<Value> {...restProps}>
            {({ input: { checked, value, onBlur, onFocus, ...restInput } }) => (
                <RadioGroup {...restInput} row={layout === "row"}>
                    {options.map(({ value, label }) => (
                        <FormControlLabel key={value} label={label} value={value} control={<MuiRadio />} />
                    ))}
                </RadioGroup>
            )}
        </Field>
    );
};
