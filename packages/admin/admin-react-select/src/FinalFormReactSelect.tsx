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
export class FinalFormReactSelectAsync<OptionType, IsMulti extends boolean> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectAsyncProps<OptionType, IsMulti>
> {
    public render() {
        const { input, meta, ...rest } = this.props;

        return <Async<OptionType, boolean> {...input} {...rest} />;
    }
}
export class FinalFormReactSelectCreatable<OptionType, IsMulti extends boolean> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectCreatableProps<OptionType, IsMulti>
> {
    public render() {
        const { input, meta, ...rest } = this.props;

        return <Creatable<OptionType, boolean> {...input} {...rest} />;
    }
}
export class FinalFormReactSelectAsyncCreatable<OptionType, IsMulti extends boolean> extends React.Component<
    FieldRenderProps<OptionType | null, HTMLElement> & ReactSelectCreatableProps<OptionType, false> & ReactSelectAsyncProps<OptionType, IsMulti>
> {
    public render() {
        const { input, meta, ...rest } = this.props;
        return <AsyncCreatable<OptionType, boolean> {...input} {...rest} />;
    }
}
