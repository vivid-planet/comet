import { messages } from "@comet/admin";
import { FormattedMessage } from "react-intl";

export const formatStrong = (chunks: string) => <strong>{chunks}</strong>;

export const NetworkError = () => (
    <FormattedMessage
        {...messages.networkError}
        values={{
            strong: formatStrong,
        }}
    />
);

export const UnknownError = () => (
    <FormattedMessage
        {...messages.unknownError}
        values={{
            strong: formatStrong,
        }}
    />
);
