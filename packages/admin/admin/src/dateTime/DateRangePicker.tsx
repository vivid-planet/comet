import { Calendar, Lock } from "@comet/admin-icons";
import { type ComponentsOverrides, css, IconButton, InputAdornment, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import {
    DateRangePicker as MuiDateRangePicker,
    type DateRangePickerProps as MuiDateRangePickerProps,
    pickersInputBaseClasses,
    SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { getDateValue, getIsoDateString } from "./utils";

export type DateRange = {
    start: string | null;
    end: string | null;
};

export type Future_DateRangePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment" | "openPickerButton";

export type Future_DateRangePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDateRangePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof InputAdornment;
    openPickerAdornment: typeof InputAdornment;
    openPickerButton: typeof IconButton;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: DateRange;
    onChange?: (date: DateRange | undefined) => void;
    iconMapping?: {
        openPicker?: React.ReactNode;
        readOnly?: React.ReactNode;
    };
} & Omit<MuiDateRangePickerProps<Date, true>, "value" | "onChange" | "slotProps">;

const getDateRangeValue = (value: DateRange | undefined): [Date | null, Date | null] => {
    return [getDateValue(value?.start), getDateValue(value?.end)];
};

export const Future_DateRangePicker = (inProps: Future_DateRangePickerProps) => {
    const {
        iconMapping = {},
        fullWidth,
        required,
        slotProps,
        disabled,
        value: stringDateRangeValue,
        onChange,
        readOnly,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFutureDateRangePicker",
    });
    const [open, setOpen] = useState(false);
    const dateRangeValue = getDateRangeValue(stringDateRangeValue);

    const { openPicker: openPickerIcon = <Calendar color="inherit" />, readOnly: readOnlyIcon = <Lock fontSize="inherit" /> } = iconMapping;

    const clearButtonEndAdornment =
        !required && !disabled && !readOnly ? (
            <ClearInputAdornment
                position="end"
                hasClearableContent={Boolean(dateRangeValue)}
                onClick={() => onChange?.(undefined)}
                {...slotProps?.clearInputAdornment}
            />
        ) : null;

    const readOnlyAdornment = readOnly ? (
        <ReadOnlyAdornment position="end" {...slotProps?.readOnlyAdornment}>
            {readOnlyIcon}
        </ReadOnlyAdornment>
    ) : null;

    const openPickerAdornment = (
        <OpenPickerAdornment position="start" {...slotProps?.openPickerAdornment}>
            <OpenPickerButton onClick={() => setOpen(true)} disabled={disabled || readOnly} {...slotProps?.openPickerButton}>
                {openPickerIcon}
            </OpenPickerButton>
        </OpenPickerAdornment>
    );

    return (
        <Root
            enableAccessibleFieldDOMStructure
            disabled={disabled}
            readOnly={readOnly}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            disableOpenPicker
            value={dateRangeValue}
            onChange={([startDate, endDate]) => {
                if (!startDate && !endDate) {
                    onChange?.(undefined);
                    return;
                }

                onChange?.({
                    start: startDate ? getIsoDateString(startDate) : null,
                    end: endDate ? getIsoDateString(endDate) : null,
                });
            }}
            {...slotProps?.root}
            {...restProps}
            slotProps={{
                ...slotProps?.root?.slotProps,
                textField: (ownerState) => {
                    const textFieldProps = {
                        ...slotProps?.root?.slotProps?.textField,
                        ownerState,
                    };

                    return {
                        fullWidth,
                        required,
                        ...textFieldProps,
                        InputProps: {
                            ...textFieldProps?.InputProps,
                            startAdornment: (
                                <>
                                    {openPickerAdornment}
                                    {textFieldProps?.InputProps?.startAdornment}
                                </>
                            ),
                            endAdornment: (
                                <>
                                    {textFieldProps?.InputProps?.endAdornment}
                                    {readOnlyAdornment}
                                    {clearButtonEndAdornment}
                                </>
                            ),
                        },
                    };
                },
            }}
            slots={{
                field: SingleInputDateRangeField,
                ...slotProps?.root?.slots,
            }}
        />
    );
};

const Root = createComponentSlot(MuiDateRangePicker<Date, true>)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "root",
})(css`
    .${inputLabelClasses.root} {
        display: none;

        & + .${pickersInputBaseClasses.root} {
            margin-top: 0;
        }
    }

    .MuiPickersInputBase-root.Mui-readOnly .CometAdminFutureDatePicker-openPickerButton:disabled {
        color: inherit;
    }
`);

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "clearInputAdornment",
})();

const ReadOnlyAdornment = createComponentSlot(InputAdornment)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "readOnlyAdornment",
})(css`
    font-size: 12px;
`);

const OpenPickerAdornment = createComponentSlot(InputAdornment)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "openPickerAdornment",
})();

const OpenPickerButton = createComponentSlot(IconButton)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "openPickerButton",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFutureDateRangePicker: Future_DateRangePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFutureDateRangePicker: Future_DateRangePickerClassKey;
    }

    interface Components {
        CometAdminFutureDateRangePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFutureDateRangePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFutureDateRangePicker"];
        };
    }
}
