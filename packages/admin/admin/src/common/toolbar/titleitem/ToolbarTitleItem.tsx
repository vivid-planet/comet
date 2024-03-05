import { ComponentsOverrides, Typography as MuiTypography, TypographyTypeMap } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { ToolbarItem } from "../item/ToolbarItem";

export type ToolbarTitleItemClassKey = "root" | "typography";

export interface ToolbarTitleItemProps
    extends ThemedComponentBaseProps<{
        root: typeof ToolbarItem;
        typography: typeof MuiTypography;
    }> {
    /**
     * @deprecated Use `slotProps` instead.
     */
    typographyProps?: TypographyTypeMap["props"];
    children?: React.ReactNode;
}

const Root = styled(ToolbarItem, {
    name: "CometAdminToolbarTitleItem",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

const Typography = styled(MuiTypography, {
    name: "CometAdminToolbarTitleItem",
    slot: "typography",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

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
