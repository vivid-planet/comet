<<<<<<< HEAD
import { FormControlLabel, type FormControlLabelProps } from "@mui/material";
=======
import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import { ReactNode } from "react";
>>>>>>> main

import { Field, type FieldProps } from "../Field";
import { FinalFormSwitch, type FinalFormSwitchProps } from "../Switch";

export interface SwitchFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: ReactNode;
    label?: ReactNode | ((checked?: boolean) => ReactNode);
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormSwitch?: FinalFormSwitchProps;
    };
}

export const SwitchField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: SwitchFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormSwitch: finalFormSwitchProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel
                    label={typeof label === "function" ? label(props.input.checked) : label}
                    control={<FinalFormSwitch {...props} {...finalFormSwitchProps} />}
                    {...formControlLabelProps}
                />
            )}
        </Field>
    );
};
