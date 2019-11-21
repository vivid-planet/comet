import { styled } from "@vivid-planet/react-admin-mui";

interface IColorProps {
    colorSelectedDate?: string;
    colorHover?: string;
    colorHoverSelected?: string;
}

export const SingleDatePickerWrapper = styled.div<IColorProps>`
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
