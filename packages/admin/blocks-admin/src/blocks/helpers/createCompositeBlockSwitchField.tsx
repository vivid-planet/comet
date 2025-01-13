import { SwitchField, SwitchFieldProps } from "@comet/admin";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { createCompositeSetting } from "./composeBlocks/createCompositeSetting";

interface Options extends Partial<SwitchFieldProps> {
    defaultValue?: boolean;
}

export function createCompositeBlockSwitchField({ defaultValue = false, fullWidth = true, ...fieldProps }: Options) {
    return createCompositeSetting<boolean>({
        defaultValue,
        AdminComponent: ({ state, updateState }) => (
            <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                <SwitchField name="value" fullWidth={fullWidth} {...fieldProps} />
            </BlocksFinalForm>
        ),
    });
}
