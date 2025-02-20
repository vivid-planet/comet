import { TextField, type TextFieldProps } from "@comet/admin";

<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/createCompositeBlockTextField.tsx
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";
=======
import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { BlockMethods } from "../types";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/createCompositeBlockTextField.tsx

interface Options extends Partial<TextFieldProps> {
    defaultValue?: string;
    /**
     * @deprecated Set the props directly instead of nesting inside fieldProps
     */
    fieldProps?: Partial<TextFieldProps>;
    extractTextContents?: BlockMethods["extractTextContents"];
}

<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/createCompositeBlockTextField.tsx
export function createCompositeBlockTextField({ defaultValue = "", fullWidth = true, fieldProps: legacyFieldProps, ...fieldProps }: Options) {
    return createCompositeBlockField<string>({
=======
export function createCompositeBlockTextField({ defaultValue = "", fieldProps: legacyFieldProps, extractTextContents, ...fieldProps }: Options) {
    return createCompositeSetting<string>({
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/createCompositeBlockTextField.tsx
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }>
                onSubmit={({ value }) => updateState(value ?? "")}
                initialValues={{ value: state || undefined }}
            >
                <TextField name="value" fullWidth={fullWidth} {...legacyFieldProps} {...fieldProps} />
            </BlocksFinalForm>
        ),
        extractTextContents,
    });
}
