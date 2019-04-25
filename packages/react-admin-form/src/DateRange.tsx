import { InputBaseProps } from "@material-ui/core/InputBase";
import Popover from "@material-ui/core/Popover";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { LocaleContext } from "@vivid-planet/react-admin-date-fns";
import { styled } from "@vivid-planet/react-admin-mui";
import { format } from "date-fns";
import * as de from "date-fns/locale/de";
import * as React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { FieldRenderProps } from "react-final-form";
import { StyledInput } from "./Input";

registerLocale("de", de);

const ExtendedStyledInput = styled<InputBaseProps>(StyledInput)`
    & input {
        cursor: default;
    }
`;

export const DateRange: React.FunctionComponent<InputBaseProps & FieldRenderProps> = ({ meta, input, innerRef, ...props }) => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const locale = React.useContext(LocaleContext);

    let formattedValue = "";
    if (input.value) {
        if (input.value.start) formattedValue += format(input.value.start, "P", { locale });
        formattedValue += " - ";
        if (input.value.end) formattedValue += format(input.value.end, "P", { locale });
    }
    return (
        <>
            <ExtendedStyledInput
                {...input}
                {...props}
                value={formattedValue}
                readOnly={true}
                endAdornment={<DateRangeIcon />}
                autoComplete="off"
                onClick={event => {
                    setAnchorEl(event.currentTarget);
                }}
            />
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <DatePicker
                    inline
                    locale="de"
                    selected={startDate}
                    selectsStart
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    onChange={newValue => {
                        setStartDate(newValue);
                        input.onChange({
                            start: newValue,
                            end: endDate,
                        });
                    }}
                />
                <DatePicker
                    inline
                    locale="de"
                    selected={endDate}
                    selectsEnd
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    onChange={newValue => {
                        setEndDate(newValue);
                        input.onChange({
                            start: startDate,
                            end: newValue,
                        });
                    }}
                />
            </Popover>
        </>
    );
};
