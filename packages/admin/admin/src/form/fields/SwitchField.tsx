import { Field as BaseField } from "@base-ui/react/field";
import type { SwitchSlotProps } from "@dextinity/ui";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormSwitch, type FinalFormSwitchProps } from "../Switch";
import { toggleControlPadding } from "./ToggleControlLayout";

export interface SwitchFieldProps extends Omit<FieldProps<string, HTMLInputElement>, "label"> {
    name: string;
    fieldLabel?: ReactNode;
    label?: ReactNode | ((checked?: boolean) => ReactNode);
    componentsProps?: {
        /** Props for the label next to the switch. */
        formControlLabel?: SwitchSlotProps["label"];
        finalFormSwitch?: FinalFormSwitchProps;
    };
}

export const SwitchField = ({ fieldLabel, label, componentsProps = {}, ...restProps }: SwitchFieldProps) => {
    const { formControlLabel: formControlLabelProps, finalFormSwitch: finalFormSwitchProps } = componentsProps;
    return (
        <Field type="checkbox" label={fieldLabel} {...restProps}>
            {(props) => (
                // The item lets the control take its name from its own label, not from the field's.
                <BaseField.Item render={<span />}>
                    <Switch {...props} {...finalFormSwitchProps} slotProps={{ label: formControlLabelProps, ...finalFormSwitchProps?.slotProps }}>
                        {typeof label === "function" ? label(props.input.checked) : label}
                    </Switch>
                </BaseField.Item>
            )}
        </Field>
    );
};

const Switch = styled(FinalFormSwitch)`
    ${toggleControlPadding}
`;
