import { Alert as UiAlert, type AlertProps as UiAlertProps, type AlertSlotProps, type AlertTone } from "@dextinity/ui";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";

type Severity = "info" | "warning" | "error" | "success";

export interface AlertProps extends Omit<UiAlertProps, "tone" | "title" | "children" | "action" | "closeLabel" | "onClose" | "slotProps"> {
    /**
     * The severity level of the alert
     * - 'info' (default): For general information or neutral messages
     * - 'success': For successful operations or positive feedback
     * - 'warning': For warnings that require attention but aren't critical
     * - 'error': For critical issues or failed operations
     */
    severity?: Severity;
    title?: ReactNode;
    children?: ReactNode;

    /**
     * Callback fired when the close icon is clicked.
     *
     * If `onClose` is provided, a close icon button will be displayed in the alert.
     */
    onClose?: () => void;

    /**
     * The action to display in the alert.
     *
     * This can be used to provide additional actions for the user to take, such as buttons or links.
     *
     * If the title is provided, the action will be displayed below the title and text. If no title is provided, the action will be displayed to the right of the text.
     */
    action?: ReactNode;

    slotProps?: {
        title?: AlertSlotProps["title"];
        text?: AlertSlotProps["message"];
        action?: AlertSlotProps["action"];
        closeIcon?: AlertSlotProps["close"];
        icon?: AlertSlotProps["icon"];
        content?: AlertSlotProps["content"];
    };
}

export type AlertClassKey = "root" | "title" | "text" | "action" | "closeIcon" | "hasTitle" | "singleRow";

const severityToTone: Record<Severity, AlertTone> = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "danger",
};

/**
 * The Alert component is used to display important messages to the user. It provides different severity levels
 * and custom content, actions and close functionality to communicate various types of information.
 * Use for feedback messages, notifications, or status updates.
 *
 * - [Storybook](https://cms-storybook.dextinity.com/?path=/docs/@dextinity/admin_components-alert-alert--docs)
 */
export const Alert = ({ severity = "info", title, children, onClose, action, slotProps, ...restProps }: AlertProps) => {
    const intl = useIntl();
    const { text: textSlotProps, closeIcon: closeIconSlotProps, ...uiSlotProps } = slotProps ?? {};

    return (
        <UiAlert
            {...restProps}
            tone={severityToTone[severity]}
            title={title}
            action={action}
            closeLabel={onClose ? intl.formatMessage(messages.close) : undefined}
            onClose={onClose}
            slotProps={{ ...uiSlotProps, message: textSlotProps, close: closeIconSlotProps }}
        >
            {children}
        </UiAlert>
    );
};
