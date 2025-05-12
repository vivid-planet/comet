---
title: Add contacts without sending double opt-in
---

Contacts added to a newsletter are legally obliged to give their consent (usually via double opt-in). There may be scenarios, in which a contact already gave their permission. In this case, this feature allows adding or importing contacts without sending a double opt-in message.

:::caution
Make sure that your project uses Brevo Module v3.1.0 or later.
:::

## Allow adding contacts without sending a double opt-in mail

1. Set a new environment variable `ALLOW_ADDING_CONTACTS_WITHOUT_DOI` to true:

```diff
+   @IsBoolean()
+   @IsUndefinable()
+   @Transform(({ value }) => value === "true")
+   ALLOW_ADDING_CONTACTS_WITHOUT_DOI?: boolean;
```

2. Add `contactsWithoutDoi` to your`AppModule`:

```diff
         BrevoModule.register({
           brevo: {
                 //...
               BlacklistedContacts
              }
+           contactsWithoutDoi: {
+               allowAddingContactsWithoutDoi: config.contactsWithoutDoi.allowAddingContactsWithoutDoi,
                    },
           //...
         });
```

3. Add `allowAddingContactsWithoutDoi` to the `config.ts` in the api:

```diff
    //...
    ecgRtrList: {
            apiKey: envVars.ECG_RTR_LIST_API_KEY,
        },
+    contactsWithoutDoi: {
+       allowAddingContactsWithoutDoi: envVars.ALLOW_ADDING_CONTACTS_WITHOUT_DOI,
        },
    //...
```

4. Add it to the `config.ts` in the admin:

```diff
        //...
            return {
                    ...cometConfig,
            apiUrl: environmentVariables.API_URL,
            adminUrl: environmentVariables.ADMIN_URL,
            sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
            buildDate: environmentVariables.BUILD_DATE,
            buildNumber: environmentVariables.BUILD_NUMBER,
            commitSha: environmentVariables.COMMIT_SHA,
            campaignUrl: environmentVariables.CAMPAIGN_URL,
+           allowAddingContactsWithoutDoi: environmentVariables.ALLOW_ADDING_CONTACTS_WITHOUT_DOI === "true",
                  }
```

5. Add `allowAddingContactsWithoutDoi` to the `BrevoConfigProvider` in your `App.tsx`:

```diff
    //...
           <BrevoConfigProvider
                 value={{
                        scopeParts: ["domain", "language"],
                        apiUrl: config.apiUrl,
                        resolvePreviewUrlForScope: (scope: ContentScope) => {
                            return `${config.campaignUrl}/block-preview/${scope.domain}/${scope.language}`;
                            },
+                       allowAddingContactsWithoutDoi: config.allowAddingContactsWithoutDoi,
                            }}
            >
```

## Add `BlacklistedContacts` table

To prevent re-adding contacts, that unsubscribed (are blacklisted), those contacts are hashed and stored in a separate table. Adding a contact again, is only possible, if the contact gives his consent via double opt-in.

1. Use `createBlacklistedContactsEntity` for creating a `BlacklistedContacts` entity. Pass `Scope` and add it to the `AppModule`:

```diff
          BrevoModule.register({
            brevo: {
                  //...
+               BlacklistedContacts
               }
            //...
          });
```

2. Add `emailHashKey` to your environment variables:

```diff
+  @IsString()
+  @Length(64)
+  EMAIL_HASH_KEY: string;
```

3. Also add it to the `config.ts` and your `AppModule`:

```diff
    //...
    ecgRtrList: {
        apiKey: envVars.ECG_RTR_LIST_API_KEY,
    },
    contactsWithoutDoi: {
      allowAddingContactsWithoutDoi: config.contactsWithoutDoi.allowAddingContactsWithoutDoi,
+     emailHashKey: config.contactsWithoutDoi.emailHashKey,
    },
    sitePreviewSecret: envVars.SITE_PREVIEW_SECRET,
```

```diff
         BrevoModule.register({
           brevo: {
                 //...
               BlacklistedContacts
              }
            contactsWithoutDoi: {
              allowAddingContactsWithoutDoi: config.contactsWithoutDoi.allowAddingContactsWithoutDoi,
+             emailHashKey: config.contactsWithoutDoi.emailHashKey,
                    },
           //...
         });


```

## Add action logging for adding contacts without sending a double opt-in

When a user adds a contact and skips sending the double opt-in email, the action is logged.

1. Use `createBrevoEmailImportLogEntity` for creating `BrevoEmailImportLog` entity. Pass `Scope` and add it to the `AppModule`:

```diff
          BrevoModule.register({
            brevo: {
                  //...
+           BrevoEmailImportLog
                   }
                //...
              });
```
