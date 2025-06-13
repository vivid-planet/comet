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

@IsString()
MAILER_DEFAULT_SENDER: string;

@IsOptional()
@IsArray()
@Transform(({ value }) => value.split(","))
@IsString({ each: true })
MAILER_SEND_ALL_MAILS_TO?: string[];

@IsOptional()
@IsArray()
@Transform(({ value }) => value.split(","))
@IsString({ each: true })
MAILER_SEND_ALL_MAILS_BCC?: string;
```

#### /api/src/config/config.ts

```
mailer: {
    // Mailer configuration
    defaultSender: envVars.MAILER_DEFAULT_SENDER,
    sendAllMailsTo: envVars.MAILER_SEND_ALL_MAILS_TO,
    sendAllMailsBcc: envVars.MAILER_SEND_ALL_MAILS_BCC,
    // nodemailer configuration
    host: envVars.MAILER_HOST,
    port: envVars.MAILER_PORT,
    tls: {
        rejectUnauthorized: false,
    },
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
MAILER_DEFAULT_SENDER='"Comet Demo" <comet-demo@comet-dxp.com>'
MAILER_SEND_ALL_MAILS_TO=demo-leaddev@comet-dxp.com,demo-pm@comet-dxp.com
```

#### /api/src/app.module.ts or specific module file

```
imports: [
    ...
    MailerModule.forRoot(config.mailer),
]
```

#### /deployment/helm/values.tpl.yaml

```
api:
  env:
    ...
    MAILER_HOST: "localhost"
    MAILER_PORT: 25
    MAILER_DEFAULT_SENDER: '"Comet Demo" <comet-demo@comet-dxp.com>'
    MAILER_SEND_ALL_MAILS_TO: "demo-leaddev@comet-dxp.com,demo-pm@comet-dxp.com"
```

#### /api/package.json

```
"dependencies": {
    ...
    "nodemailer": "^7.0.3",
    ...
}
```

## Usage

### Sending a Mail

Add as import to your module

```typescript
@Module({})
export class ProductsModule {
    static forRoot(mailerModule: DynamicModule): DynamicModule {
        return {
            module: ProductsModule,
            imports: [
                mailerModule,
                ...,
            ],
            ...,
        };
    }
}
```

Then inject the `MailerService` into your service or controller:

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
        type: "products-published",
        to: "product-manager@comet-dxp.com",
        cc: "vice-product-manager@comet-dxp.com",
        subject: "All products have been published",
    });
    ...
}
```
