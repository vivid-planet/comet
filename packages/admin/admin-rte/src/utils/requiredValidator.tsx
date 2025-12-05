import { convertFromRaw, type RawDraftContentState } from "draft-js";
import { FormattedMessage } from "react-intl";

export const requiredValidator = (value: string | RawDraftContentState) => {
    const rawState = typeof value === "string" ? JSON.parse(value) : value;
    const contentState = convertFromRaw(rawState);
    const hasText = contentState.hasText();
    return hasText ? undefined : <FormattedMessage id="comet.form.required" defaultMessage="Required" />;
};
