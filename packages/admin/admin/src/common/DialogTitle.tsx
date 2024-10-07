import { Close } from "@comet/admin-icons";
import { ComponentsOverrides, css, DialogTitle as MUIDialogTitle, IconButton as MUIIconButton, Theme, useThemeProps } from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type DialogTitleClassKey = "dialogTitle" | "iconButton" | "contentWrapper";

export interface DialogTitleProps
    extends ThemedComponentBaseProps<{
        iconButton: typeof MUIIconButton;
        dialogTitle: typeof MUIDialogTitle;
        contentWrapper: "div";
    }> {
    children?: ReactNode;
    onClose?: () => void;
    iconMapping?: {
        closeIcon?: React.ReactNode;
    };
}
export function DialogTitle(inProps: DialogTitleProps) {
    const { slotProps, iconMapping = {}, children, onClose, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminDialogTitle" });
    const { closeIcon = <Close color="inherit" /> } = iconMapping;
    return (
        <Title {...slotProps?.dialogTitle} {...restProps}>
            <ContentWrapper {...slotProps?.contentWrapper}>{children}</ContentWrapper>
            {onClose && (
                <IconButton {...slotProps?.iconButton} onClick={onClose}>
                    {closeIcon}
                </IconButton>
            )}
        </Title>
    );
}

const Title = createComponentSlot(MUIDialogTitle)<DialogTitleClassKey>({
    componentName: "DialogTitle",
    slotName: "dialogTitle",
})(css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`);

const IconButton = createComponentSlot(MUIIconButton)<DialogTitleClassKey>({
    componentName: "DialogTitle",
    slotName: "iconButton",
})(css`
    color: inherit;
`);

const ContentWrapper = createComponentSlot("div")<DialogTitleClassKey>({
    componentName: "DialogTitle",
    slotName: "contentWrapper",
})(css`
    color: inherit;
`);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDialogTitle: DialogTitleProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDialogTitle: DialogTitleClassKey;
    }

    interface Components {
        CometAdminDialogTitle?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDialogTitle"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDialogTitle"];
        };
    }
}
