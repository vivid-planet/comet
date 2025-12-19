import { FormattedMessage } from "react-intl";
import { isURL } from "validator";

export function validateUrl(url?: string) {
    if (url && !isURL(url)) {
        return <FormattedMessage id="comet.validation.validateUrl.invalid" defaultMessage="Invalid URL" />;
    }
}
