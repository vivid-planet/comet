import { Stack, StackToolbar } from "@comet/admin";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { WarningsGrid } from "./WarningsGrid";

interface WarningsPageProps {
    warningMessages?: Record<string, ReactNode>;
}

export function WarningsPage({ warningMessages }: WarningsPageProps) {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
            <WarningsGrid warningMessages={warningMessages} />
        </Stack>
    );
}
