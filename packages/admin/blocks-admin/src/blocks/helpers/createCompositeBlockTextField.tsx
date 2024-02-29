import { TextField, TextFieldProps } from "@comet/admin";
import * as React from "react";
import { FormProps } from "react-final-form";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options {
    defaultValue: string;
    formProps?: FormProps<Record<"value", string>, Record<"value", string>>;
    fieldProps?: Partial<TextFieldProps>;
}

export function createCompositeBlockTextField({ defaultValue, formProps, fieldProps }: Options) {
    return createCompositeSetting<string>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                {...formProps}
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <TextField name="value" {...fieldProps} />
            </BlocksFinalForm>
        ),
    });
}
