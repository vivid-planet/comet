import MuiCheckbox, { type CheckboxProps } from "@mui/material/Checkbox";
import { type FieldRenderProps } from "react-final-form";

export type FinalFormCheckboxProps = FieldRenderProps<string, HTMLInputElement> & CheckboxProps;

/**
 * Final Form-compatible Checkbox component.
 *
 * @see {@link CheckboxField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormCheckbox = ({ input: { checked, name, onChange, ...restInput }, meta, ...rest }: FinalFormCheckboxProps) => {
    return <MuiCheckbox {...rest} name={name} inputProps={restInput} onChange={onChange} checked={checked} />;
};
