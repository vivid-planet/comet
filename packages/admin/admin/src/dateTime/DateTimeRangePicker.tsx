import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { type DateTimeRangePickerProps as MuiDateTimeRangePickerProps } from "@mui/x-date-pickers-pro";
import { type ComponentType, lazy, type ReactNode, Suspense, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../common/ReadOnlyAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { isValidDate } from "./utils";

export type DateTimeRange = {
    start: Date | null;
    end: Date | null;
};

export type DateTimeRangePickerClassKey = "root" | "clearInputAdornment" | "readOnlyAdornment" | "openPickerAdornment";

export type DateTimeRangePickerProps = ThemedComponentBaseProps<{
    root: ComponentType<MuiDateTimeRangePickerProps<Date, true>>;
    clearInputAdornment: typeof CometClearInputAdornment;
    readOnlyAdornment: typeof ReadOnlyAdornment;
    openPickerAdornment: typeof OpenPickerAdornment;
}> & {
    fullWidth?: boolean;
    required?: boolean;
    value?: DateTimeRange;
    onChange?: (date: DateTimeRange | undefined) => void;
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDateTimeRangePickerProps<Date, true>, "value" | "onChange">;

export const DateTimeRangePicker = (inProps: DateTimeRangePickerProps) => {
    const {
        iconMapping = {},
        fullWidth,
        required,
        slotProps,
        disabled,
        value: valueObject,
        onChange,
        readOnly,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminDateTimeRangePicker",
    });
    const [open, setOpen] = useState(false);
    const arrayValue: [Date | null, Date | null] = valueObject ? [valueObject.start, valueObject.end] : [null, null];

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
                value={arrayValue}
                onChange={([startDate, endDate]) => {
                    const startDateIsInvalid = startDate !== null && !isValidDate(startDate);
                    const endDateIsInvalid = endDate !== null && !isValidDate(endDate);

                    if (startDateIsInvalid || endDateIsInvalid) {
                        return;
                    }

                    if (!startDate && !endDate) {
                        onChange?.(undefined);
                        return;
                    }

                    onChange?.({
                        start: startDate,
                        end: endDate,
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
                                            hasClearableContent={arrayValue.some((date) => date !== null) && !required && !disabled && !readOnly}
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

    const Root = createComponentSlot(module.DateTimeRangePicker<Date, true>)<DateTimeRangePickerClassKey>({
        componentName: "DateTimeRangePicker",
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
        default: (props: MuiDateTimeRangePickerProps<Date, true>) => <Root {...props} />,
    };
});

const ClearInputAdornment = createComponentSlot(CometClearInputAdornment)<DateTimeRangePickerClassKey>({
    componentName: "DateTimeRangePicker",
    slotName: "clearInputAdornment",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDateTimeRangePicker: DateTimeRangePickerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDateTimeRangePicker: DateTimeRangePickerClassKey;
    }

    interface Components {
        CometAdminDateTimeRangePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDateTimeRangePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDateTimeRangePicker"];
        };
    }
}
