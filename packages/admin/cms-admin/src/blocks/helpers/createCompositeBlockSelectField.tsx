import { SelectField, type SelectFieldOption, type SelectFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { type BlockMethods } from "../types";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options<T extends string | number> extends Partial<SelectFieldProps<unknown, T>> {
    defaultValue: T;
    options: Array<SelectFieldOption<T>>;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<SelectFieldProps<unknown, T>>;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockSelectField<T extends string | number>({
    defaultValue,
    options,
    fullWidth = true,
    fieldProps: legacyFieldProps,
    extractTextContents,
    ...fieldProps
}: Options<T>) {
    return createCompositeBlockField<T>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SelectField name="value" fullWidth={fullWidth} {...legacyFieldProps} {...fieldProps} options={options} />
            </BlocksFinalForm>
        ),
        extractTextContents: (state, options) => extractTextContents?.(state, options) ?? [],
    });
}
