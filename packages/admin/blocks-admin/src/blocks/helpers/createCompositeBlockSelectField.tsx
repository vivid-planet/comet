import { Field, FieldProps, FinalFormSelect } from "@comet/admin";
import { MenuItem } from "@mui/material";
import * as React from "react";
import { FormProps } from "react-final-form";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options<T extends string | number> {
    defaultValue: T;
    options: Array<{ value: T; label: React.ReactNode }>;
    formProps?: Partial<FormProps<Record<"value", T>, Record<"value", T>>>;
    fieldProps?: Partial<FieldProps<T, HTMLElement>>;
}

export function createCompositeBlockSelectField<T extends string | number>({ defaultValue, formProps, fieldProps, options }: Options<T>) {
    return createCompositeSetting<T>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }} {...formProps}>
                <Field name="value" {...fieldProps}>
                    {(props) => (
                        <FinalFormSelect {...props}>
                            {options.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </FinalFormSelect>
                    )}
                </Field>
            </BlocksFinalForm>
        ),
    });
}
