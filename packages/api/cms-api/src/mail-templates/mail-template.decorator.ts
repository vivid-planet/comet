import { type CustomDecorator, SetMetadata } from "@nestjs/common";

export type MailTemplateMetadata = object; // placeholder for future metadata

export const MAIL_TEMPLATE_METADATA_KEY = "MAIL_TEMPLATE_METADATA_KEY";

export const MailTemplate = (): CustomDecorator<string> => {
    return SetMetadata<string, MailTemplateMetadata>(MAIL_TEMPLATE_METADATA_KEY, {});
};
