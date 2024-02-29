import { ClearInputAdornment, InputWithPopper, InputWithPopperClassKey, InputWithPopperProps, ThemedComponentBaseProps } from "@comet/admin";
import { Time } from "@comet/admin-icons";
import { ComponentsOverrides, InputAdornment, ListItemText, MenuItem, MenuList } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { format } from "date-fns";
import * as React from "react";
import { FormatDateOptions, FormattedTime, useIntl } from "react-intl";

import { getClosestDateToDate, getDateFromTimeValue, getDateRangeListByMinuteStep } from "../utils/timePickerHelpers";

export type TimePickerClassKey = InputWithPopperClassKey | "startAdornment" | "timeOptionsList" | "timeOptionItem";

export type SlotProps = ThemedComponentBaseProps<{
    root: typeof InputWithPopper;
    startAdornment: typeof InputAdornment;
    timeOptionsList: typeof MenuList;
    timeOptionItem: typeof MenuItem;
}>["slotProps"];

export const Root = styled(InputWithPopper, {
    name: "CometAdminTimePicker",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

const StartAdornment = styled(InputAdornment, {
    name: "CometAdminTimePicker",
    slot: "startAdornment",
    overridesResolver(_, styles) {
        return [styles.startAdornment];
    },
})(css``);

const TimeOptionsList = styled(MenuList, {
    name: "CometAdminTimePicker",
    slot: "timeOptionsList",
    overridesResolver(_, styles) {
        return [styles.timeOptionsList];
    },
})(css``);

const TimeOptionItem = styled(MenuItem, {
    name: "CometAdminTimePicker",
    slot: "timeOptionItem",
    overridesResolver(_, styles) {
        return [styles.timeOptionItem];
    },
})(
    ({ theme }) => css`
        padding: ${theme.spacing(2)} ${theme.spacing(3)};
    `,
);

export interface TimePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "slotProps"> {
    onChange?: (time?: string) => void;
    value?: string;
    formatOptions?: FormatDateOptions;
    minuteStep?: number;
    min?: string;
    max?: string;
    clearable?: boolean;
    slotProps?: SlotProps;
}

export const TimePicker = (inProps: TimePickerProps) => {
    const {
        onChange,
        value,
        formatOptions,
        endAdornment,
        clearable,
        minuteStep = 15,
        placeholder,
        min = "00:00",
        max = "23:59",
        slotProps,
        ...inputWithPopperProps
    } = useThemeProps({ props: inProps, name: "CometAdminTimePicker" });
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
        <Root
            value={dateValue ? intl.formatTime(dateValue, formatOptions) : ""}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.timePicker.select", defaultMessage: "Select" })}
            startAdornment={
                <StartAdornment position="start" disablePointerEvents {...slotProps?.startAdornment}>
                    <Time />
                </StartAdornment>
            }
            {...inputWithPopperProps}
            slotProps={{
                ...slotProps?.root,
                paper: {
                    ...slotProps?.root?.slotProps?.paper,
                    sx: {
                        ...(slotProps?.root?.slotProps?.paper?.sx ?? {}),
                        minWidth: 110,
                        height: 280,
                        overflowY: "auto",
                    },
                },
            }}
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
                <TimeOptionsList {...slotProps?.timeOptionsList}>
                    {timeOptions.map((timeOptionValue, index) => {
                        const selected = (dateValue && format(dateValue, "HH:mm")) === format(timeOptionValue, "HH:mm");
                        const isFocusedItem =
                            selected ||
                            (closestDateToCurrentValue ? closestDateToCurrentValue === timeOptionValue : closestDateToNow === timeOptionValue);

                        return (
                            <TimeOptionItem
                                key={index}
                                selected={selected}
                                ref={isFocusedItem ? focusedItemRef : null}
                                onClick={() => {
                                    onChange?.(format(timeOptionValue, "HH:mm"));
                                    closePopper(true);
                                }}
                                {...slotProps?.timeOptionItem}
                            >
                                <ListItemText>
                                    <FormattedTime value={timeOptionValue} {...formatOptions} />
                                </ListItemText>
                            </TimeOptionItem>
                        );
                    })}
                </TimeOptionsList>
            )}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTimePicker: TimePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTimePicker: TimePickerProps;
    }

    interface Components {
        CometAdminTimePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminTimePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTimePicker"];
        };
    }
}
