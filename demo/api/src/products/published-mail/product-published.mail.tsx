import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { TranslationService } from "@src/translation/translation.service";
import { IntlProvider } from "react-intl";

import { Mail, type MailProps } from "./Mail";

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    constructor(private readonly translationService: TranslationService) {}

    async generateMail(props: MailProps) {
        // Imported lazily so the heavy MJML/jsdom rendering stack isn't pulled into memory on
        // API startup — it's only needed when a mail is actually rendered.
        const { renderMailHtml } = await import("@comet/mail-react/server");

        const intl = await this.translationService.getIntl(props.recipient.language);
        const { html, mjmlWarnings } = renderMailHtml(
            <IntlProvider {...intl}>
                <Mail {...props} />
            </IntlProvider>,
        );

        if (process.env.NODE_ENV === "development" && mjmlWarnings.length > 0) {
            console.warn(`${mjmlWarnings.length} MJML warnings`, mjmlWarnings);
        }

        return {
            mailTypeForLogging: "ProductPublishedMail",
            subject: intl.formatMessage({ id: "product-published-mail.subject", defaultMessage: "Products published" }),
            to: props.recipient.email,
            html,
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
