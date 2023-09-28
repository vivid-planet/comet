import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import * as React from "react";

import { FinalFormCheckbox, FinalFormCheckboxProps } from "../Checkbox";
import { Field, FieldProps } from "../Field";

export interface CheckboxFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormCheckbox?: FinalFormCheckboxProps;
    };
}

export const CheckboxField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps): React.ReactElement => {
    const { formControlLabel: formControlLabelProps, finalFormCheckbox: finalFormCheckboxProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel label={label} control={<FinalFormCheckbox {...props} {...finalFormCheckboxProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
};
