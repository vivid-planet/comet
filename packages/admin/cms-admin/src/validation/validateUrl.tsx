import { isURL } from "class-validator";
import React from "react";
import { FormattedMessage } from "react-intl";

export function validateUrl(url?: string) {
    if (url && !isURL(url)) {
        return <FormattedMessage id="comet.validation.validateUrl.invalid" defaultMessage="Invalid URL" />;
    }
}
