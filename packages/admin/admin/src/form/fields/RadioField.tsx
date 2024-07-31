import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormRadio, FinalFormRadioProps } from "../Radio";

export interface RadioFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormRadio?: FinalFormRadioProps;
    };
}

export const RadioField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: RadioFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormRadio: finalFormRadioProps } = componentsProps;
    return (
        <Field type="radio" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel label={label} control={<FinalFormRadio {...props} {...finalFormRadioProps} />} {...formControlLabelProps} />
            )}
        </Field>
    );
};
