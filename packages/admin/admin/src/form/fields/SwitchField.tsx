import { FormControlLabel, type FormControlLabelProps } from "@mui/material";

import { Field, type FieldProps } from "../Field";
import { FinalFormSwitch, type FinalFormSwitchProps } from "../Switch";

export interface SwitchFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
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
                <FormControlLabel label={label} control={<FinalFormSwitch {...props} {...finalFormSwitchProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
};
