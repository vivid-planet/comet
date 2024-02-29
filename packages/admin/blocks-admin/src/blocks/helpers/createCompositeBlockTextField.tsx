import { Field, FieldProps, FinalFormInput } from "@comet/admin";
import * as React from "react";
import { FormProps } from "react-final-form";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options {
    defaultValue: string;
    formProps?: FormProps<Record<"value", string>, Record<"value", string>>;
    fieldProps?: Partial<FieldProps<string, HTMLElement>>;
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
                <Field fullWidth name="value" type="text" component={FinalFormInput} {...fieldProps} />
            </BlocksFinalForm>
        ),
    });
}
