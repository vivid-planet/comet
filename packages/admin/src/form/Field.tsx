import { FieldValidator } from "final-form";
import * as React from "react";
import { Field as FinalFormField, FieldRenderProps, FormSpy } from "react-final-form";

import { FieldContainer, FieldContainerThemeProps } from "./FieldContainer";

const requiredValidator = (value: any) => (value ? undefined : "Pflichtfeld");

const composeValidators = (...validators: Array<(value: any, allValues: object) => any>) => (value: any, allValues: object) =>
    validators.reduce((error, validator) => error || validator(value, allValues), undefined);

interface Props<FieldValue = any, T extends HTMLElement = HTMLElement> {
    name: string;
    label?: React.ReactNode;
    component?: React.ComponentType<any> | string;
    children?: (props: FieldRenderProps<FieldValue, T>) => React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    validate?: FieldValidator<FieldValue> | { error?: FieldValidator<FieldValue>; warning?: FieldValidator<FieldValue> };
    variant?: FieldContainerThemeProps["variant"];
    [otherProp: string]: any;
}

export function Field<FieldValue = any, FieldElement extends HTMLElement = HTMLElement>({
    children,
    component,
    name,
    label,
    required,
    validate,
    disabled,
    variant,
    fullWidth,
    ...otherProps
}: Props<FieldValue, FieldElement>): React.ReactElement {
    const [warning, setWarning] = React.useState<string | undefined>(undefined);

    let validateError: FieldValidator<FieldValue> | undefined;
    let validateWarning: FieldValidator<FieldValue> | undefined;

    if (validate) {
        if (typeof validate === "function") {
            validateError = required ? composeValidators(requiredValidator, validate) : validate;
        } else {
            validateError = required ? (validate.error ? composeValidators(requiredValidator, validate.error) : requiredValidator) : validate.error;
            validateWarning = validate.warning;
        }
    } else if (required) {
        validateError = requiredValidator;
    }

    function renderField({ input, meta, fieldContainerProps, ...rest }: FieldRenderProps<FieldValue, FieldElement> & { warning?: string }) {
        function render() {
            if (component) {
                return React.createElement(component, { ...rest, input, meta });
            } else {
                if (typeof children !== "function") {
                    throw new Error(`Warning: Must specify either a render function as children, or a component prop to ${name}`);
                }
                return children({ input, meta });
            }
        }
        return (
            <FieldContainer
                label={label}
                required={required}
                disabled={disabled}
                error={meta.touched && (meta.error || meta.submitError)}
                warning={meta.touched && warning}
                variant={variant}
                fullWidth={fullWidth}
            >
                {render()}
            </FieldContainer>
        );
    }

    return (
        <>
            <FinalFormField<FieldValue, FieldRenderProps<FieldValue, FieldElement>, FieldElement>
                name={name}
                validate={validateError}
                {...otherProps}
            >
                {renderField}
            </FinalFormField>
            {validateWarning && (
                <FormSpy
                    subscription={{ values: true }}
                    onChange={async ({ values }) => {
                        if (validateWarning) {
                            const warning = await Promise.resolve<string | undefined>(validateWarning(values[name], values));
                            setWarning(warning);
                        }
                    }}
                />
            )}
        </>
    );
}
