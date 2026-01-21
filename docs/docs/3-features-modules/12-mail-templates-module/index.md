# Mail-Templates (experimental)

This module provides a way to create and manage mail-templates. It allows you to create reusable mail-templates that can be used in different parts of your application. The templates are created using React components and can be rendered to HTML using MJML.

**Epic:** https://vivid-planet.atlassian.net/browse/COM-2057

## Setup

Add the `MailTemplatesModule` to the imports of your `AppModule`:

```ts title="/api/src/app.module.ts"
imports: [
    // existing imports
    MailTemplatesModule,
]
```

## Create a mail template class

Create class in the module the mail belongs to, e.g. `api/src/my-module/my-custom.mail.ts` (.mail is just a convention, not required)

```ts title="/api/src/my-module/my-custom.mail.ts"
import { renderToMjml } from "mjml-react";

@MailTemplate()
export class MyCustomMail implements MailTemplateInterface<MailProps> {
    constructor(private readonly translationService: TranslationService) {} // add dependencies if needed

    async generateMail(props: MailProps) {
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
                    <MailContent {...props} />
                </IntlProvider>,
            ),
            attachments: [],
        };
    }

    async getPreparedTestProps() {
        // this is used for styling mail-templates and in admin for testing.
        // it's also possible to access any imported service to generate test-data.
        return [
            {
                props: { ... }, // MailProps
            },
        ];
    }
}

export type MailProps = { ... }; // define props required to generate/render the mail

const MailContent: React.FC<MailProps> = ({ recipient }) => {
    return (
        <div>
            {recipient.name} LOREM IPSUM
            <FormattedMessage id="mail-templates.static-mail_my-custom-mail.introHeadline" defaultMessage="Intro Headline" />
        </div>
    );
}
```

## Register the mail template class

Register the mail template class in the module it belongs to, required for debug-tools to find the mail-template

```ts title="/api/src/my-module/my-module.module.ts"
providers: [
    // existing providers
    MyCustomMail,
]
```

## Use MailTemplate

```ts title="/api/src/my-module/my-service.ts"
import { MyCustomMail } from "@src/my-module/my-custom-mail/my-custom.mail.ts";

@Injectable()
export class MyService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly myCustomMail: MyCustomMail,
    ) {}

    async sendMail() {
        await this.mailerService.sendMail({
            ...(await this.myCustomMail.generateMail({ ... })), // MailProps
        });
    }
}
```

## Send a test-mail

```shell
# npm run console mail-template:test [mailTemplateClassName] [preparedTestPropsIndex]
npm run console mail-template:test MyCustomMail 0
```
