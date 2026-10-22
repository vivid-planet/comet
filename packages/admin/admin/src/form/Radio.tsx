import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio, type RadioProps } from "@dextinity/ui";
import type { FieldRenderProps } from "react-final-form";

export type FinalFormRadioProps = Omit<RadioProps<string>, "value"> & FieldRenderProps<string, HTMLInputElement>;

/**
 * Final Form-compatible Radio component, for a `Field` with `type="radio"` and a `value`.
 *
 * @see {@link RadioGroupField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormRadio = ({
    input: { checked, value, name, onChange, onBlur, onFocus },
    meta,
    variant,
    fullWidth,
    ...rest
}: FinalFormRadioProps) => (
    // A Radio needs a group, which holds its checked state. Each radio of such a field is its own Field, so it gets a group of its own.
    <BaseRadioGroup
        name={name}
        value={checked ? value : null}
        onValueChange={() => onChange(value)}
        onBlur={() => onBlur()}
        onFocus={() => onFocus()}
        disabled={rest.disabled}
        render={<span />}
    >
        <Radio {...rest} value={value} />
    </BaseRadioGroup>
);
