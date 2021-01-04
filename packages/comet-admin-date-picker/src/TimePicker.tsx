import { InputBase, List, ListItem, ListItemText, Paper, Popper, WithStyles } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import moment = require("moment");
import { withStyles } from "@material-ui/styles";

import styles from "./TimePicker.styles";

export interface TimePickerProps {
    minuteStep?: number;
    emptyOptionLabel?: string;
    fullWidth?: boolean;
    endIcon?: React.ReactNode;
}

interface TimeOption {
    label: string;
    value: string | null;
}

const getListOfTimes = (minuteStep: number): TimeOption[] => {
    const startDate = moment().startOf("day");
    const endDate = moment().endOf("day");

    const startValue = startDate.format("HH:mm");
    const options: TimeOption[] = [
        {
            label: startValue,
            value: startValue,
        },
    ];

    let allTimesCollected: boolean = false;
    const lastTime = startDate;

    while (!allTimesCollected) {
        lastTime.add(minuteStep, "minutes");

        if (lastTime.isBefore(endDate)) {
            const value = lastTime.format("HH:mm");
            options.push({
                label: value,
                value: value,
            });
        } else {
            allTimesCollected = true;
        }
    }

    return options;
};

const TimePickerField: React.FC<WithStyles<typeof styles, true> & TimePickerProps & FieldRenderProps<string, HTMLInputElement>> = (props) => {
    const intl = useIntl();

    const localeName = intl.locale;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    const fallbackPlaceholder = intl.formatMessage({ id: "cometAdmin.datePicker.timePicker.defaultPlaceholder", defaultMessage: "Time" });
    const fallbackEmptyOptionLabel = intl.formatMessage({ id: "cometAdmin.datePicker.timePicker.emptyOptionLabel", defaultMessage: "No Selection" });

    const {
        theme,
        classes,
        input,
        disabled,
        endIcon,
        placeholder = fallbackPlaceholder,
        emptyOptionLabel = fallbackEmptyOptionLabel,
        minuteStep = 15,
        fullWidth = false,
        ...restProps
    } = props;
    const { value, onChange, onBlur, onFocus, ...restInput } = input;

    const rootRef = React.useRef(null);
    const [showPopper, setShowPopper] = React.useState<boolean>(false);
    const [displayValue, setDisplayValue] = React.useState<string>("");

    React.useEffect(() => {
        const valueAsDate = moment(value, "HH:mm");
        const timeValue: moment.Moment | null = valueAsDate.isValid() ? valueAsDate : null;
        const defaultDisplayValue = timeValue ? timeValue.format("HH:mm") : "";
        setDisplayValue(defaultDisplayValue);
    }, [value]);

    const timeOptions: TimeOption[] = [
        {
            label: emptyOptionLabel,
            value: null,
        },
        ...getListOfTimes(minuteStep),
    ];

    const setValue = (date: moment.Moment | null) => {
        if (!date) {
            onChange(null);
            setDisplayValue("");
        } else if (date.isValid()) {
            const stringValue = moment(date).format("HH:mm");
            onChange(stringValue);
            setDisplayValue(stringValue);
        }
    };

    const updateValue = (newValue: string | null) => {
        const value = newValue ? newValue.trim() : null;

        if (value === null) {
            setValue(null);
        } else {
            const newDateValue = moment(value, "HH:mm");

            if (newDateValue.isValid()) {
                setValue(newDateValue);
            } else {
                const numberValue = value.replace(/[^0-9]/g, "");
                let hourValue: number = parseInt(numberValue.substring(0, 2));
                let minuteValue: number = parseInt(numberValue.substring(2, 4));

                if (hourValue > 23) hourValue = 23;
                if (minuteValue > 59) minuteValue = 59;

                const newDateValue = moment(`${hourValue}:${minuteValue}`, "HH:mm");
                setValue(newDateValue);
            }
        }
    };

    const onInputTextChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value.replace(/[^0-9:]/g, "");
        setDisplayValue(newValue);
    };

    const onInputFocus = () => {
        setShowPopper(true);
        onFocus();
    };

    const onInputBlur = () => {
        setShowPopper(false);
        updateValue(displayValue);
        onBlur();
    };

    const onListItemClicked = (value: string | null) => {
        updateValue(value);
        setShowPopper(false);
    };

    const rootClasses: string[] = [classes.root];
    if (disabled) rootClasses.push(classes.disabled);
    if (fullWidth) rootClasses.push(classes.fullWidth);

    return (
        <div ref={rootRef} className={rootClasses.join(" ")}>
            <div className={classes.inputWrapper}>
                <InputBase
                    {...restProps}
                    {...restInput}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={classes.inputBase}
                    value={displayValue}
                    onChange={onInputTextChanges}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    inputProps={{
                        className: classes.input,
                        autoComplete: "off",
                    }}
                />
                {endIcon && <div className={classes.iconWrapper}>{endIcon}</div>}
            </div>
            <Popper open={showPopper} anchorEl={rootRef.current} placement="bottom-start" keepMounted className={classes.popper}>
                <Paper>
                    <List>
                        {timeOptions.map(({ label, value }, index) => (
                            <ListItem key={index} button dense onMouseDown={() => onListItemClicked(value)}>
                                <ListItemText>{label}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Popper>
        </div>
    );
};

export const TimePicker = withStyles(styles, { name: "CometAdminTimePicker", withTheme: true })(TimePickerField);
