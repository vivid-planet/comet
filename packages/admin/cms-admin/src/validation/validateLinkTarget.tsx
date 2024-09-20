import { FormattedMessage } from "react-intl";

import { isLinkTarget } from "./isLinkTarget";

export function validateLinkTarget(linkTarget?: string) {
    if (linkTarget && !isLinkTarget(linkTarget)) {
        return <FormattedMessage id="comet.validation.validateLinkTarget.invalid" defaultMessage="Invalid link target" />;
    }
}
