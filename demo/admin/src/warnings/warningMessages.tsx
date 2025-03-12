import { FormattedMessage } from "react-intl";

export const warningMessages = {
    missingHtmlTitle: <FormattedMessage id="comet.warnings.missingHtmlTitle" defaultMessage="Missing HTML Title" />,
    jobNewsFailedToSync: <FormattedMessage id="comet.warnings.jobs.failedToSyncNews" defaultMessage="Failed to sync news" />,
    jobNewsMissingRequiredPropertyCategory: (
        <FormattedMessage id="comet.warnings.jobs.missingRequiredPropertyCategory" defaultMessage="News Sync: Missing required property category" />
    ),
};
