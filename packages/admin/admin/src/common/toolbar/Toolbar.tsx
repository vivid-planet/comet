import { ComponentsOverrides, Paper, Toolbar as MuiToolbar } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createSlot } from "../../helpers/createSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "../../mui/MasterLayoutContext";

export type ToolbarClassKey = "root" | "muiToolbar" | "mainContentContainer";

export interface ToolbarProps
    extends ThemedComponentBaseProps<{
        root: typeof Paper;
        muiToolbar: typeof MuiToolbar;
        mainContentContainer: "div";
    }> {
    elevation?: number;
    children?: React.ReactNode;
}

type OwnerState = {
    headerHeight: number;
};

const Root = createSlot(Paper)<ToolbarClassKey, OwnerState>({
    componentName: "Toolbar",
    slotName: "root",
})(
    ({ ownerState }) => css`
        position: sticky;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: ${ownerState.headerHeight}px;
        padding: 0;
        min-height: 80px;
    `,
);

const StyledToolbar = createSlot(MuiToolbar)<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "muiToolbar",
})(css`
    display: flex;
    flex: 1;
    align-items: stretch;
`);

const MainContentContainer = createSlot("div")<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "mainContentContainer",
})(css`
    display: flex;
    flex: 1;
`);

export const Toolbar = (inProps: ToolbarProps) => {
    const { children, elevation = 1, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbar" });
    const { headerHeight } = React.useContext(MasterLayoutContext);

    const ownerState: OwnerState = {
        headerHeight,
    };

    return (
        <Root elevation={elevation} ownerState={ownerState} {...slotProps?.root} {...restProps} square>
            <StyledToolbar {...slotProps?.muiToolbar} disableGutters>
                <MainContentContainer {...slotProps?.mainContentContainer}>{children}</MainContentContainer>
            </StyledToolbar>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbar: ToolbarClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbar: ToolbarProps;
    }

    interface Components {
        CometAdminToolbar?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbar"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbar"];
        };
    }
}
