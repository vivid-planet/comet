import React from "react";
import { FormattedMessage } from "react-intl";

import { isLinkTarget } from "./isHref";

export function validateUrl(url: string) {
    if (url && !isLinkTarget(url)) {
        return <FormattedMessage id="comet.validation.validateUrl.invalid" defaultMessage="Invalid URL" />;
    }
}
