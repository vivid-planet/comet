import { type SxProps, type Theme } from "@mui/material";

export const dataGridStyles: SxProps<Theme> = (theme) => ({
    "--DataGrid-rowBorderColor": theme.palette.grey[100],
    borderLeft: 0,
    borderRight: 0,

    ".MuiDataGrid-columnHeaderTitleContainerContent": {
        width: "100%",
        justifyContent: "flex-end",
    },

    ".MuiDataGrid-columnHeaders .MuiDataGrid-filler[role='presentation']": {
        display: "none",
    },

    ".MuiDataGrid-columnHeader": {
        borderRight: `1px solid ${theme.palette.grey[100]}`,

        "&.MuiDataGrid-columnHeader--pinnedLeft.MuiDataGrid-columnHeader--withRightBorder": {
            borderRight: `1px solid ${theme.palette.grey[100]}`,
            boxShadow: "none",
        },

        "&.MuiDataGrid-columnHeader--pinnedRight.MuiDataGrid-columnHeader--withLeftBorder": {
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
            boxShadow: "none",
        },

        "&:nth-last-of-type(4)": {
            // The last non-pinned cell should not have a border, as the pinned column already has one
            borderRight: "none",
        },
    },

    ".MuiDataGrid-cell": {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        borderRight: `1px solid ${theme.palette.grey[100]}`,
        borderTop: "none",

        "&.MuiDataGrid-cellEmpty[role='presentation']": {
            display: "none",
        },

        "&.MuiDataGrid-cell--pinnedLeft.MuiDataGrid-cell--withRightBorder": {
            borderRightWidth: 1,
            boxShadow: "none",
        },

        "&.MuiDataGrid-cell--pinnedRight.MuiDataGrid-cell--withLeftBorder": {
            borderLeftWidth: 1,
            boxShadow: "none",
        },

        "&:nth-last-of-type(3)": {
            // The last non-pinned cell should not have a border, as the pinned column already has one
            borderRight: "none",
        },

        '&[data-field="actions"]': {
            display: "flex",
            borderRight: "none",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
        },
    },

    ".MuiDataGrid-columnSeparator": {
        display: "none",
    },
});
