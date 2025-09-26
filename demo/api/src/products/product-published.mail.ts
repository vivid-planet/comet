import { MailTemplate, MailTemplateInterface, PreparedTestParams } from "@comet/cms-api";

type MailParams = {
    recipientName: string;
    countProductPublished: "all" | number;
};
export function isMailParams(arg: unknown): arg is MailParams {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "recipientName" in arg &&
        arg.recipientName !== undefined &&
        "countProductPublished" in arg &&
        arg.countProductPublished !== undefined
    );
}

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailParams> {
    id = "products-published";

    async generateMail(params: MailParams): Promise<{
        subject: string;
        text: string;
        html: string;
    }> {
        if (!isMailParams(params)) throw new Error(`Incompatible params`);

        return {
            subject: "Products published",
            text:
                `Hello ${params.recipientName},` +
                "\r\n" +
                `${
                    params.countProductPublished === "all"
                        ? "All products have been published"
                        : `${params.countProductPublished} products have been published`
                }`,
            html: `<p>Hello ${params.recipientName},</p>
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
                    recipientName: "John Doe",
                    countProductPublished: "all",
                },
            },
            {
                params: {
                    recipientName: "John Doe",
                    countProductPublished: 5,
                },
            },
        ];
    }
}
