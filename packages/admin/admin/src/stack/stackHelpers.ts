import { isValidElement, ReactElement, ReactNode } from "react";
import { FormattedMessage, IntlShape, MessageDescriptor } from "react-intl";

export function isFormattedMessage(node: ReactNode): node is ReactElement<MessageDescriptor> {
    return isValidElement(node) && node.type === FormattedMessage;
}
export function parseFormattedMessage(intl: IntlShape, message: ReactNode) {
    if (typeof message === "string") return message;

    if (isFormattedMessage(message)) return intl.formatMessage(message.props);

    throw new Error("Invalid message type received");
}
