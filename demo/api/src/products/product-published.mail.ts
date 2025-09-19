import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { PreparedTestParams } from "@src/../../../packages/api/cms-api/src/mail-templates/mail-template.service";

type MailParams = {
    recipientName: string;
    countProductPublished: "all" | number;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMailParams(arg: any): arg is MailParams {
    return arg.recipientName !== undefined && arg.countProductPublished !== undefined;
}

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailParams> {
    id = "products-published";
    type = "products";
    name = "Products published";

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
                name: `Testing "all" Mail`,
                params: {
                    recipientName: "John Doe",
                    countProductPublished: "all",
                },
            },
            {
                name: `Testing "count" Mail`,
                params: {
                    recipientName: "John Doe",
                    countProductPublished: 5,
                },
            },
        ];
    }
}
