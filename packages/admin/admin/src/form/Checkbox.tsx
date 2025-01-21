import MuiCheckbox, { CheckboxProps } from "@mui/material/Checkbox";
import { FieldRenderProps } from "react-final-form";

export type FinalFormCheckboxProps = FieldRenderProps<string, HTMLInputElement> & CheckboxProps;

/**
 * @deprecated Use CheckboxListField or CheckboxField instead
 */
export const FinalFormCheckbox = ({ input: { checked, name, onChange, ...restInput }, meta, ...rest }: FinalFormCheckboxProps) => {
    return <MuiCheckbox {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
