import { SelectField } from "@comet/admin";
import { MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { BlocksFinalForm } from "../../../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../../../iframebridge/SelectPreviewComponent";
import { createBlockSkeleton } from "../../helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "../../types";

export interface SpaceBlockFactoryOptions<T> {
    name?: string;
    defaultValue: T;
    options: { value: T; label: React.ReactNode }[];
}

export const createSpaceBlock = <T extends string | number>({
    name = "Space",
    defaultValue,
    options,
}: SpaceBlockFactoryOptions<T>): BlockInterface => {
    const SpaceBlock: BlockInterface<{ spacing: T }, { spacing: T }, { spacing: T }> = {
        ...createBlockSkeleton(),

        name,

        displayName: <FormattedMessage id="comet.blocks.space" defaultMessage="Space" />,

        category: BlockCategory.Layout,

        defaultValues: () => ({ spacing: defaultValue }),

        AdminComponent: ({ state, updateState }) => {
            return (
                <SelectPreviewComponent>
                    <BlocksFinalForm<{ spacing: T }> onSubmit={updateState} initialValues={state}>
                        <SelectField name="spacing" fullWidth>
                            {options.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </BlocksFinalForm>
                </SelectPreviewComponent>
            );
        },

        previewContent: ({ spacing }) => {
            return [{ type: "text", content: options.find((option) => option.value === spacing)?.label }];
        },
    };

    return SpaceBlock;
};
