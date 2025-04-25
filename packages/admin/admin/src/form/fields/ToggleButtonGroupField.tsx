import { type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { Button, Root } from "./ToggleButtonGroupField.sc";

export type ToggleButtonGroupFieldProps<FieldValue> = FieldProps<FieldValue, HTMLSelectElement> & {
    options: Array<{ value: FieldValue; label: ReactNode }>;
    optionsPerRow?: number;
};

/**
 * The `ToggleButtonGroupField` is a form field component intended to be used to switch between sections in a form.
 *
 * This is especially useful when the user needs to choose between different types
 * of input for the same conceptual field — for example, selecting between a physical address
 * form and a coordinate input form.
 */
export function ToggleButtonGroupField<FieldValue = unknown>({ options, optionsPerRow, ...restProps }: ToggleButtonGroupFieldProps<FieldValue>) {
    return (
        <Field {...restProps}>
            {(fieldProps) => {
                return (
                    <Root $optionsPerRow={optionsPerRow}>
                        {options.map(({ value: optionValue, label }, index) => (
                            <Button
                                key={index}
                                $selected={fieldProps.input.value === optionValue}
                                onClick={() => fieldProps.input.onChange(optionValue)}
                                focusRipple
                            >
                                {label}
                            </Button>
                        ))}
                    </Root>
                );
            }}
        </Field>
    );
}
