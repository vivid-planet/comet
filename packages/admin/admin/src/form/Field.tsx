import { FieldValidator } from "final-form";
import { ComponentType, createElement, ReactNode, useRef } from "react";
import { Field as FinalFormField, FieldMetaState, FieldRenderProps, FormSpy, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FieldContainer, FieldContainerProps } from "./FieldContainer";
import { useFinalFormContext } from "./FinalFormContextProvider";

const requiredValidator = (value: any) => {
    if (value === undefined || value === null || value === false || value === "") {
        return <FormattedMessage id="comet.form.required" defaultMessage="Required" />;
    }
    return undefined;
};

const composeValidators =
    (...validators: Array<(value: any, allValues: object) => any>) =>
    (value: any, allValues: object) =>
        validators.reduce((error, validator) => error || validator(value, allValues), undefined);

export interface FieldProps<FieldValue = any, T extends HTMLElement = HTMLElement> {
    name: string;
    label?: ReactNode;
    helperText?: ReactNode;
    component?: ComponentType<any> | string;
    children?: (props: FieldRenderProps<FieldValue, T>) => ReactNode;
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
    helperText,
    required,
    validate,
    validateWarning,
    shouldShowError: passedShouldShowError,
    shouldShowWarning: passedShouldShowWarning,
    shouldScrollTo: passedShouldScrollTo,
    ...otherProps
}: FieldProps<FieldValue, FieldElement>) {
    const { disabled, variant, fullWidth } = otherProps;

    const { mutators, getFieldState } = useForm();
    const setFieldData = mutators.setFieldData as ((...args: any[]) => any) | undefined;
    const currentWarningValidationRound = useRef(0);

    const validateError = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;

    const finalFormContext = useFinalFormContext();
    const shouldShowError = passedShouldShowError ?? finalFormContext.shouldShowFieldError;
    const shouldShowWarning = passedShouldShowWarning ?? finalFormContext.shouldShowFieldWarning;
    const shouldScrollToField = passedShouldScrollTo ?? finalFormContext.shouldScrollToField;

    const keyRequired = required || validate ? 1 : 0;
    const keyValidate = validate ? 2 : 3;

    function renderField({
        input,
        meta,
        fieldContainerProps,
        ...rest
    }: FieldRenderProps<FieldValue, FieldElement> & { warning?: string; disabled?: boolean; required?: boolean }) {
        // fix for problem with conditional validation https://github.com/final-form/react-final-form/issues/980
        const formMeta = getFieldState(name);

        if (formMeta) {
            meta = formMeta;
        }
        function render() {
            if (component) {
                return createElement(component, { ...rest, input, meta });
            } else {
                if (typeof children !== "function") {
                    throw new Error(`Warning: Must specify either a render function as children, or a component prop to ${name}`);
                }
                return children({ input, meta, disabled, required });
            }
        }

        return (
            <FieldContainer
                label={label}
                required={required}
                disabled={disabled}
                error={(shouldShowError(meta) && meta.error) || meta.submitError}
                warning={shouldShowWarning(meta) && meta.data?.warning}
                helperText={helperText}
                variant={variant}
                fullWidth={fullWidth}
                scrollTo={shouldScrollToField(meta)}
                {...fieldContainerProps}
            >
                {render()}
            </FieldContainer>
        );
    }

    return (
        <>
            <FinalFormField<FieldValue, FieldElement, FieldValue, FieldRenderProps<FieldValue, FieldElement>>
                name={name}
                validate={validateError}
                required={required}
                {...otherProps}
                key={keyRequired + keyValidate}
            >
                {renderField}
            </FinalFormField>
            {validateWarning && (
                <FormSpy
                    subscription={{ values: true }}
                    onChange={async ({ values }) => {
                        if (!setFieldData) {
                            // eslint-disable-next-line no-console
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
