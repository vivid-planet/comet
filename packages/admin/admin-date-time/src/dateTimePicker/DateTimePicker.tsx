import { ThemedComponentBaseProps } from "@comet/admin";
import { ComponentsOverrides, FormControl } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { useIntl } from "react-intl";

import { DatePicker as DatePickerBase } from "../datePicker/DatePicker";
import { TimePicker as TimePickerBase } from "../timePicker/TimePicker";
import { getDateWithNewTime, getTimeStringFromDate } from "../utils/timePickerHelpers";

export type DateTimePickerClassKey = "root" | "dateFormControl" | "timeFormControl" | "datePicker" | "timePicker";

const Root = styled("div", {
    name: "CometAdminDateTimePicker",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    display: flex;
    align-items: center;
`);

const DateFormControl = styled(FormControl, {
    name: "CometAdminDateTimePicker",
    slot: "dateFormControl",
    overridesResolver(_, styles) {
        return [styles.dateFormControl];
    },
})(
    ({ theme }) => css`
        flex-grow: 1;
        margin-right: ${theme.spacing(2)};
    `,
);

const TimeFormControl = styled(FormControl, {
    name: "CometAdminDateTimePicker",
    slot: "timeFormControl",
    overridesResolver(_, styles) {
        return [styles.timeFormControl];
    },
})(css`
    flex-grow: 1;
`);

const DatePicker = styled(DatePickerBase, {
    name: "CometAdminDateTimePicker",
    slot: "datePicker",
    overridesResolver(_, styles) {
        return [styles.datePicker];
    },
})(css``);

const TimePicker = styled(TimePickerBase, {
    name: "CometAdminDateTimePicker",
    slot: "timePicker",
    overridesResolver(_, styles) {
        return [styles.timePicker];
    },
})(css``);

export interface DateTimePickerProps
    extends ThemedComponentBaseProps<{
        root: "div";
        dateFormControl: typeof FormControl;
        timeFormControl: typeof FormControl;
        datePicker: typeof DatePickerBase;
        timePicker: typeof TimePickerBase;
    }> {
    onChange?: (value?: Date) => void;
    value?: Date;
    clearable?: boolean;
}

export const DateTimePicker = (inProps: DateTimePickerProps) => {
    const { onChange, value, slotProps, clearable, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminDateTimePicker",
    });
    const intl = useIntl();
    const datePickerRef = React.useRef<HTMLElement>(null);
    const timePickerRef = React.useRef<HTMLElement>(null);

    const onChangeDate = (newDate?: Date) => {
        if (newDate === undefined) {
            onChange?.(undefined);
        } else {
            const timePickerShouldBeFocused = !value;
            const time = getTimeStringFromDate(value ? value : new Date());
            const newDateTime = getDateWithNewTime(newDate, time);
            onChange?.(newDateTime);

            if (timePickerShouldBeFocused) {
                timePickerRef.current?.focus();
            }
        }
    };

    const onChangeTime = (newTime?: string) => {
        if (newTime === undefined) {
            onChange?.(undefined);
        } else {
            const datePickerShouldBeFocused = !value;
            const date = value ? value : new Date();
            const newDateTime = getDateWithNewTime(date, newTime);
            onChange?.(newDateTime);

            if (datePickerShouldBeFocused) {
                datePickerRef.current?.focus();
            }
        }
    };

    return (
        <Root {...slotProps?.root} {...restProps}>
            <DateFormControl {...slotProps?.dateFormControl}>
                <DatePicker
                    inputRef={datePickerRef}
                    value={value}
                    onChange={onChangeDate}
                    fullWidth
                    clearable={clearable}
                    {...slotProps?.datePicker}
                />
            </DateFormControl>
            <TimeFormControl {...slotProps?.timeFormControl}>
                <TimePicker
                    inputRef={timePickerRef}
                    value={value ? getTimeStringFromDate(value) : undefined}
                    placeholder={intl.formatMessage({ id: "comet.timeTimePicker.time", defaultMessage: "Time" })}
                    onChange={onChangeTime}
                    fullWidth
                    clearable={clearable}
                    {...slotProps?.timePicker}
                />
            </TimeFormControl>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDateTimePicker: DateTimePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDateTimePicker: Partial<DateTimePickerProps>;
    }

    interface Components {
        CometAdminDateTimePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminDateTimePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDateTimePicker"];
        };
    }
}
