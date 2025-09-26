import { type CustomDecorator, SetMetadata } from "@nestjs/common";
import { type Options as MailOptions } from "nodemailer/lib/mailer";

export type MailTemplateMetadata = object; // placeholder for future metadata

export const MAIL_TEMPLATE_METADATA_KEY = "MAIL_TEMPLATE_METADATA_KEY";

export function isMailTemplate(arg: unknown): arg is MailTemplateInterface<unknown> {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "id" in arg &&
        arg.id !== undefined &&
        "generateMail" in arg &&
        typeof arg.generateMail === "function" &&
        "getPreparedTestParams" in arg &&
        typeof arg.getPreparedTestParams === "function"
    );
}
export type PreparedTestParams<T> = {
    params: T;
};

export type MailTemplateInterface<T> = {
    id: string;

    generateMail: (params: T) => Promise<MailOptions>;
    getPreparedTestParams: () => Promise<PreparedTestParams<T>[]>;
};

export const MailTemplate = (): CustomDecorator<string> => {
    return SetMetadata<string, MailTemplateMetadata>(MAIL_TEMPLATE_METADATA_KEY, {});
};
