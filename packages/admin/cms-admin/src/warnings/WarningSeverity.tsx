import { WarningSolid } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { defineMessages, FormattedMessage } from "react-intl";

import { type GQLWarningSeverity } from "../graphql.generated";

interface Props {
    severity: GQLWarningSeverity;
}

export function WarningSeverity({ severity }: Props) {
    const colorMapping: Record<GQLWarningSeverity, "error" | "warning" | "default"> = {
        high: "error",
        medium: "warning",
        low: "default",
    };

    return (
        <Chip
            icon={severity === "high" ? <WarningSolid /> : undefined}
            color={colorMapping[severity]}
            label={<FormattedMessage {...warningSeverityLabels[severity]} />}
        />
    );
}

const warningSeverityLabels = defineMessages({
    high: { id: "comet.warnings.warningSeverity.high", defaultMessage: "High" },
    medium: { id: "comet.warnings.warningSeverity.medium", defaultMessage: "Medium" },
    low: { id: "comet.warnings.warningSeverity.low", defaultMessage: "Low" },
});
