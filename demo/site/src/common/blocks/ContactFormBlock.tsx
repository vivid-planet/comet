"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ContactFormBlockData } from "@src/blocks.generated";
import { FormattedMessage, useIntl } from "react-intl";

import { Button } from "../components/Button";
import { CheckboxField } from "../components/form/CheckboxField";
import { InputField } from "../components/form/InputField";
import { SelectField } from "../components/form/SelectField";

const subjectOptions = [
    { value: "Option 1", label: "Option 1" },
    { value: "Option 2", label: "Option 2" },
    { value: "Option 3", label: "Option 3" },
];

export const ContactFormBlock = withPreview(
    ({ data }: PropsWithData<ContactFormBlockData>) => {
        const intl = useIntl();
        return (
            <>
                <InputField
                    label={intl.formatMessage({ id: "contactForm.name.label", defaultMessage: "Name" })}
                    placeholder={intl.formatMessage({ id: "contactForm.name.placeholder", defaultMessage: "First and last name" })}
                    required
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.company.label", defaultMessage: "Company" })}
                    placeholder={intl.formatMessage({ id: "contactForm.company.placeholder", defaultMessage: "Company name" })}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.email.label", defaultMessage: "Email" })}
                    placeholder={intl.formatMessage({ id: "contactForm.email.placeholder", defaultMessage: "Your email address" })}
                    required
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.phoneNumber.label", defaultMessage: "Phone Number" })}
                    placeholder={intl.formatMessage({ id: "contactForm.phoneNumber.placeholder", defaultMessage: "0043123456789" })}
                    helperText={intl.formatMessage({
                        id: "contactForm.phoneNumber.helperText",
                        defaultMessage: "Please enter without special characters and spaces",
                    })}
                />
                <SelectField
                    label={intl.formatMessage({ id: "contactForm.subject.label", defaultMessage: "Subject" })}
                    required
                    placeholder={intl.formatMessage({ id: "contactForm.subject.placeholder", defaultMessage: "Please select" })}
                    options={subjectOptions}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.message.label", defaultMessage: "Message" })}
                    placeholder={intl.formatMessage({ id: "contactForm.message.placeholder", defaultMessage: "Your message" })}
                    textArea
                    required
                />
                <CheckboxField
                    label={intl.formatMessage({
                        id: "contactForm.privacyConsent.label",
                        defaultMessage:
                            "I agree that my information from the contact form will be collected and processed to answer my inquiry. Note: You can revoke your consent at any time by email to hello@your-domain.com. For more information, please see our privacy policy.",
                    })}
                    required
                />
                <Button type="submit" variant="contained">
                    <FormattedMessage id="contactForm.submitButton.label" defaultMessage="Submit" />
                </Button>
            </>
        );
    },
    { label: "Contact Form" },
);
