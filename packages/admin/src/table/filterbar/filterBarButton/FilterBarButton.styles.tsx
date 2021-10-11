import { createStyles, Theme } from "@material-ui/core";

import { FilterBarButtonProps } from "./FilterBarButton";

export type FilterBarButtonClassKey = "root" | "selected" | "open" | "withFilterBadge" | "filterBadge" | "labelWrapper" | "labelWrapperWithValues";

export const styles = (theme: Theme) => {
    return createStyles<FilterBarButtonClassKey, FilterBarButtonProps>({
        root: {
            position: "relative",
            alignItems: "center",
            padding: "10px 15px",
            cursor: "pointer",
            display: "flex",
            border: `1px solid ${theme.palette.grey[100]}`,

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
        selected: {
            border: `1px solid ${theme.palette.grey[400]}`,
            "&:disabled": {
                border: `1px solid ${theme.palette.grey[100]}`,
            },
        },
        open: {
            border: `1px solid ${theme.palette.grey[400]}`,
        },
        withFilterBadge: {
            "& [class*='MuiButton-endIcon']": {
                marginLeft: "6px",
            },
        },
        filterBadge: {
            marginLeft: "6px",
        },
        labelWrapper: {
            boxSizing: "border-box",
            "& [class*='MuiTypography-body1']": {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },
        labelWrapperWithValues: {
            "& [class*='MuiTypography-body1']": {
                fontWeight: theme.typography.fontWeightBold,
            },
        },
    });
};
