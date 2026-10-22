import { Clear } from "@dextinity/admin-icons";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";
import { Button, type ButtonClassKey, type ButtonProps } from "../Button";

export type CancelButtonProps = ButtonProps;
export type CancelButtonClassKey = ButtonClassKey;

export function CancelButton({ children = <FormattedMessage {...messages.cancel} />, startIcon = <Clear />, ...restProps }: CancelButtonProps) {
    return (
        <Button variant="textDark" startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}
