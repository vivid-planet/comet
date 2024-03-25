import { ComponentsOverrides } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarActionsClassKey = "root";
interface Props extends ThemedComponentBaseProps {
    children: React.ReactNode;
}

const Root = createComponentSlot("div")<ToolbarActionsClassKey>({
    componentName: "ToolbarActions",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};

        ${theme.breakpoints.up("md")} {
            gap: ${theme.spacing(4)};
        }
    `,
);

export const ToolbarActions = (inProps: Props) => {
    const { children, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarActions" });
    return <Root {...restProps}>{children}</Root>;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarActions: ToolbarActionsClassKey;
    }

    interface Components {
        CometAdminToolbarActions?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarActions"];
        };
    }
}
