import { Checkbox, FormControlLabel, FormControlLabelProps } from "@mui/material";
import { FinalFormCheckboxProps } from "form/Checkbox";

import { Field, FieldProps } from "../Field";

export interface CheckboxFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        finalFormCheckbox?: FinalFormCheckboxProps;
    };
}

export const CheckboxField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormCheckbox: formCheckboxProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {({ input: { value, onChange, name } }) => (
                <FormControlLabel
                    label={label}
                    value={restProps.name}
                    name={name}
                    onChange={(_, checked) => {
                        if (checked) {
                            onChange(true);
                        } else {
                            onChange(false);
                        }
                    }}
                    control={<Checkbox disabled={restProps.disabled} checked={Boolean(value)} required={restProps.required} {...formCheckboxProps} />}
                    {...formControlLabelProps}
                />
            )}
        </Field>
    );
};
