import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const validateUrlHasProtocol = (value: string | undefined): ReactNode | undefined => {
    if (!value || value.trim() === "") {
        return undefined;
    }

    const trimmedValue = value.trim();
    const schemeMatch = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/.exec(trimmedValue);

    if (!schemeMatch) {
        return (
            <FormattedMessage
                id="comet.validateUrlHasProtocol.missingProtocol"
                defaultMessage="URL must include a protocol (e.g., https://, http://, mailto:, tel:)"
            />
        );
    }

    return undefined;
};
