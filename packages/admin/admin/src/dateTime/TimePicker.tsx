import { Lock, Time } from "@comet/admin-icons";
import { type ComponentsOverrides, css, IconButton, InputAdornment, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { pickersInputBaseClasses, TimePicker as MuiTimePicker, type TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";
import { useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type Future_TimePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment" | "openPickerButton";

export type Future_TimePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiTimePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof InputAdornment;
    openPickerAdornment: typeof InputAdornment;
    openPickerButton: typeof IconButton;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: string;
    onChange?: (time: string | undefined) => void;
    iconMapping?: {
        openPicker?: React.ReactNode;
        readOnly?: React.ReactNode;
    };
} & Omit<MuiTimePickerProps<Date, true>, "value" | "onChange" | "slotProps">;

const getTimeString = (date: Date) => {
    return format(date, "HH:mm");
};

const getDateFromTimeString = (value: string | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const parsedDate = parse(value, "HH:mm", new Date());
    const isValid = !isNaN(parsedDate.getTime());

    if (!isValid) {
        throw new Error(`Invalid time value: "${value}", must be a 24h time in format HH:mm`);
    }

    return parsedDate;
};

export const Future_TimePicker = (inProps: Future_TimePickerProps) => {
    const {
        iconMapping = {},
        fullWidth,
        required,
        slotProps,
        disabled,
        value: stringValue,
        onChange,
        readOnly,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFutureTimePicker",
    });
    const [open, setOpen] = useState(false);
    const dateValue = getDateFromTimeString(stringValue);

    const { openPicker: openPickerIcon = <Time color="inherit" />, readOnly: readOnlyIcon = <Lock fontSize="inherit" /> } = iconMapping;

    const clearButtonEndAdornment =
        !required && !disabled && !readOnly ? (
            <ClearInputAdornment
                position="end"
                hasClearableContent={Boolean(dateValue)}
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
            disableOpenPicker={true}
            value={dateValue}
            onChange={(date) => {
                if (!date) {
                    onChange?.(undefined);
                    return;
                }

                onChange?.(getTimeString(date));
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
        />
    );
};

const Root = createComponentSlot(MuiTimePicker<Date, true>)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "root",
})(css`
    .${inputLabelClasses.root} {
        display: none;

        & + .${pickersInputBaseClasses.root} {
            margin-top: 0;
        }
    }

    .MuiPickersInputBase-root.Mui-readOnly .CometAdminFutureTimePicker-openPickerButton:disabled {
        color: inherit;
    }
`);

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "clearInputAdornment",
})();

const ReadOnlyAdornment = createComponentSlot(InputAdornment)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "readOnlyAdornment",
})(css`
    font-size: 12px;
`);

const OpenPickerAdornment = createComponentSlot(InputAdornment)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "openPickerAdornment",
})();

const OpenPickerButton = createComponentSlot(IconButton)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "openPickerButton",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFutureTimePicker: Future_TimePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFutureTimePicker: Future_TimePickerClassKey;
    }

    interface Components {
        CometAdminFutureTimePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFutureTimePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFutureTimePicker"];
        };
    }
}
