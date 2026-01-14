"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ContactFormBlockData } from "@src/blocks.generated";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { Button } from "../components/Button";
import { CheckboxField } from "../components/form/CheckboxField";
import { SelectField } from "../components/form/SelectField";
import { TextareaField } from "../components/form/TextareaField";
import { TextField } from "../components/form/TextField";

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
            control,
            handleSubmit,
            setError,
            formState: { errors, isSubmitting },
        } = useForm<ContactFormValues>({
            defaultValues: {
                name: "",
                company: "",
                email: "",
                phoneNumber: "",
                subject: "",
                message: "",
                privacyConsent: false,
            },
        });

        const onSubmit = async (formValues: ContactFormValues) => {
            try {
                const response = await fetch("api/contact-form", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(formValues),
                });

                if (!response.ok) {
                    throw new Error("Form submission failed");
                }
            } catch (error) {
                console.error("Form submission error:", error);
                setError("root.serverError", {
                    type: "manual",
                    message: intl.formatMessage({
                        id: "contactForm.submission.error",
                        defaultMessage: "An error occurred while submitting the form. Please try again.",
                    }),
                });
            }
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    name="name"
                    control={control}
                    rules={{
                        required: intl.formatMessage({ id: "contactForm.name.required", defaultMessage: "Please enter your name" }),
                    }}
                    label={intl.formatMessage({ id: "contactForm.name.label", defaultMessage: "Name" })}
                    placeholder={intl.formatMessage({ id: "contactForm.name.placeholder", defaultMessage: "First and last name" })}
                    required
                />
                <TextField
                    name="company"
                    control={control}
                    label={intl.formatMessage({ id: "contactForm.company.label", defaultMessage: "Company" })}
                    placeholder={intl.formatMessage({ id: "contactForm.company.placeholder", defaultMessage: "Company name" })}
                />
                <TextField
                    name="email"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            id: "contactForm.email.required",
                            defaultMessage: "Please enter your email address",
                        }),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: intl.formatMessage({ id: "contactForm.email.invalid", defaultMessage: "Invalid email address" }),
                        },
                    }}
                    label={intl.formatMessage({ id: "contactForm.email.label", defaultMessage: "Email" })}
                    placeholder={intl.formatMessage({ id: "contactForm.email.placeholder", defaultMessage: "Your email address" })}
                    required
                />
                <TextField
                    name="phoneNumber"
                    control={control}
                    rules={{
                        pattern: {
                            value: /^[0-9+]*$/,
                            message: intl.formatMessage({
                                id: "contactForm.phoneNumber.invalid",
                                defaultMessage: "Please enter only numbers",
                            }),
                        },
                    }}
                    label={intl.formatMessage({ id: "contactForm.phoneNumber.label", defaultMessage: "Phone Number" })}
                    placeholder={intl.formatMessage({ id: "contactForm.phoneNumber.placeholder", defaultMessage: "0043123456789" })}
                    helperText={intl.formatMessage({
                        id: "contactForm.phoneNumber.helperText",
                        defaultMessage: "Please enter without special characters and spaces",
                    })}
                />
                <SelectField
                    name="subject"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            id: "contactForm.subject.required",
                            defaultMessage: "Please select a subject",
                        }),
                    }}
                    label={intl.formatMessage({ id: "contactForm.subject.label", defaultMessage: "Subject" })}
                    required
                    placeholder={intl.formatMessage({ id: "contactForm.subject.placeholder", defaultMessage: "Please select" })}
                    options={subjectOptions}
                />
                <TextareaField
                    name="message"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            id: "contactForm.message.required",
                            defaultMessage: "Please enter your message",
                        }),
                    }}
                    label={intl.formatMessage({ id: "contactForm.message.label", defaultMessage: "Message" })}
                    placeholder={intl.formatMessage({ id: "contactForm.message.placeholder", defaultMessage: "Your message" })}
                    required
                />
                <CheckboxField
                    name="privacyConsent"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            id: "contactForm.privacyConsent.required",
                            defaultMessage: "You must agree to the privacy policy to continue",
                        }),
                    }}
                    label={intl.formatMessage({
                        id: "contactForm.privacyConsent.label",
                        defaultMessage:
                            "I agree that my information from the contact form will be collected and processed to answer my inquiry. Note: You can revoke your consent at any time by email to hello@your-domain.com. For more information, please see our privacy policy.",
                    })}
                    required
                />
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    <FormattedMessage id="contactForm.submitButton.label" defaultMessage="Submit" />
                </Button>
                {errors.root?.serverError && <div>{errors.root.serverError.message}</div>}
            </form>
        );
    },
    { label: "Contact Form" },
);
