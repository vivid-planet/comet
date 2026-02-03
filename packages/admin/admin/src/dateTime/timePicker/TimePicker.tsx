import { Time } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { pickersInputBaseClasses, TimePicker as MuiTimePicker, type TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";
import { type ReactNode, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../../common/ReadOnlyAdornment";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type Future_TimePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type Future_TimePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiTimePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof ReadOnlyAdornment;
    openPickerAdornment: typeof OpenPickerAdornment;
}> & {
    fullWidth?: boolean;
    /**
     * If `true`, the picker will be marked as required and the clear button will be hidden.
     */
    required?: boolean;
    /**
     * The selected time value in 24-hour format (HH:mm).
     */
    value?: string;
    /**
     * Callback fired when the time changes.
     *
     * @param time - The new time value in 24-hour format (HH:mm), or `undefined` if cleared.
     */
    onChange?: (time: string | undefined) => void;
    /**
     * Custom icons for the picker.
     *
     * - `openPicker`: Icon to display in the adornment that opens the time picker (default: Time icon)
     */
    iconMapping?: {
        openPicker?: ReactNode;
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

/**
 * The TimePicker component allows users to select a time from a time picker interface. It provides a text field
 * with a time icon that opens a time picker dialog. The component handles time strings in 24-hour format (HH:mm)
 * and includes features like clearing, read-only state, and customizable icons.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-timepicker--docs)
 * - [MUI X TimePicker Documentation](https://mui.com/x/react-date-pickers/time-picker/)
 */
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

    const { openPicker: openPickerIcon = <Time color="inherit" /> } = iconMapping;

    return (
        <Root
            enableAccessibleFieldDOMStructure
            disabled={disabled}
            readOnly={readOnly}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            disableOpenPicker
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
                                    <OpenPickerAdornment
                                        inputIsDisabled={disabled}
                                        inputIsReadOnly={readOnly}
                                        onClick={() => setOpen(true)}
                                        {...slotProps?.openPickerAdornment}
                                    >
                                        {openPickerIcon}
                                    </OpenPickerAdornment>
                                    {textFieldProps?.InputProps?.startAdornment}
                                </>
                            ),
                            endAdornment: (
                                <>
                                    {textFieldProps?.InputProps?.endAdornment}
                                    <ReadOnlyAdornment inputIsReadOnly={Boolean(readOnly)} {...slotProps?.readOnlyAdornment} />
                                    <ClearInputAdornment
                                        position="end"
                                        hasClearableContent={dateValue !== null && !required && !disabled && !readOnly}
                                        onClick={() => onChange?.(undefined)}
                                        {...slotProps?.clearInputAdornment}
                                    />
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
`);

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_TimePickerClassKey>({
    componentName: "Future_TimePicker",
    slotName: "clearInputAdornment",
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
