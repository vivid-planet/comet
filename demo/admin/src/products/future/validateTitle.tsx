import React from "react";
import { FormattedMessage } from "react-intl";

export function validateTitle(value: string) {
    return value.length < 3 ? (
        <FormattedMessage id="product.validate.titleMustBe3CharsLog" defaultMessage="Title must be at least 3 characters long" />
    ) : undefined;
}
