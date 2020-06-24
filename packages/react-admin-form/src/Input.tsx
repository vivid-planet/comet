import MuiInputBase, { InputBaseProps } from "@material-ui/core/InputBase";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export const Input: React.FunctionComponent<InputBaseProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>> = ({
    meta,
    input,
    innerRef,
    ...props
}) => <MuiInputBase {...input} {...props} />;
