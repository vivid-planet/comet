import { SelectField, SelectFieldProps } from "@comet/admin";
import { MenuItem } from "@mui/material";
import * as React from "react";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options<T extends string | number> {
    defaultValue: T;
    options: Array<{ value: T; label: React.ReactNode }>;
    fieldProps?: Partial<SelectFieldProps<T>>;
}

export function createCompositeBlockSelectField<T extends string | number>({ defaultValue, fieldProps, options }: Options<T>) {
    return createCompositeSetting<T>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SelectField name="value" {...fieldProps}>
                    {options.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </SelectField>
            </BlocksFinalForm>
        ),
    });
}
