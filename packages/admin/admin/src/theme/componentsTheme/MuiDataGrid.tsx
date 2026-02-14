import { ArrowDown, ArrowUp, Check, Clear, Close, Delete, MoreVertical, Search } from "@comet/admin-icons";
import {
    autocompleteClasses,
    buttonBaseClasses,
    Checkbox,
    checkboxClasses,
    iconButtonClasses,
    inputBaseClasses,
    inputLabelClasses,
    nativeSelectClasses,
    Select,
    svgIconClasses,
    type SvgIconProps,
    tablePaginationClasses,
    TextField,
    toolbarClasses,
} from "@mui/material";
import { COMFORTABLE_DENSITY_FACTOR, COMPACT_DENSITY_FACTOR, getDataGridUtilityClass, gridClasses } from "@mui/x-data-grid";

import { DataGridColumnsManagement } from "../../dataGrid/columnsManagement/DataGridColumnsManagement";
import { DataGridPanel } from "../../dataGrid/DataGridPanel";
import { DataGridPagination } from "../../dataGrid/pagination/DataGridPagination";
import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

const getDensityHeightValue = (density: string) => {
    switch (density) {
        case "compact":
            return 40;
        case "comfortable":
            return 80;
        default:
            return 60;
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
        disableRowSelectionOnClick: true,
        getRowHeight: ({ densityFactor }) => {
            if (densityFactor === COMPACT_DENSITY_FACTOR) {
                return getDensityHeightValue("compact");
            }

            if (densityFactor === COMFORTABLE_DENSITY_FACTOR) {
                return getDensityHeightValue("comfortable");
            }

            return getDensityHeightValue("standard");
        },
        slots: {
            baseCheckbox: Checkbox,
            quickFilterIcon: Search,
            quickFilterClearIcon: Clear,
            filterPanelDeleteIcon: (props: SvgIconProps) => <Delete {...props} fontSize="medium" />,
            baseTextField: TextField,
            baseSelect: Select,
            booleanCellTrueIcon: Check,
            booleanCellFalseIcon: Close,
            columnSortedAscendingIcon: ArrowUp,
            columnSortedDescendingIcon: ArrowDown,
            columnMenuIcon: (props: SvgIconProps) => <MoreVertical {...props} fontSize="medium" />,
            panel: DataGridPanel,
            pagination: DataGridPagination,
            columnsManagement: DataGridColumnsManagement,
            ...component?.defaultProps?.slots,
        },
        slotProps: {
            ...component?.defaultProps?.slotProps,
            baseButton: {
                color: "info",
                ...component?.defaultProps?.slotProps?.baseButton,
            },
        },
        localeText: {
            ...component?.defaultProps?.localeText,
        },
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",
        },
        panelHeader: {
            padding: `4px 4px ${spacing(1)} 4px`,
            borderBottom: `1px solid ${palette.divider}`,
        },
        columnsManagement: {
            padding: spacing(4),

            [`& .${gridClasses.columnsManagementRow}`]: {
                margin: 0,

                "&:last-child": {
                    marginBottom: 0,
                },

                [`& .${checkboxClasses.root}`]: {
                    padding: 9,
                },
            },
        },
        columnHeader: ({ ownerState }) => ({
            /* !important is required to override inline styles */
            height: `${getDensityHeightValue(ownerState?.density)}px !important`,

            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },

            [`&.${gridClasses["columnHeader--pinnedLeft"]}.${gridClasses["columnHeader--withRightBorder"]}`]: {
                boxShadow: shadows[2],
                clipPath: "inset(0 -8px 0 0)",
                borderRightWidth: 0,
            },

            [`&.${gridClasses["columnHeader--pinnedRight"]}.${gridClasses["columnHeader--withLeftBorder"]}`]: {
                boxShadow: shadows[2],
                clipPath: "inset(0 0 0 -8px)",
                borderLeftWidth: 0,
            },
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
            alignContent: "center",

            [`&.${gridClasses["cell--pinnedLeft"]}.${gridClasses["cell--withRightBorder"]}`]: {
                boxShadow: shadows[2],
                clipPath: "inset(0 -8px 0 0)",
                borderRightWidth: 0,
            },

            [`&.${gridClasses["cell--pinnedRight"]}.${gridClasses["cell--withLeftBorder"]}`]: {
                boxShadow: shadows[2],
                clipPath: "inset(0 0 0 -8px)",
                borderLeftWidth: 0,
            },
        }),
        footerContainer: ({ ownerState }) => ({
            borderTop: `1px solid ${palette.grey[100]}`,
            boxSizing: "border-box",
            minHeight: getDensityHeightValue(ownerState?.density),

            justifyContent: "start",
            [`& .${tablePaginationClasses.selectLabel}, & .${tablePaginationClasses.displayedRows}`]: {
                marginTop: 0,
                marginBottom: 0,
            },

            [`& .${tablePaginationClasses.root} > .${toolbarClasses.root}`]: {
                minHeight: getDensityHeightValue(ownerState?.density),
            },
        }),
        row: ({ ownerState }) => ({
            cursor: ownerState?.onRowClick ? "pointer" : undefined,
        }),
        iconSeparator: {
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        panelContent: {
            padding: spacing(4),
        },
        paper: {
            border: `1px solid ${palette.grey[100]}`,
            boxShadow: shadows[4],
            borderRadius: 4,
            maxHeight: "none",
            flexDirection: "column",
        },
        filterForm: {
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 0,

            [breakpoints.up("md")]: {
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

            [`&:first-child .${gridClasses.filterFormLogicOperatorInput}`]: {
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

            [`.${nativeSelectClasses.select}`]: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            },
        },
        filterFormDeleteIcon: {
            width: filterDeleteIconSize,
            height: filterDeleteIconSize,
            marginRight: filterLeftSectionGap,
            marginTop: "auto",
            marginBottom: 3,
            justifyContent: "center",

            [breakpoints.up("md")]: {
                marginRight: 0,
            },

            [`& > .${iconButtonClasses.root}`]: {
                height: "100%",
            },
        },
        filterFormLogicOperatorInput: {
            width: filterOperatorInputWidth,
            marginRight: 0,

            [breakpoints.up("md")]: {
                width: 80,
            },
        },
        filterFormColumnInput: {
            width: `calc(100% - ${filtersLeftSectionWidth}px)`,
            paddingLeft: spacing(2),
            boxSizing: "border-box",

            [breakpoints.up("md")]: {
                width: 199,
                paddingLeft: 0,
            },
        },
        filterFormOperatorInput: {
            marginTop: spacing(3),
            flexBasis: filterOperatorInputWidth,
            flexGrow: 1,

            [breakpoints.up("md")]: {
                marginTop: 0,
                width: 110,
            },
        },
        filterFormValueInput: {
            width: `calc(100% - ${filtersLeftSectionWidth}px)`,
            paddingLeft: spacing(2),
            boxSizing: "border-box",
            marginTop: spacing(3),

            [breakpoints.up("md")]: {
                width: 199,
                paddingLeft: 0,
                marginTop: 0,
            },

            "&:empty": {
                display: "none", // Make space for `filterFormOperatorInput` to expand and take up the full width
            },

            [`&& .${autocompleteClasses.inputRoot}`]: {
                padding: 0,
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                border: `1px solid ${palette.grey[100]}`,

                [`& > .${autocompleteClasses.input}`]: {
                    padding: `calc(${spacing(2)} - 1px)`,
                    display: "flex",
                    alignItems: "center",
                },

                [`& > .MuiOutlinedInput-notchedOutline`]: {
                    display: "none",
                },

                "&.Mui-focused": {
                    border: `1px solid ${palette.primary.main}`,
                },
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
            width: 120,

            [breakpoints.up("sm")]: {
                width: 150,
            },

            [breakpoints.up("md")]: {
                width: "auto",
            },

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

            [`& > .${inputBaseClasses.root} .${inputBaseClasses.input}`]: {
                paddingRight: 0, // Removes unnecessary spacing to the clear button that already has enough spacing
                textOverflow: "ellipsis",
            },

            [`& > .${inputBaseClasses.root} .${inputBaseClasses.input}[value=''] + .${iconButtonClasses.root}`]: {
                display: "none", // Prevents the disabled clear-button from overlaying the input value
            },
        },
    }),
});
