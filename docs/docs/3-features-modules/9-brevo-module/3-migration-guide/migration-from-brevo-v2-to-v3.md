---
title: Migrating from v2 to v3
---

:::caution
Make sure that your project uses COMET v7.10.0 or later.
:::

## API

### Create `EmailCampaign` and `TargetGroup` entities

Use `createEmailCampaignEntity` for creating the `EmailCampaign` entity. Pass `EmailCampaignContentBlock`, `Scope` and `TargetGroup`:

```ts
export const EmailCampaign = createEmailCampaignEntity({
    EmailCampaignContentBlock: EmailCampaignContentBlock,
    Scope: EmailCampaignContentScope,
    TargetGroup: TargetGroup,
});
```

Use `createTargetGroupEntity` for creating the `TargetGroup` entity. Pass `Scope` and optionally `BrevoFilterAttributes`:

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
+           EmailCampaign
+           TargetGroup
        }
        //...
    });
```

### Import `FileUploadsModule` in the project's `AppModule`

It is now required to import the `FileUploadsModule` in the project's `AppModule` and configure it to accept CSV files.

```ts
FileUploadsModule.register({
    acceptedMimeTypes: ["text/csv"],
    maxFileSize: config.fileUploads.maxFileSize,
    directory: `${config.blob.storageDirectoryPrefix}-file-uploads`,
}),
```

The files for the Brevo contact import now get temporarily stored in the file uploads until the import is concluded.
This change prepares for future imports to be handled in a separate job, allowing more than 100 contacts to be imported without exhausting API resources or blocking the event loop.

### Remove Brevo configuration variables from environment variables

Environment variables containing Brevo configuration information can be removed and are set on the `BrevoConfigurationPage` in the admin interface from now on.

- BREVO_SENDER_NAME
- BREVO_SENDER_EMAIL
- BREVO_DOUBLE_OPT_IN_TEMPLATE_ID
- BREVO_ALLOWED_REDIRECT_URL

### Add `scope` to `BrevoConfig`

A custom database migration must be created in the project to add individual `scope` columns to `BrevoConfig`.

```ts
//...
this.addSql(
    `alter table "BrevoConfig" add column "scope_domain" text not null, add column "scope_language" text not null;`,
);
//...
```

### Remove environment variables from the Brevo module configuration

```diff
BrevoModule.register({
    brevo: {
-       allowedRedirectUrl: config.brevo.allowedRedirectUrl,
-       sender: { name: config.brevo.sender.name, email: config.brevo.sender.email },
-       doubleOptInTemplateId: config.brevo.doubleOptInTemplateId,
        //...
    },
    //...
})
```

## Admin

### Add Brevo configuration page to admin interface

Import `BrevoConfigPage` from `@comet/brevo-admin` and add it to your project's `MasterMenu`. All necessary Brevo configuration (for each scope) must be configured within this page for email campaigns to be sent.

### Define `scopeParts` in `BrevoConfig`

Previously, the `scopeParts` were passed to `createBrevoContactsPage`, `createTargetGroupsPage`, and `createEmailCampaignsPage`.
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

### Add Brevo test contacts page to admin interface

Create `BrevoTestContactsPage` with `createBrevoTestContactsPage` from `@comet/brevo-admin` and add it to your project's `MasterMenu`:

```tsx
const BrevoTestContactsPage = createBrevoTestContactsPage({
    additionalAttributesFragment: brevoContactConfig.additionalAttributesFragment,
    additionalGridFields: brevoContactConfig.additionalGridFields,
    additionalFormFields: brevoContactConfig.additionalFormFields,
    input2State: brevoContactConfig.input2State,
});
```

### Remove `email` and `allowedRedirectUrl` from `brevoContactsPageAttributesConfig`

```diff
//...
  input2State: (values?: AdditionalFormConfigInputProps) => {
-     email: string;
-     redirectionUrl: string;
      attributes: //...
  };
//...
```

## Site

### Optional: use new `@comet/brevo-mail-rendering` package

Install `@comet/brevo-mail-rendering` in your project's site.
This package offers reuseable components for rendering emails.
You can use the `NewsletterImageBlock` for rendering images in your newsletter campaigns.
