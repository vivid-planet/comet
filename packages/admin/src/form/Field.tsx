import { FieldValidator } from "final-form";
import * as React from "react";
import { Field as FinalFormField, FieldRenderProps, FormSpy, useForm } from "react-final-form";

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
    validate?: FieldValidator<FieldValue>;
    validateWarning?: FieldValidator<FieldValue>;
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
    validateWarning,
    ...otherProps
}: Props<FieldValue, FieldElement>): React.ReactElement {
    const { disabled, variant, fullWidth } = otherProps;

    const { mutators } = useForm();
    const setFieldData = mutators.setFieldData as ((...args: any[]) => any) | undefined;
    const currentWarningValidationRound = React.useRef(0);

    const validateError = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;

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
                warning={meta.touched && meta.data?.warning}
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
                        if (!setFieldData) {
                            console.warn(
                                `Can't perform validateWarning, as the setFieldData mutator is missing. Did you forget to add the mutator to the form?`,
                            );
                            return;
                        }

                        currentWarningValidationRound.current++;
                        const validationRound = currentWarningValidationRound.current;

                        const warning = await Promise.resolve(validateWarning(values[name], values));

                        if (currentWarningValidationRound.current > validationRound) {
                            // Another validation has been started, skip this one
                            return;
                        }

                        setFieldData(name, { warning });
                    }}
                />
            )}
        </>
    );
}
