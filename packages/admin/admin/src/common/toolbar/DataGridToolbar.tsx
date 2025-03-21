import { type ComponentsOverrides, Paper, type PaperProps } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type GridDensity, useGridApiContext } from "@mui/x-data-grid";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export type DataGridToolbarClassKey = "root" | GridDensity;

export type DataGridToolbarProps = PaperProps;

type OwnerState = {
    density: GridDensity;
};

export const DataGridToolbar = (inProps: DataGridToolbarProps) => {
    const { elevation = 1, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminDataGridToolbar" });
    const apiRef = useGridApiContext();
    const gridDensity = apiRef.current.state.density;

    const ownerState: OwnerState = {
        density: gridDensity,
    };

    return <Root ownerState={ownerState} elevation={elevation} {...restProps} />;
};

const Root = createComponentSlot(Paper)<DataGridToolbarClassKey, OwnerState>({
    componentName: "DataGridToolbar",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.density];
    },
})(
    ({ ownerState, theme }) => css`
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding: ${theme.spacing(2)};

        ${ownerState.density === "comfortable" &&
        css`
            ${theme.breakpoints.up("sm")} {
                padding-top: ${theme.spacing(4)};
                padding-bottom: ${theme.spacing(4)};
            }
        `}

        .CometAdminToolbarItem-root,
        .CometAdminToolbarActions-root {
            // Hide components that were required by the old usage of DataGridToolbar but would now break the styling.
            // This is for usages of components that use ToolbarItem internally, such as ToolbarTitleItem or for existing projects where the usage was not updated.
            display: contents;
        }

        [class*="MuiDataGrid-toolbarQuickFilter"] {
            width: 120px;

            ${theme.breakpoints.up("sm")} {
                width: 150px;
            }

            ${theme.breakpoints.up("md")} {
                width: "auto";
            }
        }
    `,
);

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
