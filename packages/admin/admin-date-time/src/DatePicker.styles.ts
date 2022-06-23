import { InputWithPopperClassKey } from "@comet/admin";
import { Theme } from "@mui/material";
import { createStyles, CSSProperties } from "@mui/styles";
import { deepmerge } from "@mui/utils";

import { DatePickerProps } from "./DatePicker";
import { getReactDateRangeStyles } from "./getReactDateRangeStyles";

export type DatePickerClassKey = InputWithPopperClassKey | "calendar";

export const styles = (theme: Theme) => {
    return createStyles<DatePickerClassKey, DatePickerProps>({
        root: {},
        inputBase: {},
        popper: {},
        paper: {},
        calendar: deepmerge<CSSProperties>(getReactDateRangeStyles(theme), {
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
    });
};
