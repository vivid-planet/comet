import { createComponentSlot, type ThemedComponentBaseProps } from "@comet/admin";
import { type ComponentsOverrides, FormControl } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { useRef } from "react";
import { useIntl } from "react-intl";

import { DatePicker as DatePickerBase } from "../datePicker/DatePicker";
import { TimePicker as TimePickerBase } from "../timePicker/TimePicker";
import { getIsoDateString } from "../utils/datePickerHelpers";
import { getDateWithNewTime, getTimeStringFromDate } from "../utils/timePickerHelpers";

export type DateTimePickerClassKey = "root" | "dateFormControl" | "timeFormControl" | "datePicker" | "timePicker";

const Root = createComponentSlot("div")<DateTimePickerClassKey>({
    componentName: "DateTimePicker",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
`);

const DateFormControl = createComponentSlot(FormControl)<DateTimePickerClassKey>({
    componentName: "DateTimePicker",
    slotName: "dateFormControl",
})(
    ({ theme }) => css`
        flex-grow: 1;
        margin-right: ${theme.spacing(2)};
    `,
);

const TimeFormControl = createComponentSlot(FormControl)<DateTimePickerClassKey>({
    componentName: "DateTimePicker",
    slotName: "timeFormControl",
})(css`
    flex-grow: 1;
`);

const DatePicker = createComponentSlot(DatePickerBase)<DateTimePickerClassKey>({
    componentName: "DateTimePicker",
    slotName: "datePicker",
})();

const TimePicker = createComponentSlot(TimePickerBase)<DateTimePickerClassKey>({
    componentName: "DateTimePicker",
    slotName: "timePicker",
})();

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
    required?: boolean;
}

export const DateTimePicker = (inProps: DateTimePickerProps) => {
    const { onChange, value, required, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminDateTimePicker",
    });
    const intl = useIntl();
    const datePickerRef = useRef<HTMLElement>(null);
    const timePickerRef = useRef<HTMLElement>(null);

    const onChangeDate = (newDate?: string) => {
        if (newDate === undefined) {
            onChange?.(undefined);
        } else {
            const timePickerShouldBeFocused = !value;
            const time = getTimeStringFromDate(value ? value : new Date());
            const newDateTime = getDateWithNewTime(new Date(newDate), time);
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
                    value={value ? getIsoDateString(value) : undefined}
                    onChange={onChangeDate}
                    fullWidth
                    required={required}
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
                    required={required}
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
        CometAdminDateTimePicker: DateTimePickerProps;
    }

    interface Components {
        CometAdminDateTimePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDateTimePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDateTimePicker"];
        };
    }
}
