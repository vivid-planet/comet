import MuiSwitch, { type SwitchProps } from "@mui/material/Switch";
import { type FieldRenderProps } from "react-final-form";

export type FinalFormSwitchProps = SwitchProps & FieldRenderProps<string, HTMLInputElement>;

export const FinalFormSwitch = ({ input: { checked, name, onChange, ...restInput }, meta, ...rest }: FinalFormSwitchProps) => {
    return <MuiSwitch {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
