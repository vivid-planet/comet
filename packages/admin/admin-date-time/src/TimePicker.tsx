import { ClearInputAdornment, InputWithPopper, InputWithPopperProps } from "@comet/admin";
import { Time } from "@comet/admin-icons";
import { ComponentsOverrides, InputAdornment, ListItemText, MenuItem, MenuList } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { WithStyles, withStyles } from "@mui/styles";
import { format } from "date-fns";
import * as React from "react";
import { FormatDateOptions, FormattedTime, useIntl } from "react-intl";

import { getClosestDateToDate, getDateFromTimeValue, getDateRangeListByMinuteStep } from "./helpers/timePickerHelpers";
import { styles, TimePickerClassKey } from "./TimePicker.styles";

export interface TimePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange"> {
    onChange?: (time?: string) => void;
    value?: string;
    formatOptions?: FormatDateOptions;
    minuteStep?: number;
    min?: string;
    max?: string;
    clearable?: boolean;
}

function TimePicker({
    onChange,
    value,
    formatOptions,
    endAdornment,
    clearable,
    minuteStep = 15,
    placeholder,
    min = "00:00",
    max = "23:59",
    ...inputWithPopperProps
}: TimePickerProps & WithStyles<typeof styles>): React.ReactElement {
    const intl = useIntl();
    const focusedItemRef = React.useRef<HTMLLIElement>(null);

    const dateValue: Date | null = value ? getDateFromTimeValue(value) : null;
    const timeOptions = getDateRangeListByMinuteStep(min, max, minuteStep);
    const closestDateToNow = getClosestDateToDate(timeOptions);
    const closestDateToCurrentValue = dateValue ? getClosestDateToDate(timeOptions, dateValue) : null;

    const onOpenPopper = () => {
        // The timeout is necessary, as the ref might not be ready immediately when the popper starts to open.
        setTimeout(() => {
            if (focusedItemRef.current) {
                focusedItemRef.current.scrollIntoView({ behavior: "auto", block: "center" });
                focusedItemRef.current.focus();
            }
        }, 0);
    };

    return (
        <InputWithPopper
            value={dateValue ? intl.formatTime(dateValue, formatOptions) : ""}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.timePicker.select", defaultMessage: "Select" })}
            startAdornment={
                <InputAdornment position="start" disablePointerEvents>
                    <Time />
                </InputAdornment>
            }
            {...inputWithPopperProps}
            onOpenPopper={() => {
                onOpenPopper();
                inputWithPopperProps.onOpenPopper?.();
            }}
            readOnly
            endAdornment={
                clearable ? (
                    <>
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange?.(undefined)} />
                        {endAdornment}
                    </>
                ) : (
                    endAdornment
                )
            }
        >
            {(closePopper) => (
                <MenuList>
                    {timeOptions.map((timeOptionValue, index) => {
                        const selected = (dateValue && format(dateValue, "HH:mm")) === format(timeOptionValue, "HH:mm");
                        const isFocusedItem =
                            selected ||
                            (closestDateToCurrentValue ? closestDateToCurrentValue === timeOptionValue : closestDateToNow === timeOptionValue);

                        return (
                            <MenuItem
                                key={index}
                                selected={selected}
                                ref={isFocusedItem ? focusedItemRef : null}
                                onClick={() => {
                                    onChange?.(format(timeOptionValue, "HH:mm"));
                                    closePopper(true);
                                }}
                            >
                                <ListItemText>
                                    <FormattedTime value={timeOptionValue} {...formatOptions} />
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            )}
        </InputWithPopper>
    );
}

const TimePickerWithStyles = withStyles(styles, { name: "CometAdminTimePicker" })(TimePicker);

export { TimePickerWithStyles as TimePicker };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTimePicker: TimePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTimePicker: Partial<TimePickerProps>;
    }

    interface Components {
        CometAdminTimePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminTimePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTimePicker"];
        };
    }
}
