import MuiSwitch from "@material-ui/core/Switch";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps {}

const Switch: React.SFC<IProps> = ({ input: { checked, name, onChange, ...restInput }, meta, ...rest }) => {
    return <MuiSwitch {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
export default Switch;
