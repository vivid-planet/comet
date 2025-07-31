import { Calendar, Lock } from "@comet/admin-icons";
import { type ComponentsOverrides, css, IconButton, InputAdornment, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps, pickersInputBaseClasses } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

const getIsoDateString = (date: Date) => {
    return format(date, "yyyy-MM-dd");
};

export type Future_DatePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment" | "openPickerButton";

export type Future_DatePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDatePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof InputAdornment;
    openPickerAdornment: typeof InputAdornment;
    openPickerButton: typeof IconButton;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: string;
    onChange?: (date: string | undefined) => void;
    iconMapping?: {
        openPicker?: React.ReactNode;
        readOnly?: React.ReactNode;
    };
} & Omit<MuiDatePickerProps<Date, true>, "value" | "onChange" | "slotProps">;

const getDateValue = (value: string | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value: ${value}`);
    }

    return date;
};

export const Future_DatePicker = (inProps: Future_DatePickerProps) => {
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
        name: "CometAdminFutureDatePicker",
    });
    const [open, setOpen] = useState(false);
    const dateValue = getDateValue(stringValue);

    const { openPicker: openPickerIcon = <Calendar color="inherit" />, readOnly: readOnlyIcon = <Lock fontSize="inherit" /> } = iconMapping;

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
            onChange={(date) => onChange?.(date ? getIsoDateString(date) : undefined)}
            {...slotProps?.root}
            {...restProps}
            slotProps={{
                ...slotProps?.root?.slotProps,
                textField: {
                    fullWidth,
                    required,
                    ...slotProps?.root?.slotProps?.textField,
                    InputProps: {
                        // @ts-expect-error It's unclear in the types which variant of `textField` is used here and we can't pass through the correct generic type to it
                        ...slotProps?.root?.slotProps?.textField?.InputProps,
                        startAdornment: (
                            <>
                                {openPickerAdornment}
                                {/* @ts-expect-error It's unclear in the types which variant of `textField` is used here and we can't pass through the correct generic type to it */}
                                {slotProps?.root?.slotProps?.textField?.InputProps?.startAdornment}
                            </>
                        ),
                        endAdornment: (
                            <>
                                {/* @ts-expect-error It's unclear in the types which variant of `textField` is used here and we can't pass through the correct generic type to it */}
                                {slotProps?.root?.slotProps?.textField?.InputProps?.endAdornment}
                                {readOnlyAdornment}
                                {clearButtonEndAdornment}
                            </>
                        ),
                    },
                },
            }}
        />
    );
};

const Root = createComponentSlot(MuiDatePicker<Date, true>)<Future_DatePickerClassKey>({
    componentName: "Future_DatePicker",
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

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_DatePickerClassKey>({
    componentName: "Future_DatePicker",
    slotName: "clearInputAdornment",
})();

const ReadOnlyAdornment = createComponentSlot(InputAdornment)<Future_DatePickerClassKey>({
    componentName: "Future_DatePicker",
    slotName: "readOnlyAdornment",
})(css`
    font-size: 12px;
`);

const OpenPickerAdornment = createComponentSlot(InputAdornment)<Future_DatePickerClassKey>({
    componentName: "Future_DatePicker",
    slotName: "openPickerAdornment",
})();

const OpenPickerButton = createComponentSlot(IconButton)<Future_DatePickerClassKey>({
    componentName: "Future_DatePicker",
    slotName: "openPickerButton",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFutureDatePicker: Future_DatePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFutureDatePicker: Future_DatePickerClassKey;
    }

    interface Components {
        CometAdminFutureDatePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFutureDatePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFutureDatePicker"];
        };
    }
}
