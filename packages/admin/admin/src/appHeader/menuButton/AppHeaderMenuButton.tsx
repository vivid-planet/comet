import { AppBarIconButton, type AppBarIconButtonProps, Icon } from "@dextinity/ui";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { useMainNavigation } from "../../mui/mainNavigation/Context";

export interface AppHeaderMenuButtonProps extends Omit<AppBarIconButtonProps, "label" | "children"> {
    /** Names the button for screen readers. Defaults to "Open navigation" or "Close navigation". */
    label?: string;
    children?: ReactNode;
}

export type AppHeaderMenuButtonClassKey = "root";

export const AppHeaderMenuButton = ({ label, children, ...buttonProps }: AppHeaderMenuButtonProps) => {
    const intl = useIntl();
    const { toggleOpen, open, hasMultipleMenuItems } = useMainNavigation();

    if (!hasMultipleMenuItems) {
        return null;
    }

    const defaultLabel = open
        ? intl.formatMessage({ id: "dextinity.appHeaderMenuButton.closeNavigation", defaultMessage: "Close navigation" })
        : intl.formatMessage({ id: "dextinity.appHeaderMenuButton.openNavigation", defaultMessage: "Open navigation" });

    return (
        <AppBarIconButton label={label ?? defaultLabel} aria-expanded={open} onClick={toggleOpen} {...buttonProps}>
            {children ?? <Icon name="menu" />}
        </AppBarIconButton>
    );
};
