import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Props as ReactSelectAsyncProps } from "react-select/async";
import { Props as ReactSelectProps } from "react-select/base";
import { Props as ReactSelectCreatableProps } from "react-select/creatable";

import {
    ReactSelect as Select,
    ReactSelectAsync as Async,
    ReactSelectAsyncCreatable as AsyncCreatable,
    ReactSelectCreatable as Creatable,
} from "./ReactSelect";

// tslint:disable:max-classes-per-file
export class FinalFormReactSelect<OptionType> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Select<OptionType> {...input} {...rest} />;
    }
}
export class FinalFormReactSelectAsync<OptionType> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Async<OptionType> {...input} {...rest} />;
    }
}
export class FinalFormReactSelectCreatable<OptionType> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectCreatableProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <Creatable<OptionType> {...input} {...rest} />;
    }
}
export class FinalFormReactSelectAsyncCreatable<OptionType> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <AsyncCreatable<OptionType> {...input} {...rest} />;
    }
}
