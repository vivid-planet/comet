import { Close } from "@comet/admin-icons";
import {
    type ComponentsOverrides,
    css,
    // eslint-disable-next-line no-restricted-imports
    Dialog as MuiDialog,
    type DialogProps as MuiDialogProps,
    DialogTitle as MuiDialogTitle,
    IconButton,
    type Theme,
    useThemeProps,
} from "@mui/material";
import { type ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type DialogClassKey = "root" | "closeButton" | "dialogTitle";

export type DialogProps = ThemedComponentBaseProps<{
    closeButton: typeof IconButton;
    root: typeof MuiDialog;
    dialogTitle: typeof MuiDialogTitle;
}> & {
    title?: ReactNode;
    iconMapping?: {
        closeIcon?: ReactNode;
    };
} & MuiDialogProps;

type OwnerState = {
    hasCloseButton: boolean;
};

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

    const ownerState: OwnerState = {
        hasCloseButton: Boolean(onClose),
    };

    return (
        <Root open={open} {...slotProps?.root} {...restProps}>
            {onClose && (
                <CloseButton {...slotProps?.closeButton} onClick={(event) => onClose(event, "escapeKeyDown")}>
                    {closeIcon}
                </CloseButton>
            )}
            <DialogTitle ownerState={ownerState} {...slotProps?.dialogTitle}>
                {title}
            </DialogTitle>
            {children}
        </Root>
    );
}

const Root = createComponentSlot(MuiDialog)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "root",
})();

const DialogTitle = createComponentSlot(MuiDialogTitle)<DialogClassKey, OwnerState>({
    componentName: "Dialog",
    slotName: "dialogTitle",
})(
    ({ ownerState }) => css`
        min-height: 20px;
        display: flex;
        align-items: center;

        ${ownerState.hasCloseButton &&
        css`
            padding-right: 40px;
        `}
    `,
);

const CloseButton = createComponentSlot(IconButton)<DialogClassKey>({
    componentName: "Dialog",
    slotName: "closeButton",
})(
    ({ theme }) => css`
        position: absolute;
        right: 12px;
        top: 14px;
        color: ${theme.palette.secondary.contrastText};
    `,
);

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
