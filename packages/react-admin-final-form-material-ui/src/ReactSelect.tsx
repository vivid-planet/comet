import {
    ReactSelect as Select,
    ReactSelectAsync as Async,
    ReactSelectAsyncCreatable as AsyncCreatable,
    ReactSelectCreatable as Creatable,
} from "@vivid-planet/material-ui-react-select";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Props as ReactSelectAsyncProps } from "react-select/lib/Async";
import { Props as ReactSelectCreatableProps } from "react-select/lib/Creatable";
import { Props as ReactSelectProps } from "react-select/lib/Select";

// tslint:disable:max-classes-per-file
export class ReactSelect<OptionType> extends React.Component<FieldRenderProps & ReactSelectProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Select {...input} {...rest} />;
    }
}
export class ReactSelectAsync<OptionType> extends React.Component<FieldRenderProps & ReactSelectAsyncProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Async {...input} {...rest} />;
    }
}
export class ReactSelectCreatable<OptionType> extends React.Component<FieldRenderProps & ReactSelectCreatableProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Creatable {...input} {...rest} />;
    }
}
export class ReactSelectAsyncCreatable<OptionType> extends React.Component<
    FieldRenderProps & ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <AsyncCreatable {...input} {...rest} />;
    }
}
