import MuiSwitch, { SwitchProps } from "@material-ui/core/Switch";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps<string, HTMLInputElement> {}

export const FinalFormSwitch: React.FunctionComponent<IProps & SwitchProps> = ({
    input: { checked, name, onChange, ...restInput },
    meta,
    ...rest
}) => {
    return <MuiSwitch {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
