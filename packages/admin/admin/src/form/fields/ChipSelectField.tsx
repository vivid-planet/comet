import React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormChipSelect, FinalFormChipSelectProps } from "../FinalFormChipSelect";

type ChipSelectFieldPropsToExtendFrom<Value extends string | number> = FieldProps<Value, HTMLSelectElement>;

// Remove `children` from the interface. Omit cannot be used here because `FieldProps` contains an index signature.
type ChipSelectFieldPropsToExtendFromWithoutChildren<Value extends string | number> = {
    [K in keyof ChipSelectFieldPropsToExtendFrom<Value> as K extends "children" ? never : K]: ChipSelectFieldPropsToExtendFrom<Value>[K];
};

export interface ChipSelectFieldProps<Value extends string | number> extends ChipSelectFieldPropsToExtendFromWithoutChildren<Value> {
    children: ReturnType<Required<ChipSelectFieldPropsToExtendFrom<Value>>["children"]>;
    fullWidth?: boolean;
    componentsProps?: {
        finalFormChipSelect?: Partial<FinalFormChipSelectProps<Value>>;
    };
}

export function ChipSelectField<Value extends string | number>({
    componentsProps = {},
    children,
    fullWidth,
    ...restProps
}: ChipSelectFieldProps<Value>) {
    const { finalFormChipSelect: finalFormChipSelect } = componentsProps;
    return (
        <Field fullWidth={fullWidth} {...restProps}>
            {(props) => (
                <FinalFormChipSelect<Value> {...props} {...{ ...finalFormChipSelect, fullWidth }}>
                    {children}
                </FinalFormChipSelect>
            )}
        </Field>
    );
}
