import { SelectField, SelectFieldProps } from "@comet/admin";
import { MenuItem } from "@mui/material";
import { ReactNode } from "react";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options<T extends string | number> extends Partial<SelectFieldProps<T>> {
    defaultValue: T;
    options: Array<{ value: T; label: ReactNode }>;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<SelectFieldProps<T>>;
}

export function createCompositeBlockSelectField<T extends string | number>({
    defaultValue,
    options,
    fieldProps: legacyFieldProps,
    ...fieldProps
}: Options<T>) {
    return createCompositeSetting<T>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SelectField name="value" {...legacyFieldProps} {...fieldProps}>
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
