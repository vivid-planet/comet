import MuiSwitch, { SwitchProps } from "@material-ui/core/Switch";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormSwitchProps = SwitchProps & FieldRenderProps<string, HTMLInputElement>;

export const FinalFormSwitch = ({ input: { checked, name, onChange, ...restInput }, meta, ...rest }: FinalFormSwitchProps): React.ReactElement => {
    return <MuiSwitch {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
