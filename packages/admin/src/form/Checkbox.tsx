import MuiCheckbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormCheckboxProps = FieldRenderProps<string, HTMLInputElement> & CheckboxProps;

export const FinalFormCheckbox = ({
    input: { checked, name, onChange, ...restInput },
    meta,
    ...rest
}: FinalFormCheckboxProps): React.ReactElement => {
    return <MuiCheckbox {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
