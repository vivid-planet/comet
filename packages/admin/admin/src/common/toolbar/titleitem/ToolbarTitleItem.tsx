import { type ComponentsOverrides, Typography as MuiTypography, type TypographyTypeMap } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { ToolbarItem } from "../item/ToolbarItem";

export type ToolbarTitleItemClassKey = "root" | "typography";

export interface ToolbarTitleItemProps
    extends PropsWithChildren<
        ThemedComponentBaseProps<{
            root: typeof ToolbarItem;
            typography: typeof MuiTypography;
        }>
    > {
    /**
     * @deprecated Use `slotProps` instead.
     */
    typographyProps?: TypographyTypeMap["props"];
}

const Root = createComponentSlot(ToolbarItem)<ToolbarTitleItemClassKey>({
    componentName: "ToolbarTitleItem",
    slotName: "root",
})();

const Typography = createComponentSlot(MuiTypography)<ToolbarTitleItemClassKey>({
    componentName: "ToolbarTitleItem",
    slotName: "typography",
})();

export const ToolbarTitleItem = (inProps: ToolbarTitleItemProps) => {
    const { children, typographyProps = {}, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarTitleItem" });

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Typography variant="h4" {...typographyProps} {...slotProps?.typography}>
                {children}
            </Typography>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarTitleItem: ToolbarTitleItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarTitleItem: ToolbarTitleItemProps;
    }

    interface Components {
        CometAdminToolbarTitleItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarTitleItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarTitleItem"];
        };
    }
}
