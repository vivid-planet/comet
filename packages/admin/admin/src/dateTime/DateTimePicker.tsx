import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import {
    DateTimePicker as MuiDateTimePicker,
    type DateTimePickerProps as MuiDateTimePickerProps,
    pickersInputBaseClasses,
} from "@mui/x-date-pickers";
import { type ReactNode, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../common/ReadOnlyAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { isValidDate } from "./utils";

export type Future_DateTimePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type Future_DateTimePickerProps = ThemedComponentBaseProps<{
    root: typeof MuiDateTimePicker<Date, true>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof ReadOnlyAdornment;
    openPickerAdornment: typeof OpenPickerAdornment;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: Date;
    onChange?: (dateTime: Date | undefined) => void;
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDateTimePickerProps<Date, true>, "value" | "onChange">;

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
