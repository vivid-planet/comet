import { type FieldValidator } from "final-form";
import { type ComponentType, createElement, type ReactNode, useRef } from "react";
import { Field as FinalFormField, type FieldMetaState, type FieldRenderProps, FormSpy, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FieldContainer, type FieldContainerProps } from "./FieldContainer";
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

/**
 * Type that extracts all possible paths from a type, handling nested objects with dot notation
 */
export type FilePath<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? T[K] extends Array<any>
                  ? K | `${K}[${number}]` | `${K}[${number}].${FilePath<T[K][number]>}`
                  : T[K] extends object
                    ? K | `${K}.${FilePath<T[K]>}`
                    : K
              : never;
      }[keyof T]
    : never;

export interface FieldProps<FormValues = any, FieldValue = any, T extends HTMLElement = HTMLElement> {
    name: FilePath<FormValues>;
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

export function Field<FormValues = any, FieldValue = any, FieldElement extends HTMLElement = HTMLElement>({
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
}: FieldProps<FormValues, FieldValue, FieldElement>) {
    const { disabled, variant, fullWidth } = otherProps;

    const { mutators } = useForm();
    const setFieldData = mutators.setFieldData as ((...args: any[]) => any) | undefined;
    const currentWarningValidationRound = useRef(0);

    const validateError = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;

    const finalFormContext = useFinalFormContext();
    const shouldShowError = passedShouldShowError ?? finalFormContext.shouldShowFieldError;
    const shouldShowWarning = passedShouldShowWarning ?? finalFormContext.shouldShowFieldWarning;
    const shouldScrollToField = passedShouldScrollTo ?? finalFormContext.shouldScrollToField;

    function renderField({
        input,
        meta,
        fieldContainerProps,
        ...rest
    }: FieldRenderProps<FieldValue, FieldElement> & { warning?: string; disabled?: boolean; required?: boolean }) {
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
                error={shouldShowError(meta) && (meta.error || meta.submitError)}
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
