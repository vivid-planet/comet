import { MailTemplate, MailTemplateInterface, PreparedTestParams } from "@comet/cms-api";

type MailParams = {
    recipient: { name: string; email: string };
    countProductPublished: "all" | number;
};
export function isMailParams(arg: unknown): arg is MailParams {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "recipient" in arg &&
        arg.recipient !== undefined &&
        "countProductPublished" in arg &&
        arg.countProductPublished !== undefined
    );
}

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailParams> {
    id = "products-published";

    async generateMail(params: MailParams) {
        if (!isMailParams(params)) throw new Error(`Incompatible params`);

        return {
            subject: "All products published",
            to: params.recipient.email,
            text:
                `Hello ${params.recipient.name},` +
                "\r\n" +
                `${
                    params.countProductPublished === "all"
                        ? "All products have been published"
                        : `${params.countProductPublished} products have been published`
                }`,
            html: `<p>Hello ${params.recipient.name},</p>
                ${
                    params.countProductPublished === "all"
                        ? "<p>All products have been published</p>"
                        : `<p>${params.countProductPublished} products have been published<p>`
                }`,
        };
    }

    async getPreparedTestParams(): Promise<PreparedTestParams<MailParams>[]> {
        return [
            {
                params: {
                    recipient: { name: "John Doe", email: "abc" },
                    countProductPublished: "all",
                },
            },
            {
                params: {
                    recipient: { name: "John Doe", email: "" },
                    countProductPublished: 5,
                },
            },
        ];
    }
}
