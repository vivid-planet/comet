import { styled } from "@vivid-planet/react-admin-mui";
/* tslint:disable */
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
/* tslint:enable */

export const DateRangePickerWrapper = styled.div`
    * {
        font: inherit;
    }

    .DateInput {
        position: static;
    }

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
        background: ${({ theme }) => theme.palette.secondary.main};
        color: white;
    }

    .CalendarDay__selected_span:hover {
        background: ${({ theme }) => theme.palette.primary.main};
    }

    .CalendarDay__selected {
        background: ${({ theme }) => theme.palette.primary.main};
        color: white;
    }

    .CalendarDay__selected:hover {
        background: ${({ theme }) => theme.palette.primary.main};
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
        background-color: ${({ theme }) => theme.palette.secondary.main};
        color: white;
    }

    .CalendarDay__hovered_span:hover {
        background-color: ${({ theme }) => theme.palette.primary.main};
    }
`;
