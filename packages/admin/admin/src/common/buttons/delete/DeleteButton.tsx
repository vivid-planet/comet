import { Delete } from "@dextinity/admin-icons";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";
import { Button, type ButtonClassKey, type ButtonProps } from "../Button";

export type DeleteButtonClassKey = ButtonClassKey;
export type DeleteButtonProps = ButtonProps;

export function DeleteButton({ children = <FormattedMessage {...messages.delete} />, startIcon = <Delete />, ...restProps }: DeleteButtonProps) {
    return (
        <Button startIcon={startIcon} variant="destructive" {...restProps}>
            {children}
        </Button>
    );
}
