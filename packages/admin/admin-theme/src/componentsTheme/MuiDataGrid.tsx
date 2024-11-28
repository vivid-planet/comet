import { ArrowDown, ArrowUp, Check, Clear, Close, MoreVertical, Search } from "@comet/admin-icons";
import { inputAdornmentClasses, inputClasses, inputLabelClasses, svgIconClasses, SvgIconProps, TextField, TextFieldProps } from "@mui/material";
import { getDataGridUtilityClass, GRID_DEFAULT_LOCALE_TEXT, gridClasses } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component, { palette, shadows, spacing }) => ({
    ...component,
    defaultProps: {
        slots: {
            QuickFilterIcon: Search,
            QuickFilterClearIcon: Clear,
            FilterPanelDeleteIcon: Close,
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
        },
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",
        },
        /*
        TODO: @ricky any clue what this is?
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
        },*/
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
        iconSeparator: {
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        panelContent: {
            [`& .${gridClasses.filterForm}:first-child .${gridClasses.filterFormLogicOperatorInput}`]: {
                ["@media (max-width: 900px)"]: {
                    display: "none",
                },
            },
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

            ["@media (max-width: 900px)"]: {
                flexDirection: "column",
                padding: 0,
            },
        },
        filterFormLogicOperatorInput: {
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
            boxShadow: shadows[1],
        },
        /*
        TODO: check where this is needed
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
        */
    }),
});
