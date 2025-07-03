import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";
import { TranslationService } from "@src/config/translation.service";

type MailProps = {
    recipient: { name: string; email: string; language: "en" | "de" };
    countProductPublished: "all" | number;
};

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<MailProps> {
    constructor(private readonly translationService: TranslationService) {}

    async generateMail(props: MailProps) {
        const intl = this.translationService.getIntl(props.recipient.language);
        return {
            mailTypeForLogging: "ProductPublishedMail",
            subject: intl.formatMessage({ id: "product-published-mail.subject", defaultMessage: "All products published" }),
            to: props.recipient.email,
            text:
                props.countProductPublished === "all"
                    ? intl.formatMessage(
                          {
                              id: "product-published-mail.all-published",
                              defaultMessage: "{salutation},{br}{br}all products have been published",
                          },
                          {
                              salutation: intl.formatMessage(
                                  {
                                      id: "salutation",
                                      defaultMessage: "Hello, {name}",
                                  },
                                  { name: props.recipient.name },
                              ),
                              br: "\r\n",
                          },
                      )
                    : intl.formatMessage(
                          {
                              id: "product-published-mail.some-published",
                              defaultMessage:
                                  "{salutation},{br}{br}{countProductPublished, plural, one {A product has} other {# products have}} been published",
                          },
                          {
                              salutation: intl.formatMessage(
                                  {
                                      id: "salutation",
                                      defaultMessage: "Hello, {name}",
                                  },
                                  { name: props.recipient.name },
                              ),
                              br: "\r\n",
                              countProductPublished: props.countProductPublished,
                          },
                      ),
            html:
                props.countProductPublished === "all"
                    ? intl.formatMessage(
                          {
                              id: "product-published-mail.all-published-html",
                              defaultMessage: "<p>{salutation},</p><p>all products have been published</p>",
                          },
                          {
                              salutation: intl.formatMessage(
                                  {
                                      id: "salutation",
                                      defaultMessage: "Hello, {name}",
                                  },
                                  { name: props.recipient.name },
                              ),
                          },
                      )
                    : intl.formatMessage(
                          {
                              id: "product-published-mail.some-published-html",
                              defaultMessage:
                                  "<p>{salutation},</p><p>{countProductPublished, plural, one {A product has} other {# products have}} been published</p>",
                          },
                          {
                              salutation: intl.formatMessage(
                                  {
                                      id: "salutation",
                                      defaultMessage: "Hello, {name}",
                                  },
                                  { name: props.recipient.name },
                              ),
                              countProductPublished: props.countProductPublished,
                          },
                      ),
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
                    countProductPublished: 5,
                },
            },
        ];
    }
}
