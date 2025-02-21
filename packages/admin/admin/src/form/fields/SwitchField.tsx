import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import { ReactNode } from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormSwitch, FinalFormSwitchProps } from "../Switch";

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
