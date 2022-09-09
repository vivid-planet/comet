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

    const onChangeTimeValue = React.useCallback(
        (newTimeValue: IndividualTimeValue, type: "start" | "end") => {
            if (newTimeValue === undefined) {
                onChange?.(undefined);
                setStartTime(undefined);
                setEndTime(undefined);
            } else if (type === "start") {
                setStartTime(newTimeValue);

                if (endTime) {
                    onChange?.({ start: newTimeValue, end: endTime });
                } else {
                    endPickerRef.current?.focus();
                }
            } else if (type === "end") {
                setEndTime(newTimeValue);

                if (startTime) {
                    onChange?.({ start: startTime, end: newTimeValue });
                } else {
                    startPickerRef.current?.focus();
                }
            }
        },
        [startTime, endTime, onChange],
    );

    // Setting both values the same when closing the pickers and one value is undefined needs to be handled inside `useEffect`, as `setStartTime`/`setEndTime` might not be complete when calling `onClosePopper`.
    React.useEffect(() => {
        if (!startPickerIsOpen && !endPickerIsOpen) {
            if (startTime !== undefined && endTime === undefined) {
                onChangeTimeValue(startTime, "end");
            } else if (startTime === undefined && endTime !== undefined) {
                onChangeTimeValue(endTime, "start");
            }
        }
    }, [onChangeTimeValue, startPickerIsOpen, endPickerIsOpen, startTime, endTime]);

    return (
        <div className={classes.root}>
            <FormControl className={classes.formControl}>
                <TimePicker
                    inputRef={startPickerRef}
                    value={startTime}
                    className={clsx(classes.timePicker, classes.startTimePicker)}
                    onChange={(time) => onChangeTimeValue(time, "start")}
                    onOpenPopper={() => setStartPickerIsOpen(true)}
                    onClosePopper={() => setStartPickerIsOpen(false)}
                    fullWidth
                    {...propsForBothTimePickers}
                    {...componentsProps.startPicker}
                />
            </FormControl>
            <Typography className={classes.separator}>{separatorText}</Typography>
            <FormControl className={classes.formControl}>
                <TimePicker
                    inputRef={endPickerRef}
                    value={endTime}
                    className={clsx(classes.timePicker, classes.endTimePicker)}
                    onChange={(time) => onChangeTimeValue(time, "end")}
                    onOpenPopper={() => setEndPickerIsOpen(true)}
                    onClosePopper={() => setEndPickerIsOpen(false)}
                    fullWidth
                    {...propsForBothTimePickers}
                    {...componentsProps.endPicker}
                />
            </FormControl>
        </div>
    );
}

export type TimeRangePickerClassKey = "root" | "formControl" | "timePicker" | "startTimePicker" | "endTimePicker" | "separator";

export const styles = ({ spacing }: Theme) =>
    createStyles<TimeRangePickerClassKey, TimeRangePickerProps>({
        root: {
            display: "flex",
            alignItems: "center",
        },
        formControl: {
            flexGrow: 1,
        },
        timePicker: {},
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
