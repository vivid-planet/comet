import { InputBaseProps } from "@material-ui/core/InputBase";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { Input } from "./Input";

export const FinalFormInput: React.FunctionComponent<InputBaseProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>> = ({
    meta,
    input,
    innerRef,
    ...props
}) => {
    return <Input {...input} {...props} />;
};
