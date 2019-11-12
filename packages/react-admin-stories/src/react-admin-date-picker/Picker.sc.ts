import { styled } from "@vivid-planet/react-admin-mui";
/* tslint:disable */
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
/* tslint:enable */

export const DateRangePickerWrapper = styled.div`
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
        background: #7d98b0;
        color: white;
    }

    .CalendarDay__selected_span:hover {
        background: #607384;
    }

    .CalendarDay__selected {
        background: #607384;
        color: white;
    }

    .CalendarDay__selected:hover {
        background: #607384;
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
        background-color: #7d98b0;
        color: white;
    }

    .CalendarDay__hovered_span:hover {
        background-color: #607384;
    }
`;

export const SingleDatePickerWrapper = styled.div`
    .DayPickerNavigation_button__default {
        border: none;
    }

    .CalendarDay__selected_span {
        background: #7d98b0;
        color: white;
    }

    .CalendarDay__selected_span:hover {
        background: #607384;
    }

    .CalendarDay__selected {
        background: #607384;
        color: white;
    }

    .CalendarDay__selected:hover {
        background: #607384;
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
        background-color: #7d98b0;
        color: white;
    }

    .CalendarDay__hovered_span:hover {
        background-color: #607384;
    }
`;
