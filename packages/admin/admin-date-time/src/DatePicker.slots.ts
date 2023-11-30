import { InputWithPopper, InputWithPopperClassKey, ThemedComponentBaseProps } from "@comet/admin";
import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CSSProperties } from "@mui/material/styles/createMixins";
import { deepmerge } from "@mui/utils";
import { Calendar as CalendarBase } from "react-date-range";

import { getReactDateRangeStyles } from "./getReactDateRangeStyles";

export type DatePickerClassKey = InputWithPopperClassKey | "calendar" | "startAdornment";

export type SlotProps = ThemedComponentBaseProps<{
    root: typeof InputWithPopper;
    startAdornment: typeof InputAdornment;
    calendar: typeof CalendarBase;
}>["slotProps"];

export const Root = styled(InputWithPopper, {
    name: "CometAdminDatePicker",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

export const StartAdornment = styled(InputAdornment, {
    name: "CometAdminDatePicker",
    slot: "startAdornment",
    overridesResolver(_, styles) {
        return [styles.startAdornment];
    },
})();

// TODO: Fix hover of first and last day of month
export const Calendar = styled(CalendarBase, {
    name: "CometAdminDatePicker",
    slot: "calendar",
    overridesResolver(_, styles) {
        return [styles.calendar];
    },
})(({ theme }) =>
    deepmerge<CSSProperties>(getReactDateRangeStyles(theme), {
        "& .rdrMonth:first-child:last-child .rdrMonthName": {
            display: "none",
        },
        "& .rdrDayStartPreview": {
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            left: 4,
        },
        "& .rdrDayEndPreview": {
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            right: 4,
        },
        "& .rdrDay": {
            "& .rdrSelected": {
                top: 0,
                bottom: 0,
                left: 4,
                right: 4,
                borderRadius: 4,
                backgroundColor: theme.palette.primary.main,

                "& ~ .rdrDayNumber span": {
                    fontWeight: theme.typography.fontWeightBold,
                    color: "white",
                },
                "& ~ .rdrDayStartPreview, & ~ .rdrDayEndPreview": {
                    display: "none",

                    "& ~ .rdrDayNumber span": {
                        color: "white",
                    },
                },
            },
            "& .rdrSelected ~ .rdrDayNumber span": {
                fontWeight: theme.typography.fontWeightBold,
            },
            "&.rdrDayPassive .rdrSelected ~ .rdrDayNumber span": {
                color: theme.palette.grey[100],
                fontWeight: theme.typography.fontWeightRegular,
            },
            "&.rdrDayToday": {
                "&.rdrDayPassive": {
                    "& .rdrSelected, & .rdrDayStartPreview, & .rdrDayEndPreview": {
                        "&  ~ .rdrDayNumber span": {
                            color: theme.palette.grey[100],
                        },
                    },
                    "& .rdrSelected": {
                        backgroundColor: theme.palette.grey[50],
                        display: "block",

                        "&  ~ .rdrDayNumber span": {
                            color: theme.palette.grey[100],
                        },
                    },
                },
                "& .rdrSelected ~ .rdrDayNumber span": {
                    fontWeight: theme.typography.fontWeightBold,
                },
            },
        },
    }),
);
