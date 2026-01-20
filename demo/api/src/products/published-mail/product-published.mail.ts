import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { getMailHtml } from "@src/mail/utils/getMailHtml";
import { TranslationService } from "@src/translation/translation.service";

import { Mail, type MailProps } from "./Mail";

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    constructor(private readonly translationService: TranslationService) {}

    async generateMail(props: MailProps) {
        const intl = await this.translationService.getIntl(props.recipient.language);
        const mailHtml = getMailHtml(Mail, props);

        return {
            mailTypeForLogging: "ProductPublishedMail",
            subject: intl.formatMessage({ id: "product-published-mail.subject", defaultMessage: "Products published" }),
            to: props.recipient.email,
            html: mailHtml,
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
