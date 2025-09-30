import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";

type MailProps = {
    recipient: { name: string; email: string };
    countProductPublished: "all" | number;
};

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    async generateMail(props: MailProps) {
        return {
            subject: "All products published",
            to: props.recipient.email,
            text:
                `Hello ${props.recipient.name},` +
                "\r\n" +
                `${
                    props.countProductPublished === "all"
                        ? "All products have been published"
                        : `${props.countProductPublished} products have been published`
                }`,
            html: `<p>Hello ${props.recipient.name},</p>
                ${
                    props.countProductPublished === "all"
                        ? "<p>All products have been published</p>"
                        : `<p>${props.countProductPublished} products have been published<p>`
                }`,
        };
    }

    async getPreparedTestProps() {
        return [
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com" },
                    countProductPublished: "all" as const,
                },
            },
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com" },
                    countProductPublished: 5,
                },
            },
        ];
    }
}
