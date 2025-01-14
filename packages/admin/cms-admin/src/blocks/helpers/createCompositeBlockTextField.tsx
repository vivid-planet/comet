import { TextField, TextFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options {
    defaultValue?: string;
    fieldProps?: Partial<TextFieldProps>;
}

export function createCompositeBlockTextField({ defaultValue = "", fieldProps }: Options) {
    return createCompositeBlockField<string>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <TextField name="value" {...fieldProps} />
            </BlocksFinalForm>
        ),
    });
}
