import { styled } from "@vivid-planet/react-admin-mui";
/* tslint:disable */
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
/* tslint:enable */

interface IColorProps {
    colorSelectedDate?: string;
    colorDaysBetween?: string;
    colorHover?: string;
    colorHoverSelected?: string;
}

export const DateRangePickerWrapper = styled.div<IColorProps>`
    .DateRangePickerInput_clearDates__small {
        display: flex;
    }

    .DateRangePickerInput_clearDates_default:hover {
        background: unset;
    }

    .DayPickerNavigation_button__default {
        border: none;
    }

    .CalendarDay__selected_span {
        background: ${props => (props.colorDaysBetween ? props.colorDaysBetween : "#7d98b0")};
        color: white;
    }

    .CalendarDay__selected_span:hover {
        background: ${props => (props.colorHoverSelected ? props.colorHoverSelected : "#607384")};
    }

    .CalendarDay__selected {
        background: ${props => (props.colorSelectedDate ? props.colorSelectedDate : "#607384")};
        color: white;
    }

    .CalendarDay__selected:hover {
        background: ${props => (props.colorHoverSelected ? props.colorHoverSelected : "#607384")};
    }

    td {
        border: none;
        margin: 5px;
        border-radius: 50%;
    }

    td:hover {
        border: none;
        border-radius: 50%;
        color: white;
    }

    .CalendarDay__hovered_span {
        background-color: ${props => (props.colorDaysBetween ? props.colorDaysBetween : "#7d98b0")};
        color: white;
    }

    .CalendarDay__hovered_span:hover {
        background-color: ${props => (props.colorHoverSelected ? props.colorHoverSelected : "#607384")};
    }
`;

export const SingleDatePickerWrapper = styled.div<IColorProps>`
    .DayPickerNavigation_button__default {
        border: none;
    }

    .CalendarDay__selected {
        background: ${props => (props.colorSelectedDate ? props.colorSelectedDate : "#607384")};
        color: white;
    }

    .CalendarDay__selected:hover {
        background: ${props => (props.colorHoverSelected ? props.colorHoverSelected : "#607384")};
    }

    td {
        border: none;
        margin: 5px;
        border-radius: 50%;
    }

    td:hover {
        border: none;
        border-radius: 50%;
        color: white;
    }
`;
