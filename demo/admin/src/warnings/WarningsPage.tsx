import { Stack } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

interface Props {
    warningMessages: Record<string, React.ReactNode>;
}

export function WarningsPage({ warningMessages }: Props): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid warningMessages={warningMessages} />
        </Stack>
    );
}
