import { Close } from "@comet/admin-icons";
// eslint-disable-next-line no-restricted-imports
import { Alert as MuiAlert, alertClasses, AlertTitle, buttonClasses, IconButton, Typography } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export interface AlertProps
    extends ThemedComponentBaseProps<{
        root: typeof MuiAlert;
        title: typeof AlertTitle;
        text: typeof Typography;
        action: "div";
        closeIcon: typeof IconButton;
    }> {
    severity?: "info" | "warning" | "error" | "success";
    title?: React.ReactNode;
    children?: React.ReactNode;
    onClose?: () => void;
    action?: React.ReactNode;
}

export type AlertClassKey = "root" | "title" | "text" | "action" | "closeIcon" | "hasTitle" | "singleRow";

type OwnerState = {
    hasTitle: boolean;
    renderAsSingleRow: boolean;
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((inProps, ref) => {
    const {
        severity = "info",
        title,
        children,
        onClose,
        action,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminAlert" });
    const singleRow = !title && (action || onClose);

    const ownerState: OwnerState = {
        hasTitle: Boolean(title),
        renderAsSingleRow: Boolean(singleRow),
    };

    return (
        <Root ref={ref} ownerState={ownerState} severity={severity} {...slotProps?.root} {...restProps}>
            {Boolean(title) && <Title {...slotProps?.title}>{title}</Title>}
            <Text variant="body2" {...slotProps?.text}>
                {children}
            </Text>
            {action && (
                <Action ownerState={ownerState} {...slotProps?.action}>
                    {action}
                </Action>
            )}
            {onClose && (
                <CloseIcon onClick={onClose} ownerState={ownerState} {...slotProps?.closeIcon}>
                    <Close />
                </CloseIcon>
            )}
        </Root>
    );
});

const Root = createComponentSlot(MuiAlert)<AlertClassKey, OwnerState>({
    componentName: "Alert",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.hasTitle && "hasTitle", ownerState.renderAsSingleRow && "singleRow"];
    },
})(
    ({ theme, ownerState }) => css`
        padding: ${theme.spacing(4, "12px", 4, 4)};

        & .${alertClasses.message} {
            display: flex;
            align-items: center;
            flex-grow: 1;
        }

        ${ownerState.hasTitle &&
        css`
            position: relative;
            align-items: flex-start;
            padding: ${theme.spacing(4, 6, "8px", 3)};

            & .${buttonClasses.text} {
                margin-left: -15px;
            }

            & .${alertClasses.message} {
                flex-direction: column;
                align-items: flex-start;
            }
        `}

        ${ownerState.renderAsSingleRow &&
        css`
            display: flex;
            align-items: center;
            padding: ${theme.spacing(2, "12px", 2, 4)};
        `}
    `,
);

const Title = createComponentSlot(AlertTitle)<AlertClassKey>({
    componentName: "Alert",
    slotName: "title",
})();

const Text = createComponentSlot(Typography)<AlertClassKey>({
    componentName: "Alert",
    slotName: "text",
})(css`
    flex-grow: 1;
`);

const Action = createComponentSlot("div")<AlertClassKey, OwnerState>({
    componentName: "Alert",
    slotName: "action",
})(
    ({ theme, ownerState }) => css`
        ${ownerState.hasTitle &&
        css`
            margin-top: ${theme.spacing(2)};
        `}
    `,
);

const CloseIcon = createComponentSlot(IconButton)<AlertClassKey, OwnerState>({
    componentName: "Alert",
    slotName: "closeIcon",
})(
    ({ ownerState }) => css`
        ${ownerState.hasTitle &&
        css`
            position: absolute;
            right: 2px;
            top: 2px;
        `}
    `,
);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAlert: AlertProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAlert: AlertClassKey;
    }

    interface Components {
        CometAdminAlert?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminAlert"]>;
            styleOverrides?: ComponentNameToClassKey["CometAdminAlert"];
        };
    }
}
