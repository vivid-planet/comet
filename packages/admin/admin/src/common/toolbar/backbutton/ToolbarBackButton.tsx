import { ArrowLeft } from "@comet/admin-icons";
import { ComponentsOverrides, IconButton as MuiIconButton, Theme } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../../../stack/Api";
import { ToolbarItem as CommonToolbarItem } from "../item/ToolbarItem";

export type ToolbarBackButtonClassKey = "root" | "iconButton" | "toolbarItem";

const Root = createComponentSlot("div")<ToolbarBackButtonClassKey>({
    componentName: "ToolbarBackButton",
    slotName: "root",
})(
    ({ theme }) => css`
        flex: 0;
        display: flex;
        align-items: stretch;

        .CometAdminToolbarItem-root {
            padding: 0;
            padding-right: ${theme.spacing(3)};
        }
    `,
);

const IconButton = createComponentSlot(MuiIconButton)<ToolbarBackButtonClassKey>({
    componentName: "ToolbarBackButton",
    slotName: "iconButton",
})();

const ToolbarItem = createComponentSlot(CommonToolbarItem)<ToolbarBackButtonClassKey>({
    componentName: "ToolbarBackButton",
    slotName: "toolbarItem",
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
        CometAdminToolbarBackButton: ToolbarBackButtonProps;
    }

    interface Components {
        CometAdminToolbarBackButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarBackButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBackButton"];
        };
    }
}
