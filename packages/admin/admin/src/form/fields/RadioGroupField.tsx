import { FormControlLabel, RadioGroup } from "@mui/material";
import MuiRadio from "@mui/material/Radio";
import { type ReactNode } from "react";

import { Field, type FieldProps } from "../../form/Field";

type RadioGroupFieldOption<Value extends string> =
    | {
          label: ReactNode;
          value: Value;
          disabled?: boolean;
      }
    | string;

export type RadioGroupFieldProps<Value extends string> = FieldProps<Value, HTMLInputElement> & {
    options: RadioGroupFieldOption<Value>[];
    layout?: "row" | "column";
};

export const RadioGroupField = <Value extends string>({ options, layout = "row", ...restProps }: RadioGroupFieldProps<Value>) => {
    return (
        <Field<Value> {...restProps}>
            {({ input: { checked, value, onBlur, onFocus, ...restInput } }) => (
                <RadioGroup {...restInput} row={layout === "row"} value={value}>
                    {options.map((option) => {
                        const { value, label, disabled } = typeof option == "string" ? { value: option, label: option, disabled: false } : option;
                        return <FormControlLabel key={value} label={label} value={value} disabled={disabled} control={<MuiRadio />} />;
                    })}
                </RadioGroup>
            )}
        </Field>
    );
};
