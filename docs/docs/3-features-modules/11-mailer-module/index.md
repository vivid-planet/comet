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
MAILER_SEND_ALL_MAILS_BCC?: string;
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
mailhog:
  image: mailhog/mailhog
  ports:
    - 1025:1025
    - 8025:8025
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

You can delete old mail logs from the database using the CLI command:

```
npm run console -- mailer:delete-mail-logs-older-than <count> <duration> [--type <type>]
```

- `<count>`: Number of units (e.g., 30)
- `<duration>`: Time unit (years, months, weeks, days, hours, minutes, seconds)
- `--type <type>` (optional): Filter logs by mail type

**Example:**

To delete all mail logs older than 30 days:

```
npm run console -- mailer:delete-mail-logs-older-than 30 days
```

To delete all mail logs of type `notification` older than 7 days:

```
npm run console -- mailer:delete-mail-logs-older-than 7 days --type notification
```

This command will remove all mail logs created before the specified duration. Use with caution, as this operation is irreversible.

---

## Mail Log Creation and Updates

Mail logs are created automatically whenever an email is sent using the `sendMail` method of the `MailerService`. Each log entry records details such as recipients, subject, mail options, additional data, and the mail type for filtering and statistics. The log is created before the email is sent.

After the email is sent, the log entry is updated with the result of the send operation (such as the message ID and status). If mail logging is disabled via configuration, no log entries are created or updated.

Mail logs are not created when using the `logMail` option of `sendMail`.

---
