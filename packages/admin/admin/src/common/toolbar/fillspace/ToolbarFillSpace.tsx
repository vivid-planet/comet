import { ComponentsOverrides } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createSlot } from "../../../helpers/createSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarFillSpaceClassKey = "root";

export interface ToolbarFillSpaceProps extends ThemedComponentBaseProps {
    children?: React.ReactNode;
}

const Root = createSlot("div")<ToolbarFillSpaceClassKey>({
    componentName: "ToolbarFillSpace",
    slotName: "root",
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
