import {
    Async as ReactSelectAsync,
    AsyncCreatable as ReactSelectAsyncCreatable,
    Creatable as ReactSelectCreatable,
    Select as ReactSelect,
} from "@vivid-planet/material-ui-react-select";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Props as ReactSelectAsyncProps } from "react-select/lib/Async";
import { Props as ReactSelectCreatableProps } from "react-select/lib/Creatable";
import { Props as ReactSelectProps } from "react-select/lib/Select";

// tslint:disable:max-classes-per-file
export class Select<OptionType> extends React.Component<FieldRenderProps & ReactSelectProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <ReactSelect {...input} {...rest} />;
    }
}
export class Async<OptionType> extends React.Component<FieldRenderProps & ReactSelectAsyncProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <ReactSelectAsync {...input} {...rest} />;
    }
}
export class Creatable<OptionType> extends React.Component<FieldRenderProps & ReactSelectCreatableProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <ReactSelectCreatable {...input} {...rest} />;
    }
}
export class AsyncCreatable<OptionType> extends React.Component<
    FieldRenderProps & ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <ReactSelectAsyncCreatable {...input} {...rest} />;
    }
}
