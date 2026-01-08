import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps, pickersInputBaseClasses } from "@mui/x-date-pickers";
import { type ReactNode, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../common/ReadOnlyAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { getDateValue, getIsoDateString, isValidDate } from "./utils";

export type DatePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type DatePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDatePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof ReadOnlyAdornment;
    openPickerAdornment: typeof OpenPickerAdornment;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: string;
    onChange?: (date: string | undefined) => void;
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDatePickerProps<Date, true>, "value" | "onChange" | "slotProps">;

export const DatePicker = (inProps: DatePickerProps) => {
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
