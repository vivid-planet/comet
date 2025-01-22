import MuiRadio, { RadioProps } from "@mui/material/Radio";
import { FieldRenderProps } from "react-final-form";

export type FinalFormRadioProps = RadioProps & FieldRenderProps<string, HTMLInputElement>;
/**
 * @deprecated Use RadioGroupField instead
 */
export const FinalFormRadio = ({ input: { checked, value, name, onChange, ...restInput }, meta, ...rest }: FinalFormRadioProps) => (
    <MuiRadio {...rest} name={name} inputProps={restInput} onChange={onChange} checked={!!checked} value={value} />
);
