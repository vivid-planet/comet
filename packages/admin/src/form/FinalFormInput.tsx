import { InputBase, InputBaseProps } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormInputProps = InputBaseProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export function FinalFormInput({ meta, input, innerRef, ...props }: FinalFormInputProps): React.ReactElement {
    return <InputBase {...input} {...props} />;
}
