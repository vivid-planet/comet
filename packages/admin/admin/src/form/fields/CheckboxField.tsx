import { FormControlLabel, type FormControlLabelProps } from "@mui/material";
import { type ReactNode } from "react";

import { FinalFormCheckbox, type FinalFormCheckboxProps } from "../Checkbox";
import { Field, type FieldProps } from "../Field";

export interface CheckboxFieldProps<FormValues> extends FieldProps<FormValues, string, HTMLInputElement> {
    fieldLabel?: ReactNode;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormCheckbox?: FinalFormCheckboxProps;
    };
}

export function CheckboxField<FormValues>({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps<FormValues>) {
    const { formControlLabel: formControlLabelProps, finalFormCheckbox: finalFormCheckboxProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel label={label} control={<FinalFormCheckbox {...props} {...finalFormCheckboxProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
}
