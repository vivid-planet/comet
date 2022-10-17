import { InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ClearInputAdornment } from "../common/ClearInputAdornment";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
    };

export function FinalFormInput({ meta, input, innerRef, endAdornment, clearable, ...props }: FinalFormInputProps): React.ReactElement {
    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                clearable ? (
                    <>
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                        {endAdornment}
                    </>
                ) : (
                    endAdornment
                )
            }
        />
    );
}
