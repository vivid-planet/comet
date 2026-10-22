import { AppBarButton, type AppBarButtonProps } from "@dextinity/ui";

export interface AppHeaderButtonProps extends AppBarButtonProps {
    /** @deprecated The button no longer wraps its children in a `Typography`. */
    disableTypography?: boolean;
}

export function AppHeaderButton({ disableTypography, ...buttonProps }: AppHeaderButtonProps) {
    return <AppBarButton {...buttonProps} />;
}
