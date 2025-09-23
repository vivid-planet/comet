import { SelectField, type SelectFieldOption, type SelectFieldProps } from "@comet/admin";

type ElementType<T> = T extends (infer U)[] ? U : T;

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { type BlockMethods } from "../types";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options<T extends string | number | string[] | number[]> extends Partial<SelectFieldProps<ElementType<T>>> {
    defaultValue: T;
    options: Array<SelectFieldOption<ElementType<T>>>;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<SelectFieldProps<ElementType<T>>>;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockSelectField<T extends string | number | string[] | number[]>({
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
                <SelectField
                    name="value"
                    fullWidth={fullWidth}
                    {...legacyFieldProps}
                    {...fieldProps}
                    options={options}
                    multiple={Array.isArray(defaultValue)}
                />
            </BlocksFinalForm>
        ),
        extractTextContents: (state, options) => extractTextContents?.(state, options) ?? [],
    });
}
