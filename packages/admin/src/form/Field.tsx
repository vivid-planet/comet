import { FieldValidator } from "final-form";
import * as React from "react";
import { Field as FinalFormField, FieldMetaState, FieldRenderProps, FormSpy, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FieldContainer, FieldContainerProps } from "./FieldContainer";
import { useFinalFormContext } from "./FinalFormContextProvider";

const requiredValidator = (value: any) => (value ? undefined : <FormattedMessage id="cometAdmin.form.required" defaultMessage="Required" />);

const composeValidators =
    (...validators: Array<(value: any, allValues: object) => any>) =>
    (value: any, allValues: object) =>
        validators.reduce((error, validator) => error || validator(value, allValues), undefined);

export interface FieldProps<FieldValue = any, T extends HTMLElement = HTMLElement> {
    name: string;
    label?: React.ReactNode;
    component?: React.ComponentType<any> | string;
    children?: (props: FieldRenderProps<FieldValue, T>) => React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    validate?: FieldValidator<FieldValue>;
    validateWarning?: FieldValidator<FieldValue>;
    variant?: FieldContainerProps["variant"];
    shouldScrollTo?: (meta: FieldMetaState<FieldValue>) => boolean;
    shouldShowError?: (meta: FieldMetaState<FieldValue>) => boolean;
    shouldShowWarning?: (meta: FieldMetaState<FieldValue>) => boolean;
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
    shouldShowError: passedShouldShowError,
    shouldShowWarning: passedShouldShowWarning,
    shouldScrollTo: passedShouldScrollTo,
    ...otherProps
}: FieldProps<FieldValue, FieldElement>): React.ReactElement {
    const { disabled, variant, fullWidth } = otherProps;

    const { mutators } = useForm();
    const setFieldData = mutators.setFieldData as ((...args: any[]) => any) | undefined;
    const currentWarningValidationRound = React.useRef(0);

    const validateError = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;

    const finalFormContext = useFinalFormContext();
    const shouldShowError = passedShouldShowError || finalFormContext.shouldShowFieldError;
    const shouldShowWarning = passedShouldShowWarning || finalFormContext.shouldShowFieldWarning;
    const shouldScrollToField = passedShouldScrollTo || finalFormContext.shouldScrollToField;

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
                error={shouldShowError({ fieldMeta: meta }) && (meta.error || meta.submitError)}
                warning={shouldShowWarning({ fieldMeta: meta }) && meta.data?.warning}
                variant={variant}
                fullWidth={fullWidth}
                scrollTo={shouldScrollToField({ fieldMeta: meta })}
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
