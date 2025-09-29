# Mail-Templates (experimental)

This module provides a way to create and manage mail-templates. It allows you to create reusable mail-templates that can be used in different parts of your application. The templates are created using React components and can be rendered to HTML using MJML.

**Epic:** https://vivid-planet.atlassian.net/browse/COM-2057

## Usage

### Changes in files

#### /api/src/app.module.ts

    imports: [
        ...
        MailTemplatesModule,
    ]

#### Create mail-class in the module the mail belongs to, e.g. `api/src/my-module/my-custom.mail.ts` (.mail is just a convention, not required)

```typescript
import { renderToMjml } from "mjml-react";

export const MY_CUSTOM_MAIL_ID = "static-mail_my-custom-mail";

@MailTemplate()
export class MyCustomMail implements MailTemplateInterface<MailParams> {
    id = MY_CUSTOM_MAIL_ID; // this is used to access this mail-template in code.

    constructor(private readonly translationService: TranslationService) {} // add dependencies if needed

    async generateMail(params: MailParams): Promise<MailOptions> {
        if (!isMailProp(params)) throw new Error(`Not possible to generate mail for given params.`); // is recommended because typescript can be mislead if wrong type for generic is used when calling mailTemplate.generateMail<T>(...).
        const intl = this.translationService.getIntl();

        return {
            to: { name: "John Doe", address: "bh@vivid-planet.com" },
            subject: intl.formatMessage({
                id: "mail-templates.static-mail_my-custom-mail.subject",
                defaultMessage: "My Custom Mail Subject",
            }),
            text: "LOREM IPSUM",
            html: renderToMjml(
                <IntlProvider locale={"de"} defaultLocale={"de"} messages={intl.messages}>
                    <MailContent {...params} />
                </IntlProvider>,
            ),
            attachments: [],
        };
    }

    async getPreparedTestParams(): Promise<PreparedTestParams<MailParams>[]> {
        // this is used for styling mail-templates and in admin for testing.
        // it's also possible to access any imported service to generate test-data.
        return [
            {
                params: { ... }, // MailParams
            },
        ];
    }
}

export type MailParams = { ... }; // define params required to generate/render the mail

const MailContent: React.FC<MailParams> = ({ recipient }) => {
    return (
        <div>
            {recipient.name} LOREM IPSUM
            <FormattedMessage id="mail-templates.static-mail_my-custom-mail.introHeadline" defaultMessage="Intro Headline" />
        </div>
    );
}

export function isMailParams(arg: unknown): arg is MailParams {
    return typeof arg === "object" && arg !== null
        // validate required params are present, e.g.:
        && "myField" in arg && arg.myField !== undefined
        && ....;
}
```

#### Use MailTemplate

```typescript
import { MY_CUSTOM_MAIL_ID, MailParams } from "@src/my-module/my-custom-mail/my-custom.mail.ts";

@Injectable()
export class MyService {
    constructor(
        private readonly mailTemplateService: MailTemplateService,
        private readonly productPublishedMail: ProductPublishedMail,
    ) {}

    async sendMail() {
        await this.mailTemplateService.sendMail(this.productPublishedMail, { ... }); // MailParams
    }
}
```

#### Send test-mail

```shell
# npm run console mail-template:test [mailTemplateId] [preparedTestParamsIndex]
npm run console mail-template:test static-mail_my-custom-mail 0
```
