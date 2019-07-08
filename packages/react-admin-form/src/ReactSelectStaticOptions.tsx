import * as React from "react";
import { FieldInputProps, FieldMetaState, FieldRenderProps } from "react-final-form";
import { Props as ReactSelectProps } from "react-select/lib/Select";
import { OptionsType } from "react-select/lib/types";
import { ReactSelect } from "./ReactSelect";

interface IOptionType {
    value: string;
    label: string;
}

interface IProps extends FieldRenderProps<string, HTMLElement>, ReactSelectProps<IOptionType | undefined> {
    options: OptionsType<IOptionType>;
}
export class ReactSelectStaticOptions extends React.Component<IProps> {
    public render() {
        const { input, meta, ...rest } = this.props;

        const optionValue = this.props.options.find(({ value }) => value === this.props.input.value);
        const selectInput: FieldInputProps<IOptionType | undefined, HTMLElement> = {
            ...input,
            value: optionValue,
        };
        return (
            <ReactSelect<IOptionType | undefined>
                {...rest}
                input={selectInput}
                meta={meta}
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
