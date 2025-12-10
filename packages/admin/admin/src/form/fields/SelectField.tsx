import { MenuItem } from "@mui/material";
import { type ComponentProps, type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormSelect } from "../FinalFormSelect";

export type SelectFieldOption<Value extends string | number = string | number> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

type SelectFieldPropsToExtendFrom<Value extends string | number> = FieldProps<Value, HTMLSelectElement>;

// Remove `children` from the interface. Omit cannot be used here because `FieldProps` contains an index signature.
type SelectFieldPropsToExtendFromWithoutChildren<Value extends string | number> = {
    [K in keyof SelectFieldPropsToExtendFrom<Value> as K extends "children" ? never : K]: SelectFieldPropsToExtendFrom<Value>[K];
};

export interface SelectFieldProps<Value extends string | number> extends SelectFieldPropsToExtendFromWithoutChildren<Value> {
    children?: ReturnType<Required<SelectFieldPropsToExtendFrom<Value>>["children"]>;
    options?: SelectFieldOption<Value>[];
    componentsProps?: {
        finalFormSelect?: Partial<ComponentProps<typeof FinalFormSelect<Value>>>;
    };
    "data-testid"?: string;
}

export function SelectField<Value extends string | number>({
    componentsProps = {},
    children,
    options,
    "data-testid": dataTestid,
    ...restProps
}: SelectFieldProps<Value>) {
    const { finalFormSelect: finalFormSelectProps } = componentsProps;

    // Merge dataTestid into inputProps if provided
    const mergedFinalFormSelectProps = dataTestid
        ? {
              ...finalFormSelectProps,
              inputProps: {
                  ...finalFormSelectProps?.inputProps,
                  "data-testid": dataTestid,
              },
          }
        : finalFormSelectProps;

    return (
        <Field {...restProps}>
            {(props) => (
                <FinalFormSelect<Value> {...props} {...mergedFinalFormSelectProps}>
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
