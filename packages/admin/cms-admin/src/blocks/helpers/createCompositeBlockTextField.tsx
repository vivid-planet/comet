import { TextField, type TextFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options extends Partial<TextFieldProps> {
    defaultValue?: string;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<TextFieldProps>;
}

export function createCompositeBlockTextField({ defaultValue = "", fullWidth = true, fieldProps: legacyFieldProps, ...fieldProps }: Options) {
    return createCompositeBlockField<string>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <TextField name="value" fullWidth={fullWidth} {...legacyFieldProps} {...fieldProps} />
            </BlocksFinalForm>
        ),
    });
}
