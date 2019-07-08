import MuiTextField from "@material-ui/core/TextField";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> {}

export const TextField: React.SFC<IProps> = ({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => (
    <MuiTextField
        {...rest}
        name={name}
        helperText={meta.touched ? meta.error : undefined}
        error={meta.error && meta.touched}
        inputProps={restInput}
        onChange={onChange}
        value={value}
    />
);
