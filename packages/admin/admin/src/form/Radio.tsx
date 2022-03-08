import MuiRadio, { RadioProps } from "@material-ui/core/Radio";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormRadioProps = RadioProps & FieldRenderProps<string, HTMLInputElement>;

export const FinalFormRadio = ({
    input: { checked, value, name, onChange, ...restInput },
    meta,
    ...rest
}: FinalFormRadioProps): React.ReactElement => (
    <MuiRadio {...rest} name={name} inputProps={restInput} onChange={onChange} checked={!!checked} value={value} />
);
