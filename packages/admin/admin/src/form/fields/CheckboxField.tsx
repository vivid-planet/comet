import { Field as BaseField } from "@base-ui/react/field";
import type { CheckboxSlotProps } from "@dextinity/ui";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

import { FinalFormCheckbox, type FinalFormCheckboxProps } from "../Checkbox";
import { Field, type FieldProps } from "../Field";
import { toggleControlPadding } from "./ToggleControlLayout";

export interface CheckboxFieldProps extends FieldProps<string, HTMLInputElement> {
    fieldLabel?: ReactNode;
    componentsProps?: {
        /** Props for the label next to the checkbox. */
        formControlLabel?: CheckboxSlotProps["label"];
        finalFormCheckbox?: FinalFormCheckboxProps;
    };
}

export const CheckboxField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: CheckboxFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormCheckbox: finalFormCheckboxProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                // The item lets the control take its name from its own label, not from the field's.
                <BaseField.Item render={<span />}>
                    <Checkbox
                        {...props}
                        {...finalFormCheckboxProps}
                        slotProps={{ label: formControlLabelProps, ...finalFormCheckboxProps?.slotProps }}
                    >
                        {label}
                    </Checkbox>
                </BaseField.Item>
            )}
        </Field>
    );
};

const Checkbox = styled(FinalFormCheckbox)`
    ${toggleControlPadding}
`;
