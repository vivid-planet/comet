import { TextField, TextFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { BlockMethods } from "../types";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options extends Partial<TextFieldProps> {
    defaultValue?: string;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<TextFieldProps>;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockTextField({ defaultValue = "", fieldProps: legacyFieldProps, extractTextContents, ...fieldProps }: Options) {
    return createCompositeSetting<string>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <TextField name="value" {...legacyFieldProps} {...fieldProps} />
            </BlocksFinalForm>
        ),
        extractTextContents,
    });
}
