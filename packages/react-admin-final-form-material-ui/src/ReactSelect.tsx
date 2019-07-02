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
export class ReactSelect<OptionType> extends React.Component<FieldRenderProps<OptionType, HTMLElement> & ReactSelectProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Select<OptionType> {...input} {...rest} />;
    }
}
export class ReactSelectAsync<OptionType> extends React.Component<FieldRenderProps<OptionType, HTMLElement> & ReactSelectAsyncProps<OptionType>> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Async<OptionType> {...input} {...rest} />;
    }
}
export class ReactSelectCreatable<OptionType> extends React.Component<
    FieldRenderProps<OptionType, HTMLElement> & ReactSelectCreatableProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Creatable<OptionType> {...input} {...rest} />;
    }
}
export class ReactSelectAsyncCreatable<OptionType> extends React.Component<
    FieldRenderProps<OptionType, HTMLElement> & ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <AsyncCreatable<OptionType> {...input} {...rest} />;
    }
}
