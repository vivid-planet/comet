import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides, css, inputLabelClasses, type Theme, useThemeProps } from "@mui/material";
import { type DateTimeRangePickerProps as MuiDateTimeRangePickerProps } from "@mui/x-date-pickers-pro";
import { type ComponentType, lazy, type ReactNode, Suspense, useState } from "react";

import { ClearInputAdornment as CometClearInputAdornment } from "../../common/ClearInputAdornment";
import { OpenPickerAdornment } from "../../common/OpenPickerAdornment";
import { ReadOnlyAdornment } from "../../common/ReadOnlyAdornment";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { isValidDate } from "../utils";

/**
 * Represents a date-time range with start and end dates as Date objects.
 */
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
    /**
     * If `true`, the picker will be marked as required and the clear button will be hidden.
     */
    required?: boolean;
    /**
     * The selected date-time range value with start and end as Date objects.
     */
    value?: DateTimeRange;
    /**
     * Callback fired when the date-time range changes.
     *
     * @param date - The new date-time range value, or `undefined` if cleared.
     */
    onChange?: (date: DateTimeRange | undefined) => void;
    /**
     * Custom icons for the picker.
     *
     * - `openPicker`: Icon to display in the adornment that opens the picker (default: Calendar icon)
     */
    iconMapping?: {
        openPicker?: ReactNode;
    };
} & Omit<MuiDateTimeRangePickerProps<Date, true>, "value" | "onChange">;

/**
 * The DateTimeRangePicker component allows users to select a date-time range from a combined picker interface.
 * It provides two text fields with a calendar icon that opens a date-time range picker dialog. The component handles
 * Date objects and includes features like clearing, read-only state, and customizable icons.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-datetimerangepicker--docs)
 * - [MUI X DateTimeRangePicker Documentation](https://mui.com/x/react-date-pickers/date-time-range-picker/)
 */
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
