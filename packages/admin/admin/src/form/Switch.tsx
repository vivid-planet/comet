import { Switch, type SwitchProps } from "@dextinity/ui";
import type { FieldRenderProps } from "react-final-form";

export type FinalFormSwitchProps = Omit<SwitchProps, "checked" | "defaultChecked" | "onCheckedChange"> & {
    /** @deprecated Has no effect: the switch comes in one size. */
    size?: "small" | "medium";
};

type FinalFormSwitchInternalProps = FieldRenderProps<string, HTMLInputElement>;

/**
 * Final Form-compatible Switch component.
 *
 * @see {@link SwitchField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormSwitch = ({
    input: { checked, name, onChange, onBlur, onFocus },
    meta,
    size,
    variant,
    fullWidth,
    ...rest
}: FinalFormSwitchProps & FinalFormSwitchInternalProps) => {
    return (
        <Switch
            {...rest}
            name={name}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            onCheckedChange={(checked) => onChange(checked)}
            checked={Boolean(checked)}
        />
    );
};
