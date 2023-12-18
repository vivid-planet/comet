import { ComponentsOverrides, Paper, Toolbar as MuiToolbar } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

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

const Root = styled(Paper, {
    name: "CometAdminToolbar",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})<{ ownerState: OwnerState }>(
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

const StyledToolbar = styled(MuiToolbar, {
    name: "CometAdminToolbar",
    slot: "muiToolbar",
    overridesResolver(_, styles) {
        return [styles.toolbar];
    },
})(
    css`
        display: flex;
        flex: 1;
        align-items: stretch;
    `,
);

const MainContentContainer = styled("div", {
    name: "CometAdminToolbar",
    slot: "mainContentContainer",
    overridesResolver(_, styles) {
        return [styles.mainContentContainer];
    },
})(
    css`
        display: flex;
        flex: 1;
    `,
);

export const Toolbar = (inProps: ToolbarProps) => {
    const { children, elevation = 1, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbar" });
    const { headerHeight } = React.useContext(MasterLayoutContext);

    const ownerState: OwnerState = {
        headerHeight,
    };

    return (
        <Root elevation={elevation} ownerState={ownerState} {...restProps} {...slotProps?.root}>
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
        CometAdminToolbar: Partial<ToolbarProps>;
    }

    interface Components {
        CometAdminToolbar?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbar"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbar"];
        };
    }
}
