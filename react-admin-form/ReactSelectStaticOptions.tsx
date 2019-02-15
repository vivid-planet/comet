import ReactSelect from "@vivid-planet/react-admin-form/ReactSelect";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Props as ReactSelectProps } from "react-select/lib/Select";
import { OptionsType } from "react-select/lib/types";

interface IOptionType {
    value: string;
    label: string;
}

interface IProps extends FieldRenderProps, ReactSelectProps<IOptionType> {
    options: OptionsType<IOptionType>;
}
class ReactSelectStaticOptions extends React.Component<IProps> {
    public render() {
        return (
            <ReactSelect
                {...this.props}
                value={this.props.options.filter(({ value }) => value === this.props.input.value)}
                getOptionLabel={this.getOptionLabel}
                getOptionValue={this.getOptionValue}
                onChange={this.onChange}
            />
        );
    }
    private getOptionLabel = ({ label }: IOptionType) => label;
    private getOptionValue = ({ value }: IOptionType) => value;
    private onChange = ({ value }: IOptionType) => this.props.input.onChange(value);
}
export default ReactSelectStaticOptions;
