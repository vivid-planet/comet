import { messages } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const formatStrong = (chunks: string): React.ReactElement => <strong>{chunks}</strong>;

export const NetworkError = (): React.ReactElement => (
    <FormattedMessage
        {...messages.networkError}
        values={{
            strong: formatStrong,
        }}
    />
);

export const UnknownError = (): React.ReactElement => (
    <FormattedMessage
        {...messages.unknownError}
        values={{
            strong: formatStrong,
        }}
    />
);
