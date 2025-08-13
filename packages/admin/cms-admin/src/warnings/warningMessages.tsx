import { FormattedMessage } from "react-intl";

export const warningMessages = {
    missingSeoMetadata: <FormattedMessage id="comet.warnings.missingSeoMetadata" defaultMessage="Missing SEO Meta Data" />,
    fileLicenseSoonToExpire: <FormattedMessage id="comet.warnings.file.license.soonToExpire" defaultMessage="File license expires soon" />,
    fileLicenseExpired: <FormattedMessage id="comet.warnings.file.license.expired" defaultMessage="File license has expired" />,
    fileLicenseRequired: <FormattedMessage id="comet.warnings.file.license.required" defaultMessage="File license is missing" />,
    missingAltText: <FormattedMessage id="comet.warnings.missingAltText" defaultMessage="Missing alt text" />,
    invalidTarget: <FormattedMessage id="comet.warnings.invalidTarget" defaultMessage="Invalid Target" />,
    missingTarget: <FormattedMessage id="comet.warnings.missingTarget" defaultMessage="Missing Target" />,
};
