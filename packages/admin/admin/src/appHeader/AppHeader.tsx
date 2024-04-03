import { AppBar as MuiAppBar, AppBarClassKey, capitalize, ComponentsOverrides, css, Theme, useThemeProps } from "@mui/material";
import { AppBarProps } from "@mui/material/AppBar";
import * as React from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { MasterLayoutContext } from "../mui/MasterLayoutContext";

interface AppHeaderProps extends AppBarProps {
    /**
     * A custom height should only be set, if used outside of MasterLayout.
     */
    headerHeight?: number;
}

export type AppHeaderClassKey = AppBarClassKey;

type OwnerState = {
    position: AppBarProps["position"];
    color: AppBarProps["color"];
};

const AppHeaderRoot = createComponentSlot(MuiAppBar)<AppHeaderClassKey, OwnerState>({
    componentName: "AppHeader",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.position && `position${capitalize(ownerState.position)}`,
            ownerState.color && `color${capitalize(ownerState.color)}`,
        ] as AppHeaderClassKey[];
    },
})(
    ({ theme }) => css`
        background-color: ${theme.palette.grey.A400};
        height: var(--header-height);
        flex-direction: row;
        align-items: center;
    `,
);

export function AppHeader(inProps: AppHeaderProps): React.ReactElement {
    const props = useThemeProps({ props: inProps, name: "CometAdminAppHeader" });
    const { children, headerHeight: passedHeaderHeight, position = "fixed", color = "primary", ...restProps } = props;

    const { headerHeight: masterLayoutHeaderHeight } = React.useContext(MasterLayoutContext);
    const headerHeight = passedHeaderHeight === undefined ? masterLayoutHeaderHeight : passedHeaderHeight;

    const ownerState: OwnerState = {
        position,
        color,
    };

    return (
        <AppHeaderRoot
            position={position}
            color={color}
            ownerState={ownerState}
            {...restProps}
            style={{ "--header-height": `${headerHeight}px` } as React.CSSProperties}
        >
            {children}
        </AppHeaderRoot>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeader: AppHeaderClassKey;
    }

    interface ComponentsPropsList {
        CometAdminAppHeader: AppHeaderProps;
    }

    interface Components {
        CometAdminAppHeader?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminAppHeader"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeader"];
        };
    }
}
