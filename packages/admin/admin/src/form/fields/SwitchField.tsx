import { FormControlLabel, type FormControlLabelProps } from "@mui/material";
import { type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormSwitch, type FinalFormSwitchProps } from "../Switch";

export type SwitchFieldProps<FormValues> = Omit<FieldProps<FormValues, string, HTMLInputElement>, "label" | "name"> & {
    name: FieldProps<FormValues, string, HTMLInputElement>["name"];
    fieldLabel?: ReactNode;
    label?: ReactNode | ((checked?: boolean) => ReactNode);
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormSwitch?: FinalFormSwitchProps;
    };
};

export function SwitchField<FormValues>({ fieldLabel, label, componentsProps = {}, ...restProps }: SwitchFieldProps<FormValues>) {
    const { formControlLabel: formControlLabelProps, finalFormSwitch: finalFormSwitchProps } = componentsProps;
    return (
        <Field<FormValues> type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                <FormControlLabel
                    label={typeof label === "function" ? label(props.input.checked) : label}
                    control={<FinalFormSwitch {...props} {...finalFormSwitchProps} />}
                    {...formControlLabelProps}
                />
            )}
        </Field>
    );
}
