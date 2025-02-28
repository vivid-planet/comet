import { Stack } from "@comet/admin";
import { type MessageDescriptor, useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

interface WarningsPageProps {
    warningMessages?: Record<string, MessageDescriptor>;
}

export function WarningsPage({ warningMessages }: WarningsPageProps) {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid warningMessages={warningMessages} />
        </Stack>
    );
}
