import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarItemClassKey = "root";

const Root = styled("div", {
    name: "CometAdminToolbarItem",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    ({ theme }) => css`
        padding: 15px;
        display: flex;
        justify-items: center;
        align-items: center;
        border-right: 1px solid ${theme.palette.grey[50]};
    `,
);

export interface ToolbarItemProps extends ThemedComponentBaseProps {
    children: React.ReactNode;
}

export const ToolbarItem = (inProps: ToolbarItemProps) => {
    const { children, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarItem" });
    return <Root {...restProps}>{children}</Root>;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarItem: ToolbarItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarItem: ToolbarItemProps;
    }

    interface Components {
        CometAdminToolbarItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarItem"];
        };
    }
}
