import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarFillSpaceClassKey = "root";

export interface ToolbarFillSpaceProps extends ThemedComponentBaseProps {
    children?: React.ReactNode;
}

const Root = styled("div", {
    name: "CometAdminToolbarFillSpace",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    flex-grow: 1;
`);

export const ToolbarFillSpace = (inProps: ToolbarFillSpaceProps) => {
    const { children, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarFillSpace" });
    return <Root {...restProps}>{children}</Root>;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarFillSpace: ToolbarFillSpaceClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarFillSpace: ToolbarFillSpaceProps;
    }

    interface Components {
        CometAdminToolbarFillSpace?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarFillSpace"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarFillSpace"];
        };
    }
}
