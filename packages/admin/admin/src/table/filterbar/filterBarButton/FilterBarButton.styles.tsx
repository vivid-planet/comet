import { buttonClasses, svgIconClasses, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";

import { FilterBarButtonProps } from "./FilterBarButton";

export type FilterBarButtonClassKey = "root" | "open" | "hasDirtyFields" | "filterBadge";

export const styles = (theme: Theme) => {
    return createStyles<FilterBarButtonClassKey, FilterBarButtonProps>({
        root: {
            position: "relative",
            cursor: "pointer",
            display: "flex",
            backgroundColor: theme.palette.common.white,
            borderColor: theme.palette.grey[100],
            borderRadius: 2,

            [`& .${buttonClasses.startIcon} .${svgIconClasses.root}, & .${buttonClasses.endIcon} .${svgIconClasses.root}`]: {
                fontSize: 12,
            },

            "&:hover": {
                borderColor: theme.palette.grey[100],
                backgroundColor: theme.palette.common.white,
            },

            "&:focus": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.common.white,
            },
        },
        open: {
            borderColor: theme.palette.primary.main,
        },
        hasDirtyFields: {
            borderColor: theme.palette.grey[400],
            fontWeight: theme.typography.fontWeightBold,

            "&:disabled": {
                borderColor: theme.palette.grey[100],
            },
        },
        filterBadge: {
            marginLeft: "6px",
        },
    });
};
