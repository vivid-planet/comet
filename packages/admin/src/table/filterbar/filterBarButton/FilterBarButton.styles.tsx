import { createStyles, Theme } from "@material-ui/core";

import { FilterBarButtonProps } from "./FilterBarButton";

export type FilterBarButtonClassKey = "root" | "open" | "hasDirtyFields" | "filterBadge";

export const styles = (theme: Theme) => {
    return createStyles<FilterBarButtonClassKey, FilterBarButtonProps>({
        root: {
            position: "relative",
            alignItems: "center",
            padding: "10px 15px",
            cursor: "pointer",
            display: "flex",
            border: `1px solid ${theme.palette.grey[100]}`,
            textTransform: "initial",
            fontWeight: theme.typography.fontWeightRegular,

            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },

            "&:active": {
                border: `1px solid ${theme.palette.grey[400]}`,
                backgroundColor: "initial",
            },

            "&:hover, &:focus": {
                border: `1px solid ${theme.palette.primary.main}`,
                backgroundColor: "initial",
            },

            "& [class*='MuiButton-startIcon']": {
                marginRight: "6px",
            },

            "& [class*='MuiButton-endIcon']": {
                marginLeft: "10px",
            },
        },
        open: {
            border: `1px solid ${theme.palette.grey[400]}`,
        },
        hasDirtyFields: {
            border: `1px solid ${theme.palette.grey[400]}`,
            fontWeight: theme.typography.fontWeightBold,

            "&:disabled": {
                border: `1px solid ${theme.palette.grey[100]}`,
            },

            "& [class*='MuiButton-endIcon']": {
                marginLeft: "6px",
            },
        },
        filterBadge: {
            marginLeft: "6px",
        },
    });
};
