import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@dextinity/ui";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

import { Field, type FieldProps } from "../../form/Field";
import { getToggleControlListLayout } from "./ToggleControlLayout";

type RadioGroupFieldOption<Value extends string> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

export type RadioGroupFieldProps<Value extends string> = FieldProps<Value, HTMLInputElement> & {
    options: RadioGroupFieldOption<Value>[];
    layout?: "row" | "column";
};

export const RadioGroupField = <Value extends string>({ options, layout = "row", ...restProps }: RadioGroupFieldProps<Value>) => {
    return (
        <Field<Value> {...restProps}>
            {({ input: { value, name, onChange, onBlur, onFocus }, disabled, required }) => (
                <Options
                    layout={layout}
                    name={name}
                    value={value === "" ? null : value}
                    onValueChange={(newValue) => onChange(newValue)}
                    disabled={disabled}
                    required={required}
                    // Moving the focus between the options doesn't leave the field.
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            onBlur();
                        }
                    }}
                    onFocus={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            onFocus();
                        }
                    }}
                >
                    {options.map(({ value, label, disabled }) => (
                        <Radio key={value} value={value} disabled={disabled}>
                            {label}
                        </Radio>
                    ))}
                </Options>
            )}
        </Field>
    );
};

const Options = styled(RadioGroup, { shouldForwardProp: (prop) => prop !== "layout" })<{ layout: "row" | "column" }>(({ layout }) =>
    getToggleControlListLayout(layout),
);
