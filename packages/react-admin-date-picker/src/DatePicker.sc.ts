import { styled } from "@vivid-planet/react-admin-mui";

export const SingleDatePickerWrapper = styled.div`
    * {
        font: inherit;
    }

    .DayPickerNavigation_button__default {
        border: none;
    }

    .DateRangePickerInput_clearDates__small {
        display: flex;
    }

    .DateRangePickerInput_clearDates_default:hover {
        background: unset;
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
`;
