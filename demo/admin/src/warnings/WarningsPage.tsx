import { Stack } from "@comet/admin";
import { type ReactElement } from "react";
import { useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

export function WarningsPage(): ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid />
        </Stack>
    );
}
