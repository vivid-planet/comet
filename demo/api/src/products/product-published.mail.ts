import { MailTemplate, MailTemplateInterface, PreparedTestProps } from "@comet/cms-api";

type MailProps = {
    recipient: { name: string; email: string };
    countProductPublished: "all" | number;
};

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    id = "products-published";

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

    async getPreparedTestProps(): Promise<PreparedTestProps<MailProps>[]> {
        return [
            {
                props: {
                    recipient: { name: "John Doe", email: "abc" },
                    countProductPublished: "all",
                },
            },
            {
                props: {
                    recipient: { name: "John Doe", email: "" },
                    countProductPublished: 5,
                },
            },
        ];
    }
}
