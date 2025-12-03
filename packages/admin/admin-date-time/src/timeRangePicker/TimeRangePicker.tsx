import { createComponentSlot, type ThemedComponentBaseProps } from "@comet/admin";
import { type ComponentsOverrides, FormControl, type Theme, Typography } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { type FormatDateOptions, FormattedMessage, useIntl } from "react-intl";

import { TimePicker as TimePickerBase } from "../timePicker/TimePicker";

export type TimeRangePickerClassKey =
    | "root"
    | "startFormControl"
    | "endFormControl"
    | "timePicker"
    | "startTimePicker"
    | "endTimePicker"
    | "separator";

const Root = createComponentSlot("div")<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
`);

const StartFormControl = createComponentSlot(FormControl)<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "startFormControl",
})(css`
    flex-grow: 1;
`);

const EndFormControl = createComponentSlot(FormControl)<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "endFormControl",
})(css`
    flex-grow: 1;
`);

const StartTimePicker = createComponentSlot(TimePickerBase)<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "startTimePicker",
})();

const EndTimePicker = createComponentSlot(TimePickerBase)<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "endTimePicker",
})();

const Separator = createComponentSlot(Typography)<TimeRangePickerClassKey>({
    componentName: "TimeRangePicker",
    slotName: "separator",
})(
    ({ theme }) => css`
        margin-left: ${theme.spacing(2)};
        margin-right: ${theme.spacing(2)};
    `,
);

export type TimeRange = {
    start: string;
    end: string;
};

export interface TimeRangePickerProps
    extends ThemedComponentBaseProps<{
        root: "div";
        startFormControl: typeof FormControl;
        endFormControl: typeof FormControl;
        startTimePicker: typeof TimePickerBase;
        endTimePicker: typeof TimePickerBase;
        separator: typeof Typography;
    }> {
    onChange?: (timeRange?: TimeRange) => void;
    value?: TimeRange;
    formatOptions?: FormatDateOptions;
    minuteStep?: number;
    min?: string;
    max?: string;
    required?: boolean;
    separatorText?: ReactNode;
}

type IndividualTimeValue = string | undefined;

export const TimeRangePicker = (inProps: TimeRangePickerProps) => {
    const {
        onChange,
        value,
        separatorText = <FormattedMessage id="comet.dateTime.fromToSeparatorText" defaultMessage="to" />,
        className,
        sx,
        required,
        slotProps,
        ...propsForBothTimePickers
    } = useThemeProps({ props: inProps, name: "CometAdminTimeRangePicker" });
    const intl = useIntl();

    const [startTime, setStartTime] = useState<IndividualTimeValue>(value?.start);
    const [endTime, setEndTime] = useState<IndividualTimeValue>(value?.end);

    const [startPickerIsOpen, setStartPickerIsOpen] = useState<boolean>(false);
    const [endPickerIsOpen, setEndPickerIsOpen] = useState<boolean>(false);

    const startPickerRef = useRef<HTMLElement>(null);
    const endPickerRef = useRef<HTMLElement>(null);

    const onChangeTimeValue = useCallback(
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
    useEffect(() => {
        if (!startPickerIsOpen && !endPickerIsOpen) {
            if (startTime !== undefined && endTime === undefined) {
                onChangeTimeValue(startTime, "end");
            } else if (startTime === undefined && endTime !== undefined) {
                onChangeTimeValue(endTime, "start");
            }
        }
    }, [onChangeTimeValue, startPickerIsOpen, endPickerIsOpen, startTime, endTime]);

    return (
        <Root sx={sx} className={className} {...slotProps?.root}>
            <StartFormControl {...slotProps?.startFormControl}>
                <StartTimePicker
                    inputRef={startPickerRef}
                    value={startTime}
                    placeholder={intl.formatMessage({ id: "comet.timeRangePicker.start", defaultMessage: "Start" })}
                    onChange={(time) => onChangeTimeValue(time, "start")}
                    onOpenPopper={() => setStartPickerIsOpen(true)}
                    onClosePopper={() => setStartPickerIsOpen(false)}
                    fullWidth
                    required={required}
                    {...propsForBothTimePickers}
                    {...slotProps?.startTimePicker}
                />
            </StartFormControl>
            <Separator {...slotProps?.separator}>{separatorText}</Separator>
            <EndFormControl {...slotProps?.endFormControl}>
                <EndTimePicker
                    inputRef={endPickerRef}
                    value={endTime}
                    placeholder={intl.formatMessage({ id: "comet.timeRangePicker.end", defaultMessage: "End" })}
                    onChange={(time) => onChangeTimeValue(time, "end")}
                    onOpenPopper={() => setEndPickerIsOpen(true)}
                    onClosePopper={() => setEndPickerIsOpen(false)}
                    fullWidth
                    required={required}
                    {...propsForBothTimePickers}
                    {...slotProps?.endTimePicker}
                />
            </EndFormControl>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTimeRangePicker: TimeRangePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTimeRangePicker: TimeRangePickerProps;
    }

    interface Components {
        CometAdminTimeRangePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminTimeRangePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTimeRangePicker"];
        };
    }
}
