import { FormattedMessage } from "react-intl";

export const warningMessages = {
    missingHtmlTitle: <FormattedMessage id="comet.warnings.missingHtmlTitle" defaultMessage="Missing HTML Title" />,
    invalidInternalLinkTarget: (
        <FormattedMessage id="comet.warnings.internalLinkTargetPageInvalid" defaultMessage="Invalid Target in Page Tree Link" />
    ),
    missingInternalLinkTarget: (
        <FormattedMessage id="comet.warnings.internalLinkTargetPageNotDefined" defaultMessage="Missing Target in Page Tree Link" />
    ),
};
