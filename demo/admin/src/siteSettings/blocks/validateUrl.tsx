import { isURL } from "class-validator";
import { FormattedMessage } from "react-intl";

// Must match the `IsUrl` options used for the URL fields in the API, so that the admin doesn't accept
// values the API rejects. A protocol is required because the structured data is only valid with one.
const urlValidationOptions = { protocols: ["http", "https"], require_protocol: true };

export function validateUrl(url?: string) {
    if (url && !isURL(url, urlValidationOptions)) {
        return (
            <FormattedMessage id="siteSettings.blocks.validateUrl.invalid" defaultMessage="Invalid URL. It must start with http:// or https://." />
        );
    }
}
