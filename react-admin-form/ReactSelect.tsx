import {
    Async as ReactSelectAsync,
    AsyncCreatable as ReactSelectAsyncCreatable,
    Creatable as ReactSelectCreatable,
    Select as ReactSelect,
} from "@vivid-planet/react-admin-final-form-material-ui/ReactSelect";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Props as ReactSelectAsyncProps } from "react-select/lib/Async";
import { ControlProps } from "react-select/lib/components/Control";
import { Props as ReactSelectCreatableProps } from "react-select/lib/Creatable";
import { Props as ReactSelectProps } from "react-select/lib/Select";
import Input from "./Input";

// override the Control from @vivid-planet/react-admin-final-form-material-ui/ReactSelect with out own styled Input

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

function Control<OptionType>(props: ControlProps<OptionType>) {
    const InputProps = {
        inputComponent,
        inputProps: {
            className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
        },
    };
    return <Input fullWidth {...InputProps} {...props.selectProps.textFieldProps} />;
}

// tslint:disable:max-classes-per-file
export class Select<OptionType> extends React.Component<FieldRenderProps & ReactSelectProps<OptionType>> {
    public render() {
        const { components, ...rest } = this.props;
        return <ReactSelect {...rest} components={{ Control, ...components }} />;
    }
}
export class Async<OptionType> extends React.Component<FieldRenderProps & ReactSelectAsyncProps<OptionType>> {
    public render() {
        const { components, ...rest } = this.props;
        return <ReactSelectAsync {...rest} components={{ Control, ...components }} />;
    }
}
export class Creatable<OptionType> extends React.Component<FieldRenderProps & ReactSelectCreatableProps<OptionType>> {
    public render() {
        const { components, ...rest } = this.props;
        return <ReactSelectCreatable {...rest} components={{ Control, ...components }} />;
    }
}
export class AsyncCreatable<OptionType> extends React.Component<
    FieldRenderProps & ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { components, ...rest } = this.props;
        return <ReactSelectAsyncCreatable {...rest} components={{ Control, ...components }} />;
    }
}

export default Select;
