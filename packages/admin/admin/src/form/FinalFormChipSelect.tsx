import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ChipSelect, ChipSelectProps } from "./ChipSelect";

export type FinalFormChipSelectProps<T> = Omit<ChipSelectProps<T>, "onChange"> & FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormChipSelect = <T = string,>({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    ...rest
}: FinalFormChipSelectProps<T>): React.ReactElement => {
    const selectProps = {
        ...restInput,
        value,
        onChange,
        onFocus,
        onBlur,
        name,
    };

    return <ChipSelect<T> {...rest} slotProps={{ select: { ...selectProps } }} onChange={onChange} selectedOption={value} />;
};
