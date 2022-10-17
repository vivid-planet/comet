import { InputWithPopperClassKey } from "@comet/admin";
import { Theme } from "@mui/material";
import { createStyles, CSSProperties } from "@mui/styles";
import { deepmerge } from "@mui/utils";

import { DateRangePickerProps } from "./DateRangePicker";
import { getReactDateRangeStyles } from "./getReactDateRangeStyles";

export type DateRangePickerClassKey = InputWithPopperClassKey | "calendar";

export const styles = (theme: Theme) => {
    return createStyles<DateRangePickerClassKey, DateRangePickerProps>({
        root: {},
        inputBase: {},
        popper: {},
        paper: {},
        calendar: deepmerge<CSSProperties>(getReactDateRangeStyles(theme), {
            "& .rdrDay": {
                "& .rdrStartEdge, & .rdrEndEdge, & .rdrInRange": {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 0,
                    top: 0,
                    bottom: 0,

                    "& ~ .rdrDayNumber span:nth-child(n)": {
                        fontWeight: theme.typography.fontWeightBold,
                        color: "white",
                    },
                    "& ~ .rdrDayEndPreview.rdrDayStartPreview": {
                        backgroundColor: "transparent",
                        borderRadius: 0,

                        "& ~ .rdrDayNumber span:nth-child(n)": {
                            fontWeight: theme.typography.fontWeightBold,
                            color: "white",
                        },
                    },
                },
                "& .rdrStartEdge": {
                    right: 0,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                },
                "& .rdrEndEdge": {
                    left: 0,
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                },
                "& .rdrInRange": {
                    borderRadius: 0,
                    opacity: 0.7,
                    right: 0,
                    left: 0,
                },
                "& .rdrDayEndPreview, & .rdrDayStartPreview, & .rdrDayInPreview": {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 0,

                    "& ~ .rdrDayNumber span:nth-child(n)": {
                        fontWeight: theme.typography.fontWeightBold,
                        color: "white",

                        "&:after": {
                            backgroundColor: "currentColor",
                        },
                    },
                },
                "& .rdrDayStartPreview": {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                },
                "& .rdrDayEndPreview": {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                },
                "& .rdrDayEndPreview.rdrDayStartPreview": {
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: 4,

                    "& ~ .rdrDayNumber span:nth-child(n)": {
                        color: theme.palette.text.primary,
                        fontWeight: theme.typography.fontWeightRegular,

                        "&:after": {
                            backgroundColor: theme.palette.primary.main,
                        },
                    },
                },
                "& .rdrDayInPreview": {
                    opacity: 0.7,
                    border: "none",
                    top: 0,
                    bottom: 0,
                },
                "&.rdrDayToday": {
                    "& .rdrInRange ~ .rdrDayNumber span": {
                        fontWeight: theme.typography.fontWeightBold,
                    },
                    "& .rdrStartEdge, & .rdrEndEdge, & .rdrInRange": {
                        "& ~ .rdrDayNumber span:nth-child(n)": {
                            "&:after": {
                                backgroundColor: "white",
                            },
                        },
                    },
                },
                "&.rdrDayPassive": {
                    "& .rdrDayEndPreview, & .rdrDayStartPreview, & .rdrDayInPreview, & .rdrStartEdge, & .rdrEndEdge, & .rdrInRange": {
                        "& ~ .rdrDayNumber span:nth-child(n)": {
                            fontWeight: theme.typography.fontWeightRegular,
                            color: theme.palette.grey[100],
                        },

                        "&:after": {
                            backgroundColor: "currentColor",
                        },
                    },
                },
            },
        }),
    });
};
