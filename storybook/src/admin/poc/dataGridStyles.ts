import { SxProps, Theme } from "@mui/material";

export const dataGridStyles: SxProps<Theme> = (theme) => ({
    minHeight: "min(740px, calc(100vh - 40px))",
    borderLeft: 0,
    borderRight: 0,

    ".MuiDataGrid-columnHeaderTitleContainerContent": {
        width: "100%",
        justifyContent: "flex-end",
    },
    ".MuiDataGrid-columnHeader": {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
    },
    ".MuiDataGrid-cell": {
        position: "relative",
        borderBottom: `1px solid ${theme.palette.grey[100]} !important`,
        borderTop: "none",
    },
    ".MuiDataGrid-cell:not(:last-child), .MuiDataGrid-columnHeader:not(:last-child)": {
        borderRight: `1px solid ${theme.palette.grey[100]}`,
    },
    '.MuiDataGrid-cell[data-field="actions"]': {
        padding: 0,
        justifyContent: "center",
    },
    ".MuiDataGrid-columnSeparator": {
        display: "none",
    },
    ".MuiDataGrid-columnHeaders, .MuiDataGrid-cell": {
        borderBottom: "none",
    },
    ".MuiDataGrid-rowReorderCell": {
        height: "100%",
    },
    ".MuiDataGrid-pinnedColumns": {
        boxShadow: "none",

        "&--left .MuiDataGrid-cell": {
            borderRight: `1px solid ${theme.palette.grey[100]}`,
            paddingLeft: 0,
            paddingRight: 0,
        },

        "&--right .MuiDataGrid-cell": {
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
        },
    },
    ".MuiDataGrid-pinnedColumnHeaders": {
        boxShadow: "none",

        "&--left .MuiDataGrid-columnHeader": {
            borderRight: `1px solid ${theme.palette.grey[100]}`,
        },

        "&--right .MuiDataGrid-columnHeader": {
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
        },
    },
});
