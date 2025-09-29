import { MailTemplate, MailTemplateInterface, PreparedTestParams } from "@comet/cms-api";

type MailParams = {
    recipient: { name: string; email: string };
    countProductPublished: "all" | number;
};

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailParams> {
    id = "products-published";

    async generateMail(params: MailParams) {
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
