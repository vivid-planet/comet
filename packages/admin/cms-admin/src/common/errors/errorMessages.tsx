import * as React from "react";
import { FormattedMessage } from "react-intl";

export const formatStrong = (chunks: string): React.ReactElement => <strong>{chunks}</strong>;

export const NetworkError = (): React.ReactElement => (
    <FormattedMessage
        id="comet.generic.errors.networkError"
        defaultMessage="<strong>Could not connect to server.</strong> Please check your internet connection."
        values={{
            strong: formatStrong,
        }}
    />
);

export const UnknownError = (): React.ReactElement => (
    <FormattedMessage
        id="comet.generic.errors.unknownError"
        defaultMessage="<strong>Something went wrong.</strong> Please try again later."
        values={{
            strong: formatStrong,
        }}
    />
);
