import { ComponentsOverrides, Paper, Toolbar as MuiToolbar } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "../../mui/MasterLayoutContext";

export type ToolbarClassKey = "root" | "topBar" | "muiToolbar" | "mainContentContainer";

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

const Root = createComponentSlot(Paper)<ToolbarClassKey, OwnerState>({
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
    `,
);

const TopBar = createComponentSlot("div")<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "topBar",
})(css`
    min-height: 40px;
`);

const StyledToolbar = createComponentSlot(MuiToolbar)<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "muiToolbar",
})(
    ({ theme }) => css`
        display: flex;
        flex: 1;
        align-items: stretch;
        border-top: solid 1px ${theme.palette.grey["50"]};
        box-sizing: border-box;
        min-height: 60px;
        padding: 0 5px;

        ${theme.breakpoints.up("sm")} {
            min-height: 60px;
            padding: 0 10px;
        }

        @media (min-width: 0px) and (orientation: landscape) {
            min-height: 60px;
        }
    `,
);

const MainContentContainer = createComponentSlot("div")<ToolbarClassKey>({
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
        <Root elevation={elevation} ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <TopBar />
            <StyledToolbar {...slotProps?.muiToolbar}>
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
