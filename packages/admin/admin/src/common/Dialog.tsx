import { Close } from "@comet/admin-icons";
import {
    ComponentsOverrides,
    css,
    Dialog as MUIDialog,
    DialogTitle as MUIDialogTitle,
    IconButton as MUIIconButton,
    Theme,
    useThemeProps,
} from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type DialogClassKey = "root" | "iconButton" | "titleWrapper" | "dialogTitle";

export interface DialogProps
    extends ThemedComponentBaseProps<{
        iconButton: typeof MUIIconButton;
        root: typeof MUIDialog;
        dialogTitle: typeof MUIDialogTitle;
        titleWrapper: "div";
    }> {
    children?: ReactNode;
    title: ReactNode;
    open?: boolean;
    onClose?: () => void;
    iconMapping?: {
        closeIcon?: ReactNode;
    };
}
export function Dialog(inProps: DialogProps) {
    const {
        slotProps,
        open = false,
        title,
        iconMapping = {},
        children,
        onClose,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminDialog" });
    const { closeIcon = <Close color="inherit" /> } = iconMapping;
    return (
        <Root open={open} {...slotProps?.root} {...restProps}>
            <DialogTitle {...slotProps?.dialogTitle}>
                <TitleWrapper {...slotProps?.titleWrapper}>{title}</TitleWrapper>
                {onClose && (
                    <IconButton {...slotProps?.iconButton} onClick={onClose}>
                        {closeIcon}
                    </IconButton>
                )}
            </DialogTitle>
            {children}
        </Root>
    );
}

const Root = createComponentSlot(MUIDialog)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "root",
})(css``);

const DialogTitle = createComponentSlot(MUIDialogTitle)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "dialogTitle",
})(css`
    display: flex;
    align-items: center;
`);

const IconButton = createComponentSlot(MUIIconButton)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "iconButton",
})(css`
    color: inherit;
    position: absolute;
    right: 20px;
`);

const TitleWrapper = createComponentSlot("div")<DialogClassKey>({
    componentName: "Dialog",
    slotName: "titleWrapper",
})(css`
    color: inherit;
    width: 100%;
    padding-right: 40px;
    min-height: 20px;
`);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDialog: DialogProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDialog: DialogClassKey;
    }

    interface Components {
        CometAdminDialog?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDialog"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDialog"];
        };
    }
}
