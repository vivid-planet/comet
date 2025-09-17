import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { PreparedTestParams } from "@src/../../../packages/api/cms-api/src/mail-templates/mail-template.service";

type MailProps = {
    recipientName: string;
    countProductPublished: "all" | number;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMailProp(arg: any): arg is MailProps {
    return arg.recipientName !== undefined && arg.countProductPublished !== undefined;
}

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    id = "products-published";
    type = "products";
    name = "Products published";

    async generateMail(params: MailProps): Promise<{
        subject: string;
        text: string;
        html: string;
    }> {
        if (!isMailProp(params)) throw new Error(`Incompatible params`);

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

    async getPreparedTestParams(): Promise<PreparedTestParams<MailProps>[]> {
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
