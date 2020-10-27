import zIndex from "@material-ui/core/styles/zIndex";
import { css, styled } from "@vivid-planet/react-admin-mui";

interface ISingleDatePickerWrapperProps {
    fullWidth: boolean;
    color: "primary" | "secondary" | "default";
}

export const SingleDatePickerWrapper = styled.div<ISingleDatePickerWrapperProps>`
    * {
        font: inherit;
    }

    ${({ fullWidth }) =>
        fullWidth &&
        css`
            .SingleDatePicker,
            .SingleDatePickerInput {
                display: block;
            }

            .DateInput {
                width: 100%;
            }
        `};

    .SingleDatePicker_picker {
        z-index: ${zIndex.modal};
    }

    .DateInput_fang {
        z-index: ${zIndex.modal + 1};
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

    td.CalendarDay {
        border: none;
        margin: 5px;
        border-radius: 50%;

        :hover {
            border: none;
            border-radius: 50%;

            ${({ theme, color }) =>
                color === "primary" || color === "secondary"
                    ? css`
                          background-color: ${theme.palette[color].light};
                          color: ${theme.palette[color].contrastText};
                      `
                    : css`
                          background-color: ${theme.palette.grey["200"]};
                          color: ${theme.palette.grey["700"]};
                      `};
        }

        &__selected {
            ${({ theme, color }) =>
                color === "primary" || color === "secondary"
                    ? css`
                          background: ${theme.palette[color].main};
                          color: ${theme.palette[color].contrastText};

                          :hover {
                              background: ${theme.palette[color].light};
                          }
                      `
                    : css`
                          background-color: ${theme.palette.grey["400"]};
                          color: ${theme.palette.grey["100"]};

                          :hover {
                              background-color: ${theme.palette.grey["300"]};
                              color: ${theme.palette.grey["100"]};
                          }
                      `};
        }
    }
`;
