import { SwitchField, type SwitchFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { type BlockMethods } from "../types";
import { createCompositeBlockField } from "./composeBlocks/createCompositeBlockField";

interface Options extends Partial<SwitchFieldProps<unknown>> {
    defaultValue?: boolean;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockSwitchField({ defaultValue = false, fullWidth = true, extractTextContents, ...fieldProps }: Options) {
    return createCompositeBlockField<boolean>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SwitchField name="value" fullWidth={fullWidth} {...fieldProps} />
            </BlocksFinalForm>
        ),
        extractTextContents: (state, options) => extractTextContents?.(state, options) ?? [],
    });
}
