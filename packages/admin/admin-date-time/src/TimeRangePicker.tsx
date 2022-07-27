import { ComponentsOverrides, FormControl, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { FormatDateOptions, FormattedMessage } from "react-intl";

import { TimePicker, TimePickerProps } from "./TimePicker";

export type TimeRange = {
    start: string;
    end: string;
};

export type TimeRangePickerIndividualPickerProps = Omit<TimePickerProps, "onChange" | "onBlur" | "value" | "className" | "inputRef">;

export interface TimeRangePickerComponentsProps {
    startPicker?: TimeRangePickerIndividualPickerProps;
    endPicker?: TimeRangePickerIndividualPickerProps;
}

export interface TimeRangePickerProps {
    onChange?: (timeRange?: TimeRange) => void;
    value?: TimeRange;
    formatOptions?: FormatDateOptions;
    minuteStep?: number;
    min?: string;
    max?: string;
    clearable?: boolean;
    separatorText?: React.ReactNode;
    componentsProps?: TimeRangePickerComponentsProps;
}

type IndividualTimeValue = string | undefined;

function TimeRangePicker({
    classes,
    onChange,
    value,
    separatorText = <FormattedMessage id="cometAdmin.dateTime.fromToSeparatorText" defaultMessage="to" />,
    componentsProps = {},
    ...propsForBothTimePickers
}: TimeRangePickerProps & WithStyles<typeof styles>) {
    const [startTime, setStartTime] = React.useState<IndividualTimeValue>(value?.start);
    const [endTime, setEndTime] = React.useState<IndividualTimeValue>(value?.end);

    const [startPickerIsOpen, setStartPickerIsOpen] = React.useState<boolean>(false);
    const [endPickerIsOpen, setEndPickerIsOpen] = React.useState<boolean>(false);

    const startPickerRef = React.useRef<HTMLElement>(null);
    const endPickerRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (startTime && endTime) {
            onChange?.({ start: startTime, end: endTime });
        } else if (startTime === undefined && endTime === undefined) {
            onChange?.(undefined);
        }
    }, [startTime, endTime, onChange]);

    React.useEffect(() => {
        if (!startPickerIsOpen && !endPickerIsOpen) {
            if (startTime !== undefined && endTime === undefined) {
                setEndTime(startTime);
            }
            if (startTime === undefined && endTime !== undefined) {
                setStartTime(endTime);
            }
        }
    }, [startPickerIsOpen, endPickerIsOpen, startTime, endTime]);

    const onChangeTimeValue = (newTimeValue: IndividualTimeValue, type: "start" | "end") => {
        const otherTimeValue = type === "start" ? endTime : startTime;
        const setNewTimeValue = type === "start" ? setStartTime : setEndTime;
        const setOtherTimeValue = type === "start" ? setEndTime : setStartTime;
        const otherTimeInputRef = type === "start" ? endPickerRef : startPickerRef;

        setNewTimeValue(newTimeValue);

        if (newTimeValue === undefined) {
            setOtherTimeValue(undefined);
        } else if (otherTimeValue === undefined) {
            if (otherTimeInputRef.current) {
                otherTimeInputRef.current.focus();
            }
        }
    };

    return (
        <div className={classes.root}>
            <FormControl>
                <TimePicker
                    inputRef={startPickerRef}
                    value={startTime}
                    className={clsx(classes.timePicker, classes.startTimePicker)}
                    onChange={(time) => onChangeTimeValue(time, "start")}
                    onOpenPopper={() => setStartPickerIsOpen(true)}
                    onClosePopper={() => setStartPickerIsOpen(false)}
                    {...propsForBothTimePickers}
                    {...componentsProps.startPicker}
                />
            </FormControl>
            <Typography className={classes.separator}>{separatorText}</Typography>
            <FormControl>
                <TimePicker
                    inputRef={endPickerRef}
                    value={endTime}
                    className={clsx(classes.timePicker, classes.endTimePicker)}
                    onChange={(time) => onChangeTimeValue(time, "end")}
                    onOpenPopper={() => setEndPickerIsOpen(true)}
                    onClosePopper={() => setEndPickerIsOpen(false)}
                    {...propsForBothTimePickers}
                    {...componentsProps.endPicker}
                />
            </FormControl>
        </div>
    );
}

export type TimeRangePickerClassKey = "root" | "timePicker" | "startTimePicker" | "endTimePicker" | "separator";

export const styles = ({ spacing }: Theme) =>
    createStyles<TimeRangePickerClassKey, TimeRangePickerProps>({
        root: {
            display: "flex",
            alignItems: "center",
        },
        timePicker: {
            flexGrow: 1,
            flexBasis: "100%",
        },
        startTimePicker: {},
        endTimePicker: {},
        separator: {
            marginLeft: spacing(2),
            marginRight: spacing(2),
        },
    });

const TimeRangePickerWithStyles = withStyles(styles, { name: "CometAdminTimeRangePicker" })(TimeRangePicker);

export { TimeRangePickerWithStyles as TimeRangePicker };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTimeRangePicker: TimeRangePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTimeRangePicker: TimeRangePickerProps;
    }

    interface Components {
        CometAdminTimeRangePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminTimeRangePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTimeRangePicker"];
        };
    }
}
