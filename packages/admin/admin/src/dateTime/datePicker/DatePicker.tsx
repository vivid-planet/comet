import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps, pickersInputBaseClasses } from "@mui/x-date-pickers";
import { type ReactNode, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../../common/ReadOnlyAdornment";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { getDateValue, getIsoDateString, isValidDate } from "../utils";

export type DatePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type DatePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDatePicker<Date, true>;
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
     * The selected date value in ISO 8601 format (YYYY-MM-DD).
     */
    value?: string;
    /**
     * Callback fired when the date changes.
     *
     * @param date - The new date value in ISO 8601 format (YYYY-MM-DD), or `undefined` if cleared.
     */
    onChange?: (date: string | undefined) => void;
    /**
     * Custom icons for the picker.
     *
     * - `openPicker`: Icon to display in the adornment that opens the calendar picker (default: Calendar icon)
     */
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDatePickerProps<Date, true>, "value" | "onChange" | "slotProps">;

<<<<<<< HEAD:packages/admin/admin/src/dateTime/DatePicker.tsx
export const DatePicker = (inProps: DatePickerProps) => {
=======
/**
 * The DatePicker component allows users to select a date from a calendar interface. It provides a text field
 * with a calendar icon that opens a date picker dialog. The component handles ISO 8601 date strings and includes
 * features like clearing, read-only state, and customizable icons.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-datepicker--docs)
 * - [MUI X DatePicker Documentation](https://mui.com/x/react-date-pickers/date-picker/)
 */
export const Future_DatePicker = (inProps: Future_DatePickerProps) => {
>>>>>>> main:packages/admin/admin/src/dateTime/datePicker/DatePicker.tsx
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
        name: "CometAdminDatePicker",
    });
    const [open, setOpen] = useState(false);
    const dateValue = getDateValue(stringValue);

    const { openPicker: openPickerIcon = <Calendar color="inherit" /> } = iconMapping;

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
                let newStringValue: string | undefined = undefined;

                if (date && isValidDate(date)) {
                    newStringValue = getIsoDateString(date);
                }

                return onChange?.(newStringValue);
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

const Root = createComponentSlot(MuiDatePicker<Date, true>)<DatePickerClassKey>({
    componentName: "DatePicker",
    slotName: "root",
})(css`
    .${inputLabelClasses.root} {
        display: none;

        & + .${pickersInputBaseClasses.root} {
            margin-top: 0;
        }
    }
`);

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<DatePickerClassKey>({
    componentName: "DatePicker",
    slotName: "clearInputAdornment",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDatePicker: DatePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDatePicker: DatePickerClassKey;
    }

    interface Components {
        CometAdminDatePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDatePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDatePicker"];
        };
    }
}
