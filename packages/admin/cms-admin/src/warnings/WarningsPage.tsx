import { Stack } from "@comet/admin";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

interface WarningsPageProps {
    warningMessages?: Record<string, ReactNode>;
}

export function WarningsPage({ warningMessages }: WarningsPageProps) {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid warningMessages={warningMessages} />
        </Stack>
    );
}
