# Mailer Module

## Project-Setup

### Changes in files

#### /api/src/config/environment-variables.ts

```
@IsString()
MAILER_HOST: string;

@Type(() => Number)
@IsInt()
MAILER_PORT: number;

@IsUndefinable()
@IsArray()
@Transform(({ value }) => value.split(","))
@IsEmail({}, { each: true })
MAILER_SEND_ALL_MAILS_TO?: string[];

@IsUndefinable()
@IsArray()
@Transform(({ value }) => value.split(","))
@IsEmail({}, { each: true })
MAILER_SEND_ALL_MAILS_BCC?: string[];
```

#### /api/src/config/config.ts

```
mailer: {
    // Mailer configuration
    defaultFrom: '"Comet Demo" <comet-demo@comet-dxp.com>',
    sendAllMailsTo: envVars.MAILER_SEND_ALL_MAILS_TO,
    sendAllMailsBcc: envVars.MAILER_SEND_ALL_MAILS_BCC,

    daysToKeepMailLog: 90,

    transport: { // nodemailer configuration
        host: envVars.MAILER_HOST,
        port: envVars.MAILER_PORT,
    }
},
```

#### /docker-compose.yml

```
mailpit:
    image: axllent/mailpit
    pull_policy: weekly
    ports:
        - "127.0.0.1:1025:1025" # SMTP server
        - "127.0.0.1:8025:8025" # Web UI
```

#### /.env

```
# mailer
MAILER_HOST=localhost
MAILER_PORT=1025
MAILER_SEND_ALL_MAILS_TO=demo-leaddev@comet-dxp.com,demo-pm@comet-dxp.com
```

#### /api/src/app.module.ts

```
imports: [
    ...
    MailerModule.register(config.mailer),
]
```

#### /deployment/helm/values.tpl.yaml

```
api:
  env:
    ...
    MAILER_HOST: "localhost"
    MAILER_PORT: 25
    MAILER_SEND_ALL_MAILS_TO: "demo-leaddev@comet-dxp.com,demo-pm@comet-dxp.com"
```

## Usage

### Sending a Mail

Inject the `MailerService` into your service or controller: (MailerModule is global, so no module import is needed)

```typescript
@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        private readonly mailerService: MailerService,
        ...,
    ) {}
    ...
}
```

send mail

```typescript
@Mutation(() => Boolean)
async publishAllProducts(): Promise<boolean> {
    ...
    await this.mailerService.sendMail({
        mailTypeForLogging: "products-published",
        to: "product-manager@comet-dxp.com",
        cc: "vice-product-manager@comet-dxp.com",
        subject: "All products have been published",
    });
    ...
}
```

---

## Deleting Old Mail Logs

This is done automatically after creating a new mail log entry. For any custom cleanup you should use the MailLog Repository in your application.

---

## Mail Log Creation and Updates

Mail logs are created automatically whenever an email is sent using the `sendMail` method of the `MailerService`. Each log entry records details such as recipients, subject, mail options, additional data, and the mail type for filtering and statistics. The log is created before the email is sent.

After the email is sent, the log entry is updated with the result of the send operation (such as the message ID and status). If mail logging is disabled via configuration, no log entries are created or updated.

Mail logs can be disabled using the `logMail` option of `sendMail`.

---
