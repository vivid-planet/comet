import { ArrowDown, ArrowUp, Check, Clear, Close, Delete, MoreVertical, Search } from "@comet/admin-icons";
import {
    buttonBaseClasses,
    buttonClasses,
    formControlClasses,
    getSwitchUtilityClass,
    iconButtonClasses,
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
import { getDataGridUtilityClass, GRID_DEFAULT_LOCALE_TEXT, gridClasses } from "@mui/x-data-grid";
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
            FilterPanelDeleteIcon: Delete,
            BooleanCellTrueIcon: Check,
            BooleanCellFalseIcon: Close,
            ColumnSortedAscendingIcon: ArrowUp,
            ColumnSortedDescendingIcon: ArrowDown,
            BaseTextField: (props: TextFieldProps) => <TextField {...props} InputLabelProps={{ shrink: true }} />,
            ColumnMenuIcon: (props: SvgIconProps) => <MoreVertical {...props} fontSize="medium" />,
            ...component?.defaultProps?.components,
        },
        localeText: {
            noRowsLabel: GRID_DEFAULT_LOCALE_TEXT.noResultsOverlayLabel,
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
        panelContent: {
            [`& .${gridClasses.filterForm}:first-child .${gridClasses.filterFormLinkOperatorInput}`]: {
                display: "flex",
                ["@media (max-width: 900px)"]: {
                    display: "none",
                },
            },
        },
        filterForm: {
            margin: spacing(5, 4, 0, 4),
            padding: "10px 5px",
            gap: "4px",
            borderBottom: `1px solid ${palette.grey[50]}`,
            "&:last-child": {
                border: "none",
                marginBottom: spacing(2),
            },
            "&:first-child": {
                marginTop: spacing(7),
            },
            [`.${formControlClasses.root}`]: {
                marginRight: 0,
            },
            [`.${iconButtonClasses.root}`]: {
                height: 32,
                width: 32,
            },
            [`.${inputLabelClasses.root}`]: {
                transform: "translateY(-22px)",
                fontSize: 14,
                ["@media (max-width: 900px)"]: {
                    display: "none",
                },
            },
            [`.${inputClasses.root}`]: {
                marginTop: 0,
            },
            [`& .${inputAdornmentClasses.root}`]: {
                padding: spacing(0, 1, 0, 0),
            },

            ["@media (max-width: 900px)"]: {
                flexDirection: "column",
                padding: 0,
            },
        },
        filterFormLinkOperatorInput: {
            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 4),
                width: "100%",
            },
        },
        filterFormDeleteIcon: {
            justifyContent: "center",

            [`& .${svgIconClasses.root}`]: {
                width: 16,
                height: 16,
            },

            ["@media (max-width: 900px)"]: {
                marginTop: spacing(4),
                marginRight: spacing(4),
                alignItems: "flex-end",
            },
        },
        panelFooter: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: "7px 0",
            [`.${buttonClasses.root}`]: {
                color: palette.text.primary,
            },
        },
        filterFormColumnInput: {
            marginRight: spacing(4),

            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 4),
                width: "100%",
            },
        },
        filterFormOperatorInput: {
            margin: spacing(0, 4, 0, 0),

            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 4),
                width: "100%",
            },
        },
        filterFormValueInput: {
            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 4),
                width: "100%",
            },
        },
        paper: {
            boxShadow: shadows[4],
            border: `1px solid ${palette.divider}`,
            borderRadius: "4px",
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
