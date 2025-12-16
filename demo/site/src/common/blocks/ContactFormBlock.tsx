"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ContactFormBlockData } from "@src/blocks.generated";
import { useForm } from "react-hook-form";
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

interface ContactFormValues {
    name: string;
    company?: string;
    email: string;
    phoneNumber?: string;
    subject: string;
    message: string;
    privacyConsent: boolean;
}

export const ContactFormBlock = withPreview(
    ({ data }: PropsWithData<ContactFormBlockData>) => {
        const intl = useIntl();
        const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useForm<ContactFormValues>();

        const onSubmit = async (formValues: ContactFormValues) => {
            const values = {
                name: formValues.name,
                company: formValues.company,
                email: formValues.email,
                phone: formValues.phoneNumber,
                subject: formValues.subject,
                message: formValues.message,
                privacyConsent: formValues.privacyConsent,
            };
            try {
                const response = await fetch("/api/contact-form", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error("Form submission failed");
                }
            } catch (error) {
                console.error("Form submission error:", error);
            }
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    label={intl.formatMessage({ id: "contactForm.name.label", defaultMessage: "Name" })}
                    placeholder={intl.formatMessage({ id: "contactForm.name.placeholder", defaultMessage: "First and last name" })}
                    required
                    {...register("name", { required: true })}
                    error={errors.name?.message}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.company.label", defaultMessage: "Company" })}
                    placeholder={intl.formatMessage({ id: "contactForm.company.placeholder", defaultMessage: "Company name" })}
                    {...register("company")}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.email.label", defaultMessage: "Email" })}
                    placeholder={intl.formatMessage({ id: "contactForm.email.placeholder", defaultMessage: "Your email address" })}
                    required
                    {...register("email", {
                        required: true,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: intl.formatMessage({ id: "contactForm.email.invalid", defaultMessage: "Invalid email address" }),
                        },
                    })}
                    error={errors.email?.message}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.phoneNumber.label", defaultMessage: "Phone Number" })}
                    placeholder={intl.formatMessage({ id: "contactForm.phoneNumber.placeholder", defaultMessage: "0043123456789" })}
                    helperText={intl.formatMessage({
                        id: "contactForm.phoneNumber.helperText",
                        defaultMessage: "Please enter without special characters and spaces",
                    })}
                    {...register("phoneNumber")}
                />
                <SelectField
                    label={intl.formatMessage({ id: "contactForm.subject.label", defaultMessage: "Subject" })}
                    required
                    placeholder={intl.formatMessage({ id: "contactForm.subject.placeholder", defaultMessage: "Please select" })}
                    options={subjectOptions}
                    {...register("subject", { required: true })}
                    error={errors.subject?.message}
                />
                <InputField
                    label={intl.formatMessage({ id: "contactForm.message.label", defaultMessage: "Message" })}
                    placeholder={intl.formatMessage({ id: "contactForm.message.placeholder", defaultMessage: "Your message" })}
                    textArea
                    required
                    {...register("message", { required: true })}
                    error={errors.message?.message}
                />
                <CheckboxField
                    label={intl.formatMessage({
                        id: "contactForm.privacyConsent.label",
                        defaultMessage:
                            "I agree that my information from the contact form will be collected and processed to answer my inquiry. Note: You can revoke your consent at any time by email to hello@your-domain.com. For more information, please see our privacy policy.",
                    })}
                    required
                    {...register("privacyConsent", { required: true })}
                    error={errors.privacyConsent?.message}
                />
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    <FormattedMessage id="contactForm.submitButton.label" defaultMessage="Submit" />
                </Button>
            </form>
        );
    },
    { label: "Contact Form" },
);
