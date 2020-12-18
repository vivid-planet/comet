import { SelectProps } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { Select } from "./Select";

interface IProps extends FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> {}

// SelectProps also has a input prop, which collides with final-form input
export const FinalFormSelect: React.FunctionComponent<IProps & Omit<SelectProps, "input">> = ({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    ...rest
}) => <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} />;
