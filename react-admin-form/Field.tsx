import { Typography } from "@material-ui/core";
import * as React from "react";
import { Field as FinalFormField, FieldRenderProps, RenderableProps } from "react-final-form";
import FormField from "./FieldContainer";

const requiredValidator = (value: any) => (value ? undefined : "Pflichtfeld");

const composeValidators = (...validators: Array<(value: any, allValues: object) => any>) => (value: any, allValues: object) =>
    validators.reduce((error, validator) => error || validator(value, allValues), undefined);

interface IVividFieldProps {
    name: string;
    label?: string;
    component?: React.ComponentType<any> | string;
    children?: (props: FieldRenderProps) => React.ReactNode;
    required?: boolean;
    validate?: (value: any, allValues: object) => any;
    formFieldComponent?: React.ComponentType<any>;
    [otherProp: string]: any;
}
class Field extends React.Component<IVividFieldProps> {
    public render() {
        const { children, component, name, label, required, validate, ...rest } = this.props;
        const composedValidate = required ? (validate ? composeValidators(requiredValidator, validate) : requiredValidator) : validate;
        return (
            <FinalFormField name={name} validate={composedValidate} {...rest}>
                {this.renderField.bind(this)}
            </FinalFormField>
        );
    }

    private renderField({ input, meta, ...rest }: FieldRenderProps) {
        const { children, component, name, label, required } = this.props;
        const UsedFormField = this.props.formFieldComponent || FormField;

        if (component) {
            return (
                <UsedFormField label={label} required={required}>
                    {React.createElement(component, { ...rest, input, meta })}
                    {meta.error && meta.touched && <Typography color="error">{meta.error}</Typography>}
                </UsedFormField>
            );
        } else {
            if (typeof children !== "function") {
                throw new Error(`Warning: Must specify either a render function as children, or a component prop to ${name}`);
            }
            return children({ input, meta });
        }
    }
}
export default Field;
