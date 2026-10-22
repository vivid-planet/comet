import { Save } from "@dextinity/admin-icons";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { FeedbackButton, type FeedbackButtonClassKey, type FeedbackButtonProps } from "./feedback/FeedbackButton";

export type SaveButtonClassKey = FeedbackButtonClassKey;
export type SaveButtonProps = FeedbackButtonProps;

export function SaveButton({ children = <FormattedMessage {...messages.save} />, startIcon = <Save />, ...restProps }: SaveButtonProps) {
    return (
        <FeedbackButton {...restProps} startIcon={startIcon}>
            {children}
        </FeedbackButton>
    );
}
