import { FormHelperText } from "@material-ui/core";
import * as React from "react";
import { Field as FinalFormField, FieldRenderProps } from "react-final-form";

import { FieldContainer } from "./FieldContainer";

const requiredValidator = (value: any) => (value ? undefined : "Pflichtfeld");

const composeValidators = (...validators: Array<(value: any, allValues: object) => any>) => (value: any, allValues: object) =>
    validators.reduce((error, validator) => error || validator(value, allValues), undefined);

interface IVividFieldProps<FieldValue = any, T extends HTMLElement = HTMLElement> {
    name: string;
    label?: string;
    component?: React.ComponentType<any> | string;
    children?: (props: FieldRenderProps<FieldValue, T>) => React.ReactNode;
    required?: boolean;
    validate?: (value: any, allValues: object) => any;
    fieldContainerComponent?: React.ComponentType<any>;
    [otherProp: string]: any;
}

export class Field<FieldValue = any, T extends HTMLElement = HTMLElement> extends React.Component<IVividFieldProps<FieldValue, T>> {
    public render() {
        const { children, component, name, label, required, validate, fieldContainerComponent, ...rest } = this.props;
        const composedValidate = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;
        return (
            <FinalFormField<FieldValue, FieldRenderProps<FieldValue, T>, T> name={name} validate={composedValidate} {...rest}>
                {this.renderField.bind(this)}
            </FinalFormField>
        );
    }

    private renderField({ input, meta, ...rest }: FieldRenderProps<FieldValue, T>) {
        const { children, component, name, label, required } = this.props;
        const UsedFieldContainer = this.props.fieldContainerComponent || FieldContainer;

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
            <UsedFieldContainer label={label} required={required}>
                {render()}
                {(meta.error || meta.submitError) && meta.touched && <FormHelperText error>{meta.error || meta.submitError}</FormHelperText>}
            </UsedFieldContainer>
        );
    }
}
