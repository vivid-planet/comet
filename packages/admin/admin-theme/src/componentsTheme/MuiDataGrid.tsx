import { ArrowDown, ArrowUp, Check, Clear, Close, Delete, MoreVertical, Search } from "@comet/admin-icons";
import {
    buttonBaseClasses,
    buttonClasses,
    formControlClasses,
    iconButtonClasses,
    inputAdornmentClasses,
    inputBaseClasses,
    inputClasses,
    inputLabelClasses,
    svgIconClasses,
    SvgIconProps,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { getDataGridUtilityClass, GRID_DEFAULT_LOCALE_TEXT, gridClasses } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component, { palette, shadows, spacing }) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
        disableRowSelectionOnClick: true,
        slots: {
            /* @TODO: add FilterPanelAddIcon to display Comet Add Icon once MUI Datagrid is updated to v6 or higher  */
            QuickFilterIcon: Search,
            QuickFilterClearIcon: Clear,
            FilterPanelDeleteIcon: Delete,
            BooleanCellTrueIcon: Check,
            BooleanCellFalseIcon: Close,
            ColumnSortedAscendingIcon: ArrowUp,
            ColumnSortedDescendingIcon: ArrowDown,
            BaseTextField: (props: TextFieldProps) => <TextField {...props} InputLabelProps={{ shrink: true }} />,
            ColumnMenuIcon: (props: SvgIconProps) => <MoreVertical {...props} fontSize="medium" />,
            ...component?.defaultProps?.slots,
        },
        localeText: {
            noRowsLabel: GRID_DEFAULT_LOCALE_TEXT.noResultsOverlayLabel,
            ...component?.defaultProps?.localeText,
        },
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",
        },
        columnHeader: {
            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
        },
        pinnedColumns: {
            backgroundColor: "white",
            boxShadow: shadows[2],
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
        footerContainer: {
            borderTop: `1px solid ${palette.grey[100]}`,
        },
        iconSeparator: {
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        panel: {
            ["@media (max-width: 900px)"]: {
                width: "100%",
                transform: "translate3d(0,0,0)",
            },
        },
        panelContent: {
            padding: spacing(1, 0),
            [`& .${gridClasses.filterForm}:first-child .${gridClasses.filterFormLogicOperatorInput}`]: {
                display: "flex",
            },
            ["@media (max-width: 900px)"]: {
                maxHeight: "none",
                padding: 0,
            },
        },
        filterForm: {
            margin: spacing(5, 4, 0, 4),
            padding: spacing(2, 1),
            gap: "5px",
            borderBottom: `1px solid ${palette.grey[50]}`,
            ["@media (max-width: 900px)"]: {
                flexDirection: "row",
                flexWrap: "wrap",
                margin: spacing(4, 4, 0, 4),
                gap: 0,
                padding: 0,
                paddingBottom: spacing(5),
                "&:last-child": {
                    marginBottom: 0,
                    paddingBottom: 0,
                },
            },
            "&:last-child": {
                border: "none",
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
                    position: "relative",
                    transform: "unset",
                },
            },
            [`.${inputClasses.root}`]: {
                marginTop: 0,
            },
            [`& .${inputAdornmentClasses.root}`]: {
                padding: spacing(0, 1, 0, 0),
            },
        },
        filterFormLogicOperatorInput: {
            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 1),
                width: "27.2%",
            },
        },
        filterFormDeleteIcon: {
            justifyContent: "center",

            [`& .${svgIconClasses.root}`]: {
                width: 16,
                height: 16,
            },

            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 1),
                alignItems: "flex-start",
                justifyContent: "flex-end",
                width: "11.1%",
            },
        },
        panelFooter: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: "7px 0",
            [`.${buttonClasses.root}`]: {
                color: palette.primary.main,
            },
            ["@media (max-width: 900px)"]: {
                justifyContent: "center",
                boxShadow: shadows[4],
            },
        },
        filterFormColumnInput: {
            marginRight: spacing(4),

            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 1),
                width: "61.6%",
            },
        },
        filterFormOperatorInput: {
            margin: spacing(0, 4, 0, 0),

            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 1),
                width: "38.3%",
            },
        },
        filterFormValueInput: {
            ["@media (max-width: 900px)"]: {
                padding: spacing(2, 1),
                width: "61.6%",
            },
        },
        paper: {
            boxShadow: shadows[4],
            border: `1px solid ${palette.divider}`,
            borderRadius: "4px",
            ["@media (max-width: 900px)"]: {
                height: "100%",
                maxHeight: "none",
            },
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
