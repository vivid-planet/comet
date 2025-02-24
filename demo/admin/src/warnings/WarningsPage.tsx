import { Stack } from "@comet/admin";
import { useIntl } from "react-intl";

import { WarningsGrid } from "./WarningsGrid";

export function WarningsPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <WarningsGrid />
        </Stack>
    );
}
