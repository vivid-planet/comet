import { Clear } from "@dextinity/admin-icons";
import { IconButton, type IconButtonProps } from "@dextinity/ui";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../messages";

/**
 * @deprecated Use `ClearInputAdornment` directly as the InputAdornment
 */
export type ClearInputButtonClassKey = "root" | "focusVisible";

/**
 * @deprecated Use `ClearInputAdornment` directly as the InputAdornment
 */
export interface ClearInputButtonProps extends Omit<IconButtonProps, "label" | "children"> {
    icon?: ReactNode;
    /** The button's accessible name. */
    label?: string;
}

/**
 * @deprecated Use `ClearInputAdornment` directly as the InputAdornment
 */
export function ClearInputButton({ icon = <Clear />, label, ...restProps }: ClearInputButtonProps) {
    const intl = useIntl();

    return (
        <IconButton tabIndex={-1} size="small" label={label ?? intl.formatMessage(messages.clear)} {...restProps}>
            {icon}
        </IconButton>
    );
}
