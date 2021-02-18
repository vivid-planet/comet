import { ClickAwayListener, InputBaseProps, List, ListItem, ListItemText, Paper, Popper, WithStyles } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import moment = require("moment");
import { InputBase } from "@comet/admin";
import { ClearInputButton } from "@comet/admin/lib/common/ClearInputButton";
import { withStyles } from "@material-ui/styles";

import styles from "./TimePicker.styles";

export interface TimePickerProps extends InputBaseProps {
    minuteStep?: number;
    emptyOptionLabel?: string;
    showClearButton?: boolean;
}

interface TimeOption {
    label: string;
    value: string;
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

const Picker: React.FC<WithStyles<typeof styles> & TimePickerProps & FieldRenderProps<string, HTMLInputElement>> = ({
    classes,
    input,
    disabled,
    placeholder,
    emptyOptionLabel,
    minuteStep = 15,
    fullWidth = false,
    showClearButton,
    ...restProps
}) => {
    const intl = useIntl();
    const localeName = intl.locale;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    const placeholderText = placeholder
        ? placeholder
        : intl.formatMessage({ id: "cometAdmin.dateTime.timePicker.placeholder", defaultMessage: "Time" });
    const emptyOptionLabelText = emptyOptionLabel
        ? emptyOptionLabel
        : intl.formatMessage({ id: "cometAdmin.dateTime.timePicker.emptyOption", defaultMessage: "No Selection" });

    const { value: inputValue, onChange, onBlur, onFocus, ...restInput } = input;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const paperRef = React.useRef<HTMLDivElement>(null);
    const selectedOptionRef = React.useRef<HTMLDivElement>(null);
    const [showPopper, setShowPopper] = React.useState<boolean>(false);
    const [displayValue, setDisplayValue] = React.useState<string>("");

    React.useEffect(() => {
        const valueAsDate = moment(inputValue, "HH:mm");
        const timeValue: moment.Moment | null = valueAsDate.isValid() ? valueAsDate : null;
        const defaultDisplayValue = timeValue ? timeValue.format("HH:mm") : "";
        setDisplayValue(defaultDisplayValue);
    }, [inputValue]);

    const timeOptions: TimeOption[] = [
        {
            label: emptyOptionLabelText,
            value: "",
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

        // Timeout is required, to make sure, the options have been rendered before scrolling to the option
        setTimeout(() => {
            if (paperRef.current && selectedOptionRef.current) {
                // Scroll to selected option (with one option-space above)
                paperRef.current.scrollTo({ top: selectedOptionRef.current.offsetTop - selectedOptionRef.current.clientHeight, behavior: "smooth" });
            }
        }, 0);
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

    const hidePicker = () => {
        setShowPopper(false);
        onBlur();
    };

    const rootClasses: string[] = [classes.root];
    if (disabled) rootClasses.push(classes.disabled);
    if (fullWidth) rootClasses.push(classes.fullWidth);

    return (
        <ClickAwayListener onClickAway={hidePicker}>
            <div ref={rootRef} className={rootClasses.join(" ")}>
                <InputBase
                    classes={{ root: classes.inputBase }}
                    endAdornment={showClearButton ? <ClearInputButton onClick={() => updateValue(null)} disabled={!inputValue} /> : undefined}
                    placeholder={placeholderText}
                    disabled={disabled}
                    value={displayValue}
                    onChange={onInputTextChanges}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    inputProps={{
                        autoComplete: "off",
                    }}
                    {...restProps}
                    {...restInput}
                />
                <Popper open={showPopper} anchorEl={rootRef.current} placement="bottom-start" keepMounted className={classes.popper}>
                    <Paper ref={paperRef}>
                        <List>
                            {timeOptions.map(({ label, value }, index) => {
                                const selected = value === inputValue;
                                return (
                                    <ListItem
                                        key={index}
                                        button
                                        dense
                                        selected={selected}
                                        ref={selected ? selectedOptionRef : undefined}
                                        onMouseDown={() => onListItemClicked(value)}
                                    >
                                        <ListItemText>{label}</ListItemText>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export const FinalFormTimePicker = withStyles(styles, { name: "CometAdminTimePicker" })(Picker);
