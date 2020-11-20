import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> {}

export const TextField: React.FunctionComponent<IProps & TextFieldProps> = ({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => (
    <MuiTextField
        {...rest}
        name={name}
        error={(meta.error || meta.submitError) && meta.touched}
        inputProps={restInput}
        onChange={onChange}
        value={value}
    />
);
