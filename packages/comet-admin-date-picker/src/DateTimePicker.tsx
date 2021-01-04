import { WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as moment from "moment";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { FinalFormDatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import styles from "./TimePicker.styles";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    fullWidth?: boolean;
    placeholder?: string;
    timeLabel?: string;
}

const DateTimeField: React.FC<WithStyles<typeof styles, true> & IProps> = ({
    classes,
    theme,
    input,
    fullWidth = false,
    color = "default",
    meta,
    label,
    timeLabel,
    children,
    render,
    placeholder,
}) => {
    const intl = useIntl();
    const localeName = intl.locale;
    const { onChange, ...otherInput } = input;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    const onDateChange = (newDateValue: Date | null) => {
        if (!newDateValue) onChange(null);

        const newDateString = moment(newDateValue).format("YYYY-MM-DD");
        const currentValue = moment(input.value);

        if (currentValue.isValid()) {
            const currentTimeString = moment(input.value).format("HH:mm");
            const newDate = moment(`${newDateString} ${currentTimeString}`);
            onChange(newDate.toDate());
        } else {
            onChange(moment(newDateString).toDate());
        }
    };

    const onTimeChange = (newTimeValue: string | null) => {
        if (!newTimeValue) onChange(null);

        const currentValue = moment(input.value);
        const currentDateString = currentValue.isValid() ? currentValue.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
        const newDate = moment(`${currentDateString} ${newTimeValue}`);
        onChange(moment(newDate).toDate());
    };

    const momentValue = input.value && moment(input.value).isValid() ? moment(input.value) : null;
    console.log({ inVal: input.value, momentValue, str: momentValue?.toString(), isValid: momentValue?.isValid() });
    const dateStringValue: string = momentValue?.isValid() ? momentValue.format("YYYY-MM-DD") : "";
    const timeStringValue: string | null = momentValue?.isValid() ? momentValue.format("HH:mm") : null;

    return (
        <div className={"TODO: classes"}>
            <FinalFormDatePicker label={label} input={{ ...otherInput, onChange: onDateChange, value: dateStringValue }} meta={meta} />
            <TimePicker label={timeLabel} input={{ ...otherInput, onChange: onTimeChange, value: timeStringValue }} meta={meta} />
        </div>
    );
};

export const DateTimePicker = withStyles(styles, { name: "CometAdminDateTimePicker", withTheme: true })(DateTimeField);
