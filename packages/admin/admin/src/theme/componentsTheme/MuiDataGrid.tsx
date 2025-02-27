import { ArrowDown, ArrowUp, Check, Clear, Close, Delete, MoreVertical, Search } from "@comet/admin-icons";
import {
    buttonBaseClasses,
<<<<<<< HEAD:packages/admin/admin/src/theme/componentsTheme/MuiDataGrid.tsx
    buttonClasses,
    formControlClasses,
=======
    getSwitchUtilityClass,
>>>>>>> main:packages/admin/admin-theme/src/componentsTheme/MuiDataGrid.tsx
    iconButtonClasses,
    inputBaseClasses,
    inputLabelClasses,
    nativeSelectClasses,
    svgIconClasses,
    type SvgIconProps,
    TextField,
    type TextFieldProps,
} from "@mui/material";
import { type Spacing } from "@mui/system";
import { getDataGridUtilityClass, GRID_DEFAULT_LOCALE_TEXT, gridClasses } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

const getDensityHeightValue = (density: string | unknown, spacing: Spacing) => {
    switch (density) {
        case "compact":
            return spacing(8);
        case "comfortable":
            return spacing(16);
        default:
            return spacing(12);
    }
};

const filtersLeftSectionWidth = 120;
const filterDeleteIconSize = 32;
const filterLeftSectionGap = 5;
const filterOperatorInputWidth = filtersLeftSectionWidth - filterDeleteIconSize - filterLeftSectionGap;

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component, { palette, shadows, spacing, breakpoints }) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
<<<<<<< HEAD:packages/admin/admin/src/theme/componentsTheme/MuiDataGrid.tsx
        disableRowSelectionOnClick: true,
        slots: {
            /* @TODO: add FilterPanelAddIcon to display Comet Add Icon once MUI Datagrid is updated to v6 or higher  */
=======
        components: {
>>>>>>> main:packages/admin/admin-theme/src/componentsTheme/MuiDataGrid.tsx
            QuickFilterIcon: Search,
            QuickFilterClearIcon: Clear,
            FilterPanelDeleteIcon: (props: SvgIconProps) => <Delete {...props} fontSize="medium" />,
            BooleanCellTrueIcon: Check,
            BooleanCellFalseIcon: Close,
            ColumnSortedAscendingIcon: ArrowUp,
            ColumnSortedDescendingIcon: ArrowDown,
            BaseTextField: (props: TextFieldProps) => <TextField {...props} InputLabelProps={{ shrink: true }} />,
            ColumnMenuIcon: (props: SvgIconProps) => <MoreVertical {...props} fontSize="medium" />,
            ...component?.defaultProps?.slots,
        },
        componentsProps: {
            ...component?.defaultProps?.componentsProps,
            baseButton: {
                color: "info",
                ...component?.defaultProps?.componentsProps?.baseButton,
            },
        },
        localeText: {
            noRowsLabel: GRID_DEFAULT_LOCALE_TEXT.noResultsOverlayLabel,
            columnsPanelTextFieldLabel: "",
            ...component?.defaultProps?.localeText,
        },
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",

            "& [class*='MuiDataGrid-toolbarQuickFilter']": {
                [`& > .${inputBaseClasses.root} .${inputBaseClasses.input}`]: {
                    paddingRight: 0, // Removes unnecessary spacing to the clear button that already has enough spacing
                    textOverflow: "ellipsis",
                },

                [`& > .${inputBaseClasses.root} .${inputBaseClasses.input}[value=''] + .${iconButtonClasses.root}`]: {
                    display: "none", // Prevents the disabled clear-button from overlaying the input value
                },
            },
        },
<<<<<<< HEAD:packages/admin/admin/src/theme/componentsTheme/MuiDataGrid.tsx
        columnHeader: ({ ownerState }) => ({
            /* !important is required to override inline styles */
            height: `${getDensityHeightValue(ownerState?.density, spacing)} !important`,
=======
        panelHeader: {
            padding: `4px 4px ${spacing(1)} 4px`,
            borderBottom: `1px solid ${palette.divider}`,
        },
        columnsPanel: {
            padding: 0,
        },
        columnsPanelRow: {
            marginBottom: spacing(2),

            "&:last-child": {
                marginBottom: 0,
            },

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
>>>>>>> main:packages/admin/admin-theme/src/componentsTheme/MuiDataGrid.tsx
            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
        }),
        columnHeaderTitleContainer: ({ ownerState }) => ({
            height: `${getDensityHeightValue(ownerState?.density, spacing)}`,
        }),
        pinnedColumns: {
            backgroundColor: "white",
            boxShadow: shadows[2],
        },
        row: ({ ownerState }) => ({
            height: `${getDensityHeightValue(ownerState?.density, spacing)}`,
            /* !important is required to override inline styles */
            minHeight: `${getDensityHeightValue(ownerState?.density, spacing)} !important`,
            maxHeight: `${getDensityHeightValue(ownerState?.density, spacing)} !important`,
        }),
        cell: ({ ownerState }) => ({
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
            height: `${getDensityHeightValue(ownerState?.density, spacing)}`,
            alignContent: "center",
        }),
        footerContainer: ({ ownerState }) => ({
            borderTop: `1px solid ${palette.grey[100]}`,
            boxSizing: "border-box",
            minHeight: getDensityHeightValue(ownerState?.density, spacing),
            maxHeight: getDensityHeightValue(ownerState?.density, spacing),

            "& .MuiTablePagination-root > .MuiToolbar-root": {
                height: getDensityHeightValue(ownerState?.density, spacing),
                minHeight: getDensityHeightValue(ownerState?.density, spacing),
            },
        }),

        iconSeparator: {
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        panelContent: {
<<<<<<< HEAD:packages/admin/admin/src/theme/componentsTheme/MuiDataGrid.tsx
            padding: spacing(1, 0),
            [`& .${gridClasses.filterForm}:first-child .${gridClasses.filterFormLogicOperatorInput}`]: {
                display: "flex",
            },
            ["@media (max-width: 900px)"]: {
                maxHeight: "none",
                padding: 0,
            },
=======
            padding: spacing(4),
        },
        paper: {
            border: `1px solid ${palette.grey[100]}`,
            boxShadow: shadows[4],
            borderRadius: 4,
            maxHeight: "none",
            flexDirection: "column",
>>>>>>> main:packages/admin/admin-theme/src/componentsTheme/MuiDataGrid.tsx
        },
        filterForm: {
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 0,

            [`${breakpoints.up("md")}`]: {
                flexWrap: "nowrap",
                gap: spacing(1),
            },

            ["&:not(:last-child)"]: {
                paddingBottom: spacing(4),
                marginBottom: spacing(4),
                borderBottom: `1px solid ${palette.divider}`,

                [`${breakpoints.up("md")}`]: {
                    paddingBottom: spacing(2),
                    marginBottom: spacing(2),
                    borderBottomColor: palette.grey[50],
                },
            },

            [`&:first-child .${gridClasses.filterFormLinkOperatorInput}`]: {
                // The first "Operator"-select is fully hidden by default when there is only one filter.
                // Setting `display: block` makes sure it takes up it's space as if it were visible to prevent the alignment from breaking.
                // Even though `display: block` is set now, it's still not visible, due to it's default styling of `visibility: hidden`.
                display: "block",
            },

            [`.${inputLabelClasses.root}`]: {
                position: "static",
                transform: "none",
                fontSize: 14,
                fontWeight: 600,
            },
<<<<<<< HEAD:packages/admin/admin/src/theme/componentsTheme/MuiDataGrid.tsx
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
=======

            [`.${nativeSelectClasses.select}`]: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
>>>>>>> main:packages/admin/admin-theme/src/componentsTheme/MuiDataGrid.tsx
            },
        },
        filterFormDeleteIcon: {
            width: filterDeleteIconSize,
            height: filterDeleteIconSize,
            marginRight: filterLeftSectionGap,
            marginTop: "auto",
            marginBottom: 3,
            justifyContent: "center",

            [`${breakpoints.up("md")}`]: {
                marginRight: 0,
            },

            [`& > .${iconButtonClasses.root}`]: {
                height: "100%",
            },
        },
        filterFormLinkOperatorInput: {
            width: filterOperatorInputWidth,
            marginRight: 0,

            [`${breakpoints.up("md")}`]: {
                width: 80,
            },
        },
        filterFormColumnInput: {
            width: `calc(100% - ${filtersLeftSectionWidth}px)`,
            paddingLeft: spacing(2),
            boxSizing: "border-box",

            [`${breakpoints.up("md")}`]: {
                width: 199,
                paddingLeft: 0,
            },
        },
        filterFormOperatorInput: {
            marginTop: spacing(3),
            flexBasis: filterOperatorInputWidth,
            flexGrow: 1,

            [`${breakpoints.up("md")}`]: {
                marginTop: 0,
                width: 110,
            },
        },
        filterFormValueInput: {
            width: `calc(100% - ${filtersLeftSectionWidth}px)`,
            paddingLeft: spacing(2),
            boxSizing: "border-box",
            marginTop: spacing(3),

            [`${breakpoints.up("md")}`]: {
                width: 199,
                paddingLeft: 0,
                marginTop: 0,
            },

            "&:empty": {
                display: "none", // Make space for `filterFormOperatorInput` to expand and take up the full width
            },

            [`& .${inputBaseClasses.root}`]: {
                marginTop: 0,
            },
        },
        panelFooter: {
            padding: spacing(2),
            borderTop: `1px solid ${palette.divider}`,
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
