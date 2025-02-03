import { SelectField, SelectFieldOption, SelectFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options<T extends string | number> extends Partial<SelectFieldProps<T>> {
    defaultValue: T;
    options: Array<SelectFieldOption<T>>;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<SelectFieldProps<T>>;
}

export function createCompositeBlockSelectField<T extends string | number>({
    defaultValue,
    options,
    fullWidth = true,
    fieldProps: legacyFieldProps,
    ...fieldProps
}: Options<T>) {
    return createCompositeBlockField<T>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SelectField name="value" fullWidth={fullWidth} {...legacyFieldProps} {...fieldProps} options={options} />
            </BlocksFinalForm>
        ),
    });
}
