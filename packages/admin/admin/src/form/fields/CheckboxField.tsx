<<<<<<< HEAD
import { FormControlLabel, type FormControlLabelProps } from "@mui/material";
=======
import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import { ReactNode } from "react";
>>>>>>> main

import { FinalFormCheckbox, type FinalFormCheckboxProps } from "../Checkbox";
import { Field, type FieldProps } from "../Field";

export interface CheckboxFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: ReactNode;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormCheckbox?: FinalFormCheckboxProps;
    };
}

export const CheckboxField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormCheckbox: finalFormCheckboxProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel label={label} control={<FinalFormCheckbox {...props} {...finalFormCheckboxProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
};
