import { TextField, TextFieldProps } from "@comet/admin";
import * as React from "react";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options {
    defaultValue: string;
    fieldProps?: Partial<TextFieldProps>;
}

export function createCompositeBlockTextField({ defaultValue, fieldProps }: Options) {
    return createCompositeSetting<string>({
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
