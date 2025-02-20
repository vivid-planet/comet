import { SwitchField, type SwitchFieldProps } from "@comet/admin";

<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/createCompositeBlockSwitchField.tsx
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";
=======
import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { BlockMethods } from "../types";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/createCompositeBlockSwitchField.tsx

interface Options extends Partial<SwitchFieldProps> {
    defaultValue?: boolean;
    extractTextContents?: BlockMethods["extractTextContents"];
}

<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/createCompositeBlockSwitchField.tsx
export function createCompositeBlockSwitchField({ defaultValue = false, fullWidth = true, ...fieldProps }: Options) {
    return createCompositeBlockField<boolean>({
=======
export function createCompositeBlockSwitchField({ defaultValue = false, fullWidth = true, extractTextContents, ...fieldProps }: Options) {
    return createCompositeSetting<boolean>({
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/createCompositeBlockSwitchField.tsx
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SwitchField name="value" fullWidth={fullWidth} {...fieldProps} />
            </BlocksFinalForm>
        ),
        extractTextContents: (state, options) => extractTextContents?.(state, options) ?? [],
    });
}
