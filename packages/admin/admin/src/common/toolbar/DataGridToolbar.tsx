import { ComponentsOverrides } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { Toolbar, ToolbarProps } from "./Toolbar";

export type DataGridToolbarClassKey = "root";

export type DataGridToolbarProps = { density?: "standard" | "comfortable" } & Omit<
    ToolbarProps,
    "slotProps" | "scopeIndicator" | "hideTopBar" | "hideBottomBar"
> &
    ThemedComponentBaseProps<{
        root: typeof Toolbar;
    }>;

type OwnerState = {
    density: "standard" | "comfortable";
};

const Root = createComponentSlot(Toolbar)<DataGridToolbarClassKey, OwnerState>({
    componentName: "DataGridToolbar",
    slotName: "root",
})(
    ({ ownerState, theme }) => css`
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
    const { density = "standard", ...restProps } = useThemeProps({ props: inProps, name: "CometAdminDataGridToolbar" });

    const ownerState: OwnerState = {
        density,
    };

    return <Root {...restProps} hideTopBar ownerState={ownerState} />;
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
