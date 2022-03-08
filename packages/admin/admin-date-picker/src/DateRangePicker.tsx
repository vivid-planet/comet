import moment from "moment";
import * as React from "react";
import { DateRangePicker as AirBNBDateRangePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import * as sc from "./DateRangePicker.sc";
import useUniqueId from "./useUniqueId";

interface IDateRange {
    start: Date | null;
    end: Date | null;
}

interface IProps extends FieldRenderProps<IDateRange, HTMLInputElement> {
    fullWidth?: boolean;
    color?: "primary" | "secondary" | "default";
    startPlaceholder?: string;
    endPlaceholder?: string;
}

/**
 * @deprecated Will be removed in the next major release, due to incompatibility of react-dates with react 17.
 */
export const FinalFormDateRangePicker: React.FC<IProps> = ({
    input: { value, onChange, name },
    fullWidth = false,
    color = "default",
    meta,
    label,
    children,
    render,
    startPlaceholder,
    endPlaceholder,
    ...props
}) => {
    const intl = useIntl();
    const localeName = intl.locale;

    const locale = moment().locale(localeName);
    const [focusedInputField, setFocusedInputField] = React.useState<"startDate" | "endDate" | null>(null);
    const start = value.start ? moment(value.start) : null;
    const end = value.end ? moment(value.end) : null;
    const datePickerUniqueId = useUniqueId();

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    return (
        <sc.DateRangePickerWrapper fullWidth={fullWidth} color={color}>
            <AirBNBDateRangePicker
                startDate={start}
                startDatePlaceholderText={startPlaceholder === undefined ? String(locale.format("L")) : startPlaceholder}
                startDateId={`date-range-picker-start-${name}-${datePickerUniqueId}`}
                endDate={end}
                endDatePlaceholderText={endPlaceholder === undefined ? String(locale.format("L")) : endPlaceholder}
                endDateId={`date-range-picker-end-${name}-${datePickerUniqueId}`}
                onDatesChange={({ startDate, endDate }: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
                    onChange({ start: startDate ? startDate.toDate() : null, end: endDate ? endDate.toDate() : null });
                }}
                focusedInput={focusedInputField}
                onFocusChange={setFocusedInputField}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                minimumNights={0}
                displayFormat={() => locale.localeData().longDateFormat("L")}
                {...props}
            />
        </sc.DateRangePickerWrapper>
    );
};
