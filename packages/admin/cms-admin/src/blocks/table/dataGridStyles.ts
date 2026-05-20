import type { SxProps, Theme } from "@mui/material";

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
        backgroundColor: theme.palette.background.paper,

        '&[data-field="__reorder__"]': {
            position: "sticky",
            left: 0,
            zIndex: 2,
        },

        '&[data-field="actions"]': {
            position: "sticky",
            right: 0,
            zIndex: 2,
            borderRight: "none",
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
        },
    },

    ".MuiDataGrid-cell": {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        borderRight: `1px solid ${theme.palette.grey[100]}`,
        borderTop: "none",
        backgroundColor: theme.palette.background.paper,

        "&.MuiDataGrid-cellEmpty[role='presentation']": {
            display: "none",
        },

        '&[data-field="__reorder__"]': {
            position: "sticky",
            left: 0,
            zIndex: 1,
            padding: 0,
        },

        '&[data-field="actions"]': {
            position: "sticky",
            right: 0,
            zIndex: 1,
            display: "flex",
            borderRight: "none",
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
        },
    },

    ".MuiDataGrid-columnSeparator": {
        display: "none",
    },
});
