import React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormSelect, FinalFormSelectProps } from "../FinalFormSelect";

type SelectFieldPropsToExtendFrom<Value extends string | number> = FieldProps<Value, HTMLSelectElement>;

// Remove `children` from the interface. Omit cannot be used here because `FieldProps` contains an index signature.
type SelectFieldPropsToExtendFromWithoutChildren<Value extends string | number> = {
    [K in keyof SelectFieldPropsToExtendFrom<Value> as K extends "children" ? never : K]: SelectFieldPropsToExtendFrom<Value>[K];
};

export interface SelectFieldProps<Value extends string | number> extends SelectFieldPropsToExtendFromWithoutChildren<Value> {
    children: ReturnType<Required<SelectFieldPropsToExtendFrom<Value>>["children"]>;
    componentsProps?: {
        finalFormSelect?: FinalFormSelectProps<Value>;
    };
}

export function SelectField<Value extends string | number>({ componentsProps = {}, children, ...restProps }: SelectFieldProps<Value>) {
    const { finalFormSelect: finalFormSelectProps } = componentsProps;
    return (
        <Field {...restProps}>
            {(props) => (
                <FinalFormSelect<Value> {...props} {...finalFormSelectProps}>
                    {children}
                </FinalFormSelect>
            )}
        </Field>
    );
}
