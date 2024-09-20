import { Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps } from "@mui/material";

import { Field, FieldProps } from "../Field";

export interface CheckboxFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: string;
    componentsProps?: {
        formControlLabel?: FormControlLabelProps;
        formCheckbox?: CheckboxProps;
    };
}

export const CheckboxField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps) => {
    const { formControlLabel: formControlLabelProps, formCheckbox: formCheckboxProps } = componentsProps;
    return (
        <Field label={fieldLabel} {...restProps}>
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
