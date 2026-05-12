import { Field, FinalFormInput } from "@comet/admin";
import { FormattedMessage } from "react-intl";

export const ConfigFields = () => {
    return (
        <>
            <Field
                required
                fullWidth
                name="title"
                component={FinalFormInput}
                label={<FormattedMessage id="cometBrevoModule.emailCampaigns.title" defaultMessage="Title" />}
            />
            <Field
                required
                fullWidth
                name="subject"
                component={FinalFormInput}
                label={<FormattedMessage id="cometBrevoModule.emailCampaigns.subject" defaultMessage="Subject" />}
            />
        </>
    );
};
