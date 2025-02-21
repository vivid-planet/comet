import { SwitchField, SwitchFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { BlockMethods } from "../types";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options extends Partial<SwitchFieldProps> {
    defaultValue?: boolean;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockSwitchField({ defaultValue = false, fullWidth = true, extractTextContents, ...fieldProps }: Options) {
    return createCompositeSetting<boolean>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SwitchField name="value" fullWidth={fullWidth} {...fieldProps} />
            </BlocksFinalForm>
        ),
        extractTextContents: (state, options) => extractTextContents?.(state, options) ?? [],
    });
}
