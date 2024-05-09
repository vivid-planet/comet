import { ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { Toolbar, ToolbarProps } from "./Toolbar";

export type DataGridToolbarClassKey = "root";

export type DataGridToolbarProps = Omit<ToolbarProps, "slotProps" | "scopeIndicator" | "hideTopBar" | "hideBottomBar"> &
    ThemedComponentBaseProps<{
        root: typeof Toolbar;
    }>;

const Root = createComponentSlot(Toolbar)<DataGridToolbarClassKey>({
    componentName: "DataGridToolbar",
    slotName: "root",
})();

export const DataGridToolbar = (inProps: DataGridToolbarProps) => {
    const props = useThemeProps({ props: inProps, name: "CometAdminDataGridToolbar" });
    return <Root {...props} hideTopBar />;
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
