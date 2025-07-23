import { type ComponentsOverrides } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode } from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";

export type ToolbarItemClassKey = "root";

const Root = createComponentSlot("div")<ToolbarItemClassKey>({
    componentName: "ToolbarItem",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        justify-items: center;
        align-items: center;
        padding-right: ${theme.spacing(2)};
    `,
);

export interface ToolbarItemProps extends ThemedComponentBaseProps {
    children?: ReactNode;
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
