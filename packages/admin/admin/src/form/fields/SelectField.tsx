import { MenuItem } from "@mui/material";
import { type ComponentProps, type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormSelect } from "../FinalFormSelect";

export type SelectFieldOption<Value extends string | number = string | number> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

type SelectFieldPropsToExtendFrom<FormValues, Value extends string | number> = FieldProps<FormValues, Value, HTMLSelectElement>;

// Remove `children` from the interface. Omit cannot be used here because `FieldProps` contains an index signature.
type SelectFieldPropsToExtendFromWithoutChildren<FormValues, Value extends string | number> = {
    [K in keyof SelectFieldPropsToExtendFrom<FormValues, Value> as K extends "children" ? never : K]: SelectFieldPropsToExtendFrom<
        FormValues,
        Value
    >[K];
};

export interface SelectFieldProps<FormValues, Value extends string | number> extends SelectFieldPropsToExtendFromWithoutChildren<FormValues, Value> {
    children?: ReturnType<Required<SelectFieldPropsToExtendFrom<FormValues, Value>>["children"]>;
    options?: SelectFieldOption<Value>[];
    componentsProps?: {
        finalFormSelect?: Partial<ComponentProps<typeof FinalFormSelect<Value>>>;
    };
}

export function SelectField<FormValues, Value extends string | number>({
    componentsProps = {},
    children,
    options,
    ...restProps
}: SelectFieldProps<FormValues, Value>) {
    const { finalFormSelect: finalFormSelectProps } = componentsProps;
    return (
        <Field {...restProps}>
            {(props) => (
                <FinalFormSelect<Value> {...props} {...finalFormSelectProps}>
                    {children
                        ? children
                        : options?.map(({ label, value, disabled }) => (
                              <MenuItem key={value} value={value} disabled={disabled}>
                                  {label}
                              </MenuItem>
                          ))}
                </FinalFormSelect>
            )}
        </Field>
    );
}
