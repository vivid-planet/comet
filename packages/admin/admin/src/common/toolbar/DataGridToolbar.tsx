import { type ComponentsOverrides } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { useGridApiContext } from "@mui/x-data-grid";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { Toolbar, type ToolbarProps } from "./Toolbar";

export type DataGridToolbarClassKey = "root" | "standard" | "comfortable" | "compact";

export type DataGridToolbarProps = {
    /** @deprecated The `density` prop is deprecated. The density is now used from the DataGrid. */
    density?: "standard" | "comfortable" | "compact";
} & Omit<ToolbarProps, "slotProps" | "scopeIndicator" | "hideTopBar"> &
    ThemedComponentBaseProps<{ root: typeof Toolbar }>;

type OwnerState = {
    density: "standard" | "comfortable" | "compact";
};

const Root = createComponentSlot(Toolbar)<DataGridToolbarClassKey, OwnerState>({
    componentName: "DataGridToolbar",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.density];
    },
})(
    ({ ownerState, theme }) => css`
        [class*="MuiDataGrid-toolbarQuickFilter"] {
            width: 120px;

            ${theme.breakpoints.up("sm")} {
                width: 150px;
            }

            ${theme.breakpoints.up("md")} {
                width: "auto";
            }
        }

        ${ownerState.density === "comfortable" &&
        css`
            min-height: 80px;

            ${theme.breakpoints.up("sm")} {
                min-height: 80px;
            }

            // necessary to override strange MUI default styling
            @media (min-width: 0px) and (orientation: landscape) {
                min-height: 80px;
            }
        `}
    `,
);

export const DataGridToolbar = (inProps: DataGridToolbarProps) => {
    const { density, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminDataGridToolbar" });

    const apiRef = useGridApiContext();
    const gridDensity = apiRef.current?.state?.density;

    const ownerState: OwnerState = {
        density: density || gridDensity,
    };

    return <Root ownerState={ownerState} hideTopBar {...slotProps?.root} {...restProps} headerHeight={0} />;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDataGridToolbar: DataGridToolbarClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDataGridToolbar: DataGridToolbarProps;
    }

    interface Components {
        CometAdminDataGridToolbar?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridToolbar"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridToolbar"];
        };
    }
}
