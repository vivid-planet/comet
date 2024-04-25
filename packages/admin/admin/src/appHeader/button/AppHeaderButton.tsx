import { ButtonBase, ButtonBaseProps, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { AppHeaderButtonClassKey, Content, EndIcon, Root, StartIcon, Text } from "./AppHeaderButton.styles";

export interface AppHeaderButtonProps
    extends ButtonBaseProps,
        ThemedComponentBaseProps<{
            root: typeof ButtonBase;
            content: "div";
            typography: typeof Typography<"div">;
            startIcon: "div";
            endIcon: "div";
        }> {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disableTypography?: boolean;
}

export function AppHeaderButton(inProps: AppHeaderButtonProps) {
    const { children, disableTypography, slotProps, onClick, startIcon, endIcon, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminAppHeaderButton",
    });

    return (
        <Root {...slotProps?.root} {...restProps} onClick={onClick}>
            <Content {...slotProps?.content}>
                {startIcon && <StartIcon {...slotProps?.startIcon}>{startIcon}</StartIcon>}
                {children &&
                    (disableTypography ? (
                        children
                    ) : (
                        <Text component="div" {...slotProps?.typography}>
                            {children}
                        </Text>
                    ))}

                {endIcon && <EndIcon {...slotProps?.endIcon}>{endIcon}</EndIcon>}
            </Content>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAppHeaderButton: AppHeaderButtonProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAppHeaderButton: AppHeaderButtonClassKey;
    }

    interface Components {
        CometAdminAppHeaderButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminAppHeaderButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderButton"];
        };
    }
}
