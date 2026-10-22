import { Checkbox, type CheckboxProps } from "@dextinity/ui";
import type { FieldRenderProps } from "react-final-form";

export type FinalFormCheckboxProps = Omit<CheckboxProps, "checked" | "defaultChecked" | "onCheckedChange"> & {
    /** @deprecated Has no effect: the checkbox comes in one size. */
    size?: "small" | "medium";
};

type FinalFormCheckboxInternalProps = FieldRenderProps<string, HTMLInputElement>;

/**
 * Final Form-compatible Checkbox component.
 *
 * @see {@link CheckboxField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormCheckbox = ({
    input: { checked, name, onChange, onBlur, onFocus },
    meta,
    size,
    variant,
    fullWidth,
    ...rest
}: FinalFormCheckboxProps & FinalFormCheckboxInternalProps) => {
    return (
        <Checkbox
            {...rest}
            name={name}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            onCheckedChange={(checked) => onChange(checked)}
            checked={Boolean(checked)}
        />
    );
};
