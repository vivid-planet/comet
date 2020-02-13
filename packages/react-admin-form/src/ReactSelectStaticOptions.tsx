import * as React from "react";
import { FieldInputProps, FieldRenderProps } from "react-final-form";
import { Props as ReactSelectProps } from "react-select/base";
import { OptionsType } from "react-select/src/types";
import { ReactSelect } from "./ReactSelect";

interface IOptionType {
    value: string;
    label: string;
}

interface IProps extends FieldRenderProps<string, HTMLElement>, ReactSelectProps<IOptionType> {
    options: OptionsType<IOptionType>;
}
export class ReactSelectStaticOptions extends React.Component<IProps> {
    public render() {
        const { input, meta, ...rest } = this.props;

        const optionValue = this.props.options.find(({ value }) => value === this.props.input.value) || null;
        const selectInput: FieldInputProps<IOptionType | null, HTMLElement> = {
            ...input,
            value: optionValue,
        };
        return (
            <ReactSelect<IOptionType>
                {...rest}
                input={selectInput}
                meta={{
                    ...meta,
                    initial: this.props.options.find(({ value }) => value === meta.initial),
                }}
                getOptionLabel={this.getOptionLabel}
                getOptionValue={this.getOptionValue}
                onChange={this.onChange}
            />
        );
    }
    private getOptionLabel = ({ label }: IOptionType) => label;
    private getOptionValue = ({ value }: IOptionType) => value;
    private onChange = (v: IOptionType) => this.props.input.onChange(v ? v.value : null);
}
