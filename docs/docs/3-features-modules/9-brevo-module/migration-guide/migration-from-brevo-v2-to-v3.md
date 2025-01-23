---
title: Migrating from v2 to v3
---

:::caution
Make sure, that your project uses COMET v7.10.0 or later.
:::

## API

### Create `email-campaign` and `target-group` entities

Use `createEmailCampaignEntity` for creating `email-campaign` entity. Pass `EmailCampaignContentBlock`, `Scope` and `TargetGroup`.

```ts
export const EmailCampaign = createEmailCampaignEntity({
    EmailCampaignContentBlock: EmailCampaignContentBlock,
    Scope: EmailCampaignContentScope,
    TargetGroup: TargetGroup,
});
```

Use `createTargetGroupEntity` for creating `target-group` entity. Pass `Scope` and optional `BrevoFilterAttributes`

```ts
export const TargetGroup = createTargetGroupEntity({
    Scope: EmailCampaignContentScope,
    BrevoFilterAttributes: BrevoContactFilterAttributes,
});
```

Pass both to the `AppModule`:

```diff
      BrevoModule.register({
        brevo: {
              //...
  +        EmailCampaign
  +        TargetGroup
           }
        //...
      });
```

### Import `PublicUploadsModule` in the project's `AppModule`

It is now necessary to import the `PublicUploadsModule` in the project's `AppModule` and configure it to accept csv files.

```ts
        PublicUploadModule.register({
            acceptedMimeTypes: ["text/csv"],
            maxFileSize: config.publicUploads.maxFileSize,
            directory: `${config.blob.storageDirectoryPrefix}-public-uploads`,
        }),
```

The files for the brevo contact import now get temporarily stored in the public uploads until the import is concluded.
This change prepares for future imports to be handled in a separate job, allowing more than 100 contacts to be imported without exhausting api resources or blocking the event loop.

### Remove brevo configuration variables from environment variables

Env vars containing brevo configuration information can be removed and are set on the `BrevoConfigurationPage` in the admin interface from now on.

-   BREVO_SENDER_NAME
-   BREVO_SENDER_EMAIL
-   BREVO_DOUBLE_OPT_IN_TEMPLATE_ID
-   BREVO_ALLOWED_REDIRECT_URL

### Remove `allowedRedirectionUrl` from the brevo module configuration

```diff
BrevoModule.register({
    brevo: {
-       allowedRedirectionUrl: config.brevo.allowedRedirectionUrl,
        //...
    },
    //..
})
```

## ADMIN

### Add brevo configuration page to admin interface

Import `BrevoConfigPage` from `@comet/brevo-admin` and add it to your project's MasterMenu. All necessary brevo configuration (for each scope) must be configured within this page for email campaigns to be sent.

### Define `scopeParts` in `BrevoConfig`

Previously the `scopeParts` were passed to the functions:

-   createBrevoContactsPage
-   createTargetGroupsPage
-   createEmailCampaignsPage

Remove `scopeParts` from those functions.
Instead define them in the `BrevoConfigProvider` once:

```tsx
<BrevoConfigProvider
    value={{
        scopeParts: ["domain", "language"],
        ...otherProps,
    }}
>
    {children}
</BrevoConfigProvider>
```

## SITE

### Install new `mail-rendering` package

Install `@comet/brevo-mail-rendering` in your project's site. This package offers reuseable frontend components for rendering emails.

Optional: You can use the `NewsletterImageBlock` for rendering Images in your Newsletter campaigns.
