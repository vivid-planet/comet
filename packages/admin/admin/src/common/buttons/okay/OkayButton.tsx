import { Check } from "@dextinity/admin-icons";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";
import { Button, type ButtonClassKey, type ButtonProps } from "../Button";

export type OkayButtonClassKey = ButtonClassKey;
export type OkayButtonProps = ButtonProps;

export function OkayButton({ children = <FormattedMessage {...messages.ok} />, startIcon = <Check />, ...restProps }: OkayButtonProps) {
    return (
        <Button startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}
