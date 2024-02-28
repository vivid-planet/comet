import { ArrowLeft } from "@comet/admin-icons";
import { ComponentsOverrides, IconButton as MuiIconButton, Theme } from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../../../stack/Api";
import { ToolbarItem as CommonToolbarItem } from "../item/ToolbarItem";

export type ToolbarBackButtonClassKey = "root" | "iconButton";

const Root = styled("div", {
    name: "CometAdminToolbarBackButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    flex: 0;
    display: flex;
    align-items: stretch;
`);

const IconButton = styled(MuiIconButton, {
    name: "CometAdminToolbarBackButton",
    slot: "iconButton",
    overridesResolver(_, styles) {
        return [styles.iconButton];
    },
})(css``);

const ToolbarItem = styled(CommonToolbarItem, {
    name: "CometAdminToolbarBackButton",
    slot: "toolbarItem",
    overridesResolver(_, styles) {
        return [styles.toolbarItem];
    },
})(css`
    flex: 0;
    display: flex;
    align-items: stretch;
`);

export interface ToolbarBackButtonProps
    extends ThemedComponentBaseProps<{
        root: "div";
        toolbarItem: typeof ToolbarItem;
        iconButton: typeof MuiIconButton;
    }> {
    backIcon?: React.ReactNode;
}

export const ToolbarBackButton = (inProps: ToolbarBackButtonProps) => {
    const {
        backIcon = <ArrowLeft sx={{ fontSize: 24 }} />,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminToolbarBackButton" });
    const stackApi = useStackApi();

    if (!stackApi || stackApi.breadCrumbs.length <= 1) {
        return null;
    }

    return (
        <Root {...slotProps?.root} {...restProps}>
            <ToolbarItem {...slotProps?.toolbarItem}>
                <IconButton
                    onClick={() => {
                        stackApi?.goBack();
                    }}
                    size="large"
                    {...slotProps?.iconButton}
                >
                    {backIcon}
                </IconButton>
            </ToolbarItem>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBackButton: ToolbarBackButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarBackButton: Partial<ToolbarBackButtonProps>;
    }

    interface Components {
        CometAdminToolbarBackButton?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbarBackButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBackButton"];
        };
    }
}
