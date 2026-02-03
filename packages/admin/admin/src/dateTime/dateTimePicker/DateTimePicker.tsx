import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import {
    DateTimePicker as MuiDateTimePicker,
    type DateTimePickerProps as MuiDateTimePickerProps,
    pickersInputBaseClasses,
} from "@mui/x-date-pickers";
import { type ReactNode, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../../common/ReadOnlyAdornment";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { isValidDate } from "../utils";

export type Future_DateTimePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type Future_DateTimePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDateTimePicker<Date, true>;
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
     * The selected date and time value as a Date object.
     */
    value?: Date;
    /**
     * Callback fired when the date and time changes.
     *
     * @param dateTime - The new date and time value, or `undefined` if cleared.
     */
    onChange?: (dateTime: Date | undefined) => void;
    /**
     * Custom icons for the picker.
     *
     * - `openPicker`: Icon to display in the adornment that opens the picker (default: Calendar icon)
     */
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDateTimePickerProps<Date, true>, "value" | "onChange">;

/**
 * The DateTimePicker component allows users to select both a date and time from a combined picker interface.
 * It provides a text field with a calendar icon that opens a date-time picker dialog. The component handles
 * Date objects and includes features like clearing, read-only state, and customizable icons.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-datetimepicker--docs)
 * - [MUI X DateTimePicker Documentation](https://mui.com/x/react-date-pickers/date-time-picker/)
 */
export const Future_DateTimePicker = (inProps: Future_DateTimePickerProps) => {
    const {
        iconMapping = {},
        fullWidth,
        required,
        slotProps,
        disabled,
        value = null,
        onChange,
        readOnly,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFutureDateTimePicker",
    });
    const [open, setOpen] = useState(false);

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
            value={value}
            onChange={(date) => {
                const dateIsInvalid = date !== null && !isValidDate(date);
                if (dateIsInvalid) {
                    return;
                }

                onChange?.(date || undefined);
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
                                        hasClearableContent={value !== null && !required && !disabled && !readOnly}
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

const Root = createComponentSlot(MuiDateTimePicker<Date, true>)<Future_DateTimePickerClassKey>({
    componentName: "Future_DateTimePicker",
    slotName: "root",
})(css`
    .${inputLabelClasses.root} {
        display: none;

        & + .${pickersInputBaseClasses.root} {
            margin-top: 0;
        }
    }
`);

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_DateTimePickerClassKey>({
    componentName: "Future_DateTimePicker",
    slotName: "clearInputAdornment",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFutureDateTimePicker: Future_DateTimePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFutureDateTimePicker: Future_DateTimePickerClassKey;
    }

    interface Components {
        CometAdminFutureDateTimePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFutureDateTimePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFutureDateTimePicker"];
        };
    }
}
