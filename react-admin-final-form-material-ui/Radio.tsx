import MuiRadio from "@material-ui/core/Radio";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps {}

const Radio: React.SFC<IProps> = ({ input: { checked, value, name, onChange, ...restInput }, meta, ...rest }) => (
    <MuiRadio {...rest} name={name} inputProps={restInput} onChange={onChange} checked={!!checked} value={value} />
);

export default Radio;
