import { Checkbox, FormControlLabel, FormGroup, styled } from "@mui/material";
import { ReactNode } from "react";

import { Field, FieldProps } from "../Field";

type CheckboxListFieldOption<Value extends string> = {
    label: ReactNode;
    value: Value;
    disabled?: boolean;
};

export type CheckboxListFieldProps<Value extends string> = FieldProps<[Value], HTMLInputElement> & {
    options: CheckboxListFieldOption<Value>[];
    layout?: "row" | "column";
};

export const CheckboxListField = <Value extends string>({ options, layout = "row", required, ...restProps }: CheckboxListFieldProps<Value>) => {
    return (
        <Field<[Value]> required={required} {...restProps}>
            {({ input: { value, onBlur, onFocus, onChange, name, ...restInput } }) => (
                <ItemsContainer row={layout === "row"} {...restInput}>
                    {options.map((option) => (
                        <Label
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            disabled={option.disabled}
                            name={name}
                            onChange={(_, checked) => {
                                if (checked) {
                                    onChange([...value, option.value]);
                                } else if (value.length > 1) {
                                    onChange(value.filter((v) => v !== option.value));
                                } else {
                                    onChange(undefined);
                                }
                            }}
                            control={<Checkbox required={required} />}
                        />
                    ))}
                </ItemsContainer>
            )}
        </Field>
    );
};

const ItemsContainer = styled(FormGroup)`
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    background: magenta;
`;

const Label = styled(FormControlLabel)`
    margin-right: ${({ theme }) => theme.spacing(4)};
    margin-top: 0;
    margin-bottom: 0;
    min-height: 40px;

    .CometAdminFormFieldContainer-horizontal &,
    .CometAdminFormFieldContainer-vertical & {
        margin-bottom: ${({ theme }) => theme.spacing(-2)};
    }
`;
