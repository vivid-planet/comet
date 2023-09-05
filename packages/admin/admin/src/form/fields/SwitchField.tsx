import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormSwitch, FinalFormSwitchProps } from "../Switch";

export interface SwitchFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormSwitch?: FinalFormSwitchProps;
    };
}

export const SwitchField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: SwitchFieldProps): React.ReactElement => {
    const { formControlLabel: formControlLabelProps, finalFormSwitch: finalFormSwitchProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel label={label} control={<FinalFormSwitch {...props} {...finalFormSwitchProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
};
