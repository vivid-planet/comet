import { Field, FinalFormInput } from "@comet/admin";
import * as React from "react";
import { FormProps } from "react-final-form";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options {
    defaultValue: string;
    displayName?: string;
    fieldProps?: FormProps<Record<"value", string>, Record<"value", string>>;
}

export function createCompositeBlockTextField({ defaultValue, displayName, fieldProps }: Options) {
    return createCompositeSetting<string>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                {...fieldProps}
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <Field fullWidth name="value" type="text" label={displayName} component={FinalFormInput} />
            </BlocksFinalForm>
        ),
    });
}
