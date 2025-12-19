import { isEmail, isURL } from "validator";

import { isPhoneNumber } from "./isPhoneNumber";

export function isLinkTarget(value: string): boolean {
    if (value.toLowerCase().includes("javascript:")) {
        return false;
    } else if (value.toLowerCase().includes("data:")) {
        return false;
    } else if (value.startsWith("mailto:")) {
        return isEmail(value.slice(7));
    } else if (value.startsWith("tel:")) {
        return isPhoneNumber(value.slice(4));
    } else {
        return isURL(value, { require_protocol: true, require_valid_protocol: false });
    }
}
