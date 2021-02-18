import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { ClearInputButton, InputBase } from "@comet/admin";
import { ClickAwayListener, InputBaseProps, Paper, Popper, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as moment from "moment";
import * as React from "react";
import { DayPickerRangeController, DayPickerRangeControllerShape } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { getDateControllerText } from "../utils/getDateControllerDate";
import styles from "./DateRangePicker.styles";

interface DateRange {
    start: Date | null;
    end: Date | null;
}

export type DateRangePickerValue = DateRange | null;

export interface DateRangePickerThemeProps extends InputBaseProps {
    numberOfMonths?: number;
    showClearButton?: boolean;
    dateControllerProps?: DayPickerRangeController;
}

const getFormattedValue = (value: DateRangePickerValue, format: string): string => {
    if (!value) return "";
    const startValue = moment(value.start).isValid() ? moment(value.start).format(format) : "";
    const endValue = moment(value.end).isValid() ? moment(value.end).format(format) : "";
    return `${startValue} - ${endValue}`;
};

const Picker: React.FC<WithStyles<typeof styles> & DateRangePickerThemeProps & FieldRenderProps<DateRangePickerValue, HTMLInputElement>> = ({
    classes,
    input,
    disabled,
    placeholder,
    fullWidth = false,
    showClearButton,
    dateControllerProps,
    inputProps,
    ...restProps
}) => {
    const intl = useIntl();
    const localeName = intl.locale;
    const locale = moment().locale(localeName);
    const localeDateFormat = locale.localeData().longDateFormat("L");
    const placeholderText = placeholder
        ? placeholder
        : intl.formatMessage({ id: "cometAdmin.dateTime.dateRangePicker.placeholder", defaultMessage: "Date range" });

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    const { value, onChange, onBlur, onFocus, ...restInput } = input;
    const rootRef = React.useRef(null);
    const [showPopper, setShowPopper] = React.useState<boolean>(false);
    const [showDayPicker, setShowDayPicker] = React.useState<boolean>(false);
    const [customValue, setCustomValue] = React.useState<string | null>(null);
    const formattedValue = getFormattedValue(input.value, localeDateFormat);
    const displayValue = customValue ? customValue : formattedValue;
    const [focusedOnStartingDate, setFocusedOnStartingDate] = React.useState<boolean>(true);

    const showPicker = () => {
        onFocus();
        setShowPopper(true);
        setFocusedOnStartingDate(true);

        // Wait for the popper to be rendered, so the picker-height can be calculated
        // correctly https://github.com/airbnb/react-dates/issues/46#issuecomment-255059933
        setTimeout(() => setShowDayPicker(true), 0);
    };

    const setEndValueIfNotSet = () => {
        if (input.value && input.value.start && !input.value.end) {
            onChange({ start: input.value.start, end: input.value.start });
        }
    };

    const hidePicker = () => {
        onBlur();
        setShowPopper(false);
        setShowDayPicker(false);
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value.split("-");
        const newStartValue = newValue[0].trim();
        const newEndValue = newValue[1] === undefined ? newStartValue : newValue[1].trim();

        if (newStartValue && newEndValue) {
            const momentNewStartValue = moment(newStartValue, localeDateFormat);
            const momentNewEndValue = moment(newEndValue, localeDateFormat);

            if (momentNewStartValue.isValid() && momentNewEndValue.isValid()) {
                onChange({ start: momentNewStartValue.toDate(), end: momentNewEndValue.toDate() });
                setCustomValue(null);
            } else {
                onChange(null);
                setCustomValue(null);
            }
        } else {
            onChange(null);
            setCustomValue(null);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        if (newValue) {
            setCustomValue(newValue);
        } else {
            onChange(null);
            setCustomValue(null);
        }
    };

    const onDatesChange: DayPickerRangeControllerShape["onDatesChange"] = (range) => {
        const newStartDate = range.startDate ? range.startDate.toDate() : null;
        const newEndDate = focusedOnStartingDate ? null : range.endDate ? range.endDate.toDate() : null;

        if (!focusedOnStartingDate) hidePicker();
        setFocusedOnStartingDate(!focusedOnStartingDate);
        onChange({ start: newStartDate, end: newEndDate });
    };

    const rootClasses: string[] = [classes.root];
    if (disabled) rootClasses.push(classes.disabled);
    if (fullWidth) rootClasses.push(classes.fullWidth);

    return (
        <ClickAwayListener
            onClickAway={() => {
                setEndValueIfNotSet();
                hidePicker();
            }}
        >
            <div ref={rootRef} className={rootClasses.join(" ")}>
                <InputBase
                    classes={{ root: classes.inputBase }}
                    endAdornment={showClearButton ? <ClearInputButton onClick={() => onChange(null)} disabled={!value} /> : undefined}
                    disabled={disabled}
                    placeholder={placeholderText}
                    value={displayValue}
                    onFocus={showPicker}
                    onBlur={onInputBlur}
                    onChange={onInputChange}
                    inputProps={{
                        autoComplete: "off",
                        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Tab") {
                                // Hide picker, if tab is pressed. This cannot be done in `onBlur` because the input-blur-event is also called,
                                // when clicking inside the picker and the picker would be hidden, before `onDateChange` could be called.
                                setEndValueIfNotSet();
                                hidePicker();
                            }
                        },
                        ...inputProps,
                    }}
                    {...restProps}
                    {...restInput}
                />
                <Popper open={showPopper} anchorEl={rootRef.current} placement="bottom-start" keepMounted className={classes.popper} disablePortal>
                    <Paper>
                        <Typography component={"div"}>
                            {showDayPicker && (
                                <DayPickerRangeController
                                    startDate={getDateControllerText(input.value?.start)}
                                    endDate={getDateControllerText(input.value?.end)}
                                    onDatesChange={onDatesChange}
                                    initialVisibleMonth={null}
                                    onFocusChange={() => {}}
                                    focusedInput={focusedOnStartingDate ? "startDate" : "endDate"}
                                    hideKeyboardShortcutsPanel
                                    numberOfMonths={2}
                                    minimumNights={0}
                                    {...dateControllerProps}
                                />
                            )}
                        </Typography>
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export const FinalFormDateRangePicker = withStyles(styles, { name: "CometAdminDateRangePicker" })(Picker);
