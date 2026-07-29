import { FormattedMessage } from "react-intl";

export function validateUrl(value?: string) {
    return value && !URL.canParse(value) ? <FormattedMessage id="siteSettings.invalidUrl" defaultMessage="Invalid URL" /> : undefined;
}
