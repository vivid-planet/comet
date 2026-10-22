import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { Checkbox } from "@dextinity/ui";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { getToggleControlListLayout } from "./ToggleControlLayout";

type CheckboxListFieldOption<Value extends string> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

export type CheckboxListFieldProps<Value extends string> = FieldProps<[Value], HTMLInputElement> & {
    options: CheckboxListFieldOption<Value>[];
    layout?: "row" | "column";
};

export const CheckboxListField = <Value extends string>({ options, layout = "row", required, ...restProps }: CheckboxListFieldProps<Value>) => {
    return (
        <Field<[Value]> required={required} {...restProps}>
            {({ input: { value, onBlur, onFocus, onChange, name }, disabled }) => (
                <Options
                    layout={layout}
                    value={Array.isArray(value) ? value : []}
                    onValueChange={(newValue) => onChange(newValue.length > 0 ? newValue : undefined)}
                    allValues={options.map((option) => option.value)}
                    disabled={disabled}
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
                    {options.map((option) => (
                        // The item lets each checkbox take its name from its own label, not from the field's.
                        <BaseField.Item key={option.value} render={<span />}>
                            <Checkbox name={name} value={option.value} disabled={option.disabled}>
                                {option.label}
                            </Checkbox>
                        </BaseField.Item>
                    ))}
                </Options>
            )}
        </Field>
    );
};

const Options = styled(CheckboxGroup, { shouldForwardProp: (prop) => prop !== "layout" })<{ layout: "row" | "column" }>(({ layout }) =>
    getToggleControlListLayout(layout),
);
