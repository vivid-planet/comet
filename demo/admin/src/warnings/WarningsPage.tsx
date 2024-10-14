import { Stack } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

export function WarningsPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid />
        </Stack>
    );
}
