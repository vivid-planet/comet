import { Stack, StackToolbar } from "@comet/admin";
import { useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { WarningsGrid, type WarningsGridProps } from "./WarningsGrid";

export type WarningsPageProps = WarningsGridProps;

export function WarningsPage({ showAllScopes }: WarningsPageProps) {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "warnings.warnings", defaultMessage: "Warnings" })}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator global={showAllScopes} />} />
            <WarningsGrid showAllScopes={showAllScopes} />
        </Stack>
    );
}
