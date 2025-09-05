import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { type DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
import { type ComponentType, lazy, type ReactNode, Suspense, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../common/ReadOnlyAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { getDateValue, getIsoDateString } from "./utils";

export type DateRange = {
    start: string | null;
    end: string | null;
};

export type Future_DateRangePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type Future_DateRangePickerProps = ThemedComponentBaseProps<{
    root: ComponentType<MuiDateRangePickerProps<Date, true>>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof ReadOnlyAdornment;
    openPickerAdornment: typeof OpenPickerAdornment;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: DateRange;
    onChange?: (date: DateRange | undefined) => void;
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDateRangePickerProps<Date, true>, "value" | "onChange">;

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
    const hasDateRangeValue = dateRangeValue.some((date) => date !== null);

    const { openPicker: openPickerIcon = <Calendar color="inherit" /> } = iconMapping;

    return (
        <Suspense>
            <LazyRoot
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
                                            hasClearableContent={hasDateRangeValue && !required && !disabled && !readOnly}
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
        </Suspense>
    );
};

const LazyRoot = lazy(async () => {
    const module = await import("@mui/x-date-pickers-pro");

    const Root = createComponentSlot(module.DateRangePicker<Date, true>)<Future_DateRangePickerClassKey>({
        componentName: "Future_DateRangePicker",
        slotName: "root",
    })(css`
        .${inputLabelClasses.root} {
            display: none;

            & + .${module.pickersInputBaseClasses.root} {
                margin-top: 0;
            }
        }
    `);

    return {
        default: (props: MuiDateRangePickerProps<Date, true>) => (
            <Root {...props} slots={{ field: module.SingleInputDateRangeField, ...props.slots }} />
        ),
    };
});

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<Future_DateRangePickerClassKey>({
    componentName: "Future_DateRangePicker",
    slotName: "clearInputAdornment",
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
