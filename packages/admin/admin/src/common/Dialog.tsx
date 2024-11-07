import { Close } from "@comet/admin-icons";
import {
    ComponentsOverrides,
    css,
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
    DialogTitle as MuiDialogTitle,
    IconButton as MuiIconButton,
    Theme,
    useThemeProps,
} from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type DialogClassKey = "root" | "iconButton" | "titleWrapper" | "dialogTitle";

export type DialogProps = ThemedComponentBaseProps<{
    iconButton: typeof MuiIconButton;
    root: typeof MuiDialog;
    dialogTitle: typeof MuiDialogTitle;
    titleWrapper: "div";
}> & {
    children?: ReactNode;
    title?: ReactNode;
    onClose?: () => void;
    iconMapping?: {
        closeIcon?: ReactNode;
    };
} & MuiDialogProps;

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

const Root = createComponentSlot(MuiDialog)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "root",
})();

const DialogTitle = createComponentSlot(MuiDialogTitle)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "dialogTitle",
})(css`
    display: flex;
    align-items: center;
`);

const IconButton = createComponentSlot(MuiIconButton)<DialogClassKey>({
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
