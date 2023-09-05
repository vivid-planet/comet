import { ArrowDown, ArrowUp, Check, Clear, Close, MoreVertical, Search } from "@comet/admin-icons";
import {
    buttonBaseClasses,
    getSwitchUtilityClass,
    inputAdornmentClasses,
    inputBaseClasses,
    inputClasses,
    inputLabelClasses,
    svgIconClasses,
    SvgIconProps,
    switchClasses,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { getDataGridUtilityClass } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component, { palette, shadows, spacing }) => ({
    ...component,
    defaultProps: {
        components: {
            QuickFilterIcon: Search,
            QuickFilterClearIcon: Clear,
            FilterPanelDeleteIcon: Close,
            BooleanCellTrueIcon: Check,
            BooleanCellFalseIcon: Close,
            ColumnSortedAscendingIcon: ArrowUp,
            ColumnSortedDescendingIcon: ArrowDown,
            BaseTextField: (props: TextFieldProps) => <TextField {...props} InputLabelProps={{ shrink: true }} />,
            ColumnMenuIcon: (props: SvgIconProps) => <MoreVertical {...props} fontSize="medium" />,
            ...component?.defaultProps?.components,
        },
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",
        },
        columnsPanelRow: {
            marginBottom: spacing(2),

            [`& .${switchClasses.root}`]: {
                marginRight: 0,
            },
            [`& .${switchClasses.root} .${switchClasses.thumb}`]: {
                width: 10,
                height: 10,
            },
            [`& .${switchClasses.root} .${switchClasses.switchBase}`]: {
                padding: 3,
            },
            [`& .${switchClasses.root} .${switchClasses.switchBase}.${getSwitchUtilityClass("checked")}`]: {
                transform: "translateX(20px)",
            },
        },
        columnHeader: {
            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
        },
        columnHeadersInner: {
            padding: spacing(0, 2),
        },
        row: {
            padding: spacing(0, 2),
        },
        cell: {
            borderTop: `1px solid ${palette.grey[100]}`,

            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
            [`& .${getDataGridUtilityClass("booleanCell")}`]: {
                color: palette.grey[900],
            },
        },
        iconSeparator: {
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        filterForm: {
            padding: spacing(4),

            [`.${inputLabelClasses.root}`]: {
                display: "none",
            },
            [`.${inputClasses.root}`]: {
                marginTop: 0,
            },
            [`& .${inputAdornmentClasses.root}`]: {
                padding: spacing(0, 1, 0, 0),
            },
        },
        filterFormDeleteIcon: {
            justifyContent: "center",

            [`& .${svgIconClasses.root}`]: {
                width: 16,
                height: 16,
            },
        },
        filterFormColumnInput: {
            margin: spacing(0, 4),
        },
        filterFormOperatorInput: {
            margin: spacing(0, 4, 0, 0),
        },
        paper: {
            boxShadow: shadows[1],
        },
        // @ts-expect-error This key exists but is missing in the types.
        toolbarQuickFilter: {
            paddingBottom: 0,

            [`& .${svgIconClasses.root}`]: {
                fontSize: 16,
            },
            [`& .${buttonBaseClasses.root}`]: {
                alignSelf: "stretch",
                color: palette.grey[200],
                paddingLeft: 10,
                paddingRight: 10,
                fontSize: 12,
                marginRight: spacing(-2),
                borderRadius: 0,

                [`& .${svgIconClasses.root}`]: {
                    fontSize: "inherit",
                },
            },
            [`& .${inputBaseClasses.input}`]: {
                marginLeft: 0,
            },
        },
    }),
});
