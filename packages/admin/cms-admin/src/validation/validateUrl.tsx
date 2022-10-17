import React from "react";
import { FormattedMessage } from "react-intl";

import { isHref } from "./isHref";

export function validateUrl(url: string) {
    if (url && !isHref(url)) {
        return <FormattedMessage id="comet.validation.validateUrl.invalid" defaultMessage="Invalid URL" />;
    }
}
