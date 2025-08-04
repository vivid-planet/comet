import { type ComponentsOverrides } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarActionsClassKey = "root";

const Root = createComponentSlot("div")<ToolbarActionsClassKey>({
    componentName: "ToolbarActions",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `,
);

export const ToolbarActions = (inProps: PropsWithChildren<ThemedComponentBaseProps>) => {
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
