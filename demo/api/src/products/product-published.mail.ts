import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { css } from "@comet/mail";
import { TranslationService } from "@src/translation/translation.service";

type MailProps = {
    recipient: { name: string; email: string; language: string };
    countProductPublished: "all" | number;
};

const mailStyles = css`
    body {
        font-family: Arial, sans-serif;
    }
`;

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    constructor(private readonly translationService: TranslationService) {}

    async generateMail(props: MailProps) {
        const intl = await this.translationService.getIntl(props.recipient.language);
        return {
            mailTypeForLogging: "ProductPublishedMail",
            subject: intl.formatMessage({ id: "product-published-mail.subject", defaultMessage: "Products published" }),
            to: props.recipient.email,
            text: intl.formatMessage(
                {
                    id: "product-published-mail.text-message",
                    defaultMessage:
                        "{salutation},{br}{br}{countProductPublished, select, all {all products} 1 {a product has} other {{countProductPublished} products have}} been published",
                },
                {
                    salutation: intl.formatMessage(
                        {
                            id: "salutation",
                            defaultMessage: "Hello {name}",
                        },
                        { name: props.recipient.name },
                    ),
                    br: "\r\n",
                    countProductPublished: props.countProductPublished,
                },
            ),
            html: `<head><style>${mailStyles}</style></head>${intl.formatMessage(
                {
                    id: "product-published-mail.html-message",
                    defaultMessage:
                        "<p>{salutation},</p><p>{countProductPublished, select, all {all products} 1 {a product has} other {{countProductPublished} products have}} been published</p>",
                },
                {
                    salutation: intl.formatMessage(
                        {
                            id: "salutation",
                            defaultMessage: "Hello {name}",
                        },
                        { name: props.recipient.name },
                    ),
                    countProductPublished: props.countProductPublished,
                    p: (...chunks) => `<p>${chunks.join("")}</p>`,
                },
            )}`,
        };
    }

    async getPreparedTestProps() {
        return [
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com", language: "en" as const },
                    countProductPublished: "all" as const,
                },
            },
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com", language: "en" as const },
                    countProductPublished: 1,
                },
            },
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com", language: "en" as const },
                    countProductPublished: 5,
                },
            },
            {
                props: {
                    recipient: { name: "John Doe", email: "product-manager@comet-dxp.com", language: "de" as const },
                    countProductPublished: 5,
                },
            },
        ];
    }
}
