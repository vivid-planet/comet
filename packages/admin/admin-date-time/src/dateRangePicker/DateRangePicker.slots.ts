import { InputWithPopper, InputWithPopperClassKey, ThemedComponentBaseProps } from "@comet/admin";
import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CSSProperties } from "@mui/styles";
import { deepmerge } from "@mui/utils";
import { DateRange as ReactDateRange } from "react-date-range";

import { getReactDateRangeStyles } from "../utils/getReactDateRangeStyles";

export type DateRangePickerClassKey = InputWithPopperClassKey | "dateRange" | "startAdornment";

export type SlotProps = ThemedComponentBaseProps<{
    root: typeof InputWithPopper;
    startAdornment: typeof InputAdornment;
    dateRange: typeof ReactDateRange;
}>["slotProps"];

export const Root = styled(InputWithPopper, {
    name: "CometAdminDateRangePicker",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

export const StartAdornment = styled(InputAdornment, {
    name: "CometAdminDateRangePicker",
    slot: "startAdornment",
    overridesResolver(_, styles) {
        return [styles.startAdornment];
    },
})();

export const DateRange = styled(ReactDateRange, {
    name: "CometAdminDateRangePicker",
    slot: "dateRange",
    overridesResolver(_, styles) {
        return [styles.dateRange];
    },
})(({ theme }) =>
    deepmerge<CSSProperties>(getReactDateRangeStyles(theme), {
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
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
            },
            "& .rdrEndEdge": {
                left: 0,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
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
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
            },
            "& .rdrDayEndPreview": {
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
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
);
