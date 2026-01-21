# @comet/brevo-admin

## 3.1.4

### Patch Changes

- 9126afd: Resolve Issues with Brevo Config Page Permissions
    - Address a bug that required the brevo-newsletter-config permission to send email campaigns from the admin interface.
    - Improve error handling by enhancing the styling and incorporating a MUI Alert component to clearly display messages when the configuration is missing.

- cf4405c: Improve error handling for adding contacts:
    - Display specific error messages when attempting to create a contact that already exists or is blacklisted.
    - Provide error logs when importing blacklisted contacts via CSV import.

## 3.1.3

### Patch Changes

- 228907b: Set the peer dependency to the major version of Comet, allowing the project to specify the desired minor version as needed.

## 3.1.2

### Patch Changes

- 7aadab3: Fix block preview being too small on view page of already sent campaings

## 3.1.1

### Patch Changes

- 1ba6c4d: Ensure contacts are properly assigned to target groups during CSV import process

## 3.1.0

### Minor Changes

- 5ff4e5a: Add optional feature for importing contacts without sending a double opt-in email

    Enable creating contacts manually or using the import in admin without sending a double opt-in mail by setting a new environment variable:

    ```diff
    +   @IsBoolean()
    +   @IsUndefinable()
    +   @Transform(({ value }) => value === "true")
    +   ALLOW_ADDING_CONTACTS_WITHOUT_DOI?: boolean;
    ```

    Add `contactsWithoutDoi` to your`AppModule`:

    ```diff
             BrevoModule.register({
               brevo: {
                     //...
                   BlacklistedContacts
                  }
    +           contactsWithoutDoi: {
    +               allowAddingContactsWithoutDoi: config.contactsWithoutDoi.allowAddingContactsWithoutDoi,
    +               emailHashKey: config.contactsWithoutDoi.emailHashKey,
                        },
               //...
             });
    ```

    Add `allowAddingContactsWithoutDoi` to the `config.ts` in the api:

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

    Add it to the `config.ts` in the admin:

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

    Add `allowAddingContactsWithoutDoi` to the `BrevoConfigProvider` in your `App.tsx`:

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

- 45a5285: Added logging for contacts created without sending a double opt-in confirmation

    When a user adds a contact and skips sending the double opt-in email, the action is logged.

    If adding contacts without sending a double opt-in email is allowed, use `createBrevoEmailImportLogEntity` for creating `brevo-email-import-log` entity. Pass `Scope` and add it to the `AppModule`:

    ```diff
              BrevoModule.register({
                brevo: {
                      //...
    +           BrevoEmailImportLog
                       }
                    //...
                  });
    ```

### Patch Changes

- fc3bc63: Fix scope parameter handling in `doubleOptInTemplates` query

    Previously, the `scope` parameter in the `doubleOptInTemplates` query was not properly handled, causing it to always resolve to `undefined`. This update:
    - Adds proper scope parameter handling in the API
    - Implements scope parameter passing from the admin interface
    - Ensures correct template filtering based on scope

## 3.0.3

### Patch Changes

- 1b9cf61: Deprecate `scopeParts` in `createBrevoTestContactsPage` and use scopeParts from the BrevoConfig instead

    Instead, the `scopeParts` from the BrevoConfig will be used. This is in line with the other Page factories.

## 3.0.2

## 3.0.1

### Patch Changes

- c15195c: Improve send manager UX by positioning the TargetGroup field at the top and adding an info icon to all other fields, indicating that the TargetGroup must be selected and saved first.
- 5059c86: Fix scope in brevoTestContactsSelectQuery

## 3.0.0

### Major Changes

- adb69fd: Refactor brevo contact import to upload files to public uploads temporarily

    The files for the brevo contact import now get temporarily stored in the public uploads until the import is concluded.
    This change prepares for future imports to be handled in a separate job, allowing more than 100 contacts to be imported without exhausting api resources or blocking the event loop.

    It is now necessary to import the `PublicUploadsModule` in the project's `AppModule` and configure it to accept csv files.

    ```ts
            PublicUploadModule.register({
                acceptedMimeTypes: ["text/csv"],
                maxFileSize: config.publicUploads.maxFileSize,
                directory: `${config.blob.storageDirectoryPrefix}-public-uploads`,
            }),
    ```

- d5319bc: Add `mail-rendering` package for providing reuseable components for rendering emails

    Add new `NewsletterImageBlock`

- 4fb6b8f: A required brevo config page must now be generated with `createBrevoConfigPage`.
  All necessary brevo configuration (for each scope) must be configured within this page for emails campaigns to be sent.

    ```diff
    + const BrevoConfigPage = createBrevoConfigPage({
    +        scopeParts: ["domain", "language"],
    + });
    ```

    Env vars containing the brevo sender information can be removed.

    ```diff
    - BREVO_SENDER_NAME=senderName
    - BREVO_SENDER_EMAIL=senderEmail
    ```

- aa75e4c: Define `scopeParts` in `BrevoConfig`

    Previously the `scopeParts` were passed to the functions:
    - createBrevoContactsPage
    - createTargetGroupsPage
    - createEmailCampaignsPage
    - createBrevoConfigPage

    Now they are defined once in the `BrevoConfig`:

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

### Minor Changes

- e931996: Add field for `doubleOptInTemplateId` to `BrevoConfigPage`

    The environment variable BREVO_DOUBLE_OPT_IN_TEMPLATE_ID can be removed, as it is now available as a maintainable variable in the admin interface.

- 7215ec1: Add `folderId` to `BrevoConfig` to allow overwriting the default folderId `1`
- cc4bd07: Add a brevo configuration field for `allowedRedirectionUrl`
  Env vars containing this information can be removed and must be removed from the brevo module configuration.

    ```diff
    BrevoModule.register({
        brevo: {
    -       allowedRedirectionUrl: config.brevo.allowedRedirectionUrl,
            //...
        },
        //..
    })
    ```

- ea503b9: Add a brevo configuration field for `unsubscriptionPageId`

### Patch Changes

- a605a42: Remove the `totalContactsBlocked` field from the `TargetGroup` type, because it is not delivered in the list request in Brevo anymore.

## 2.2.0

### Minor Changes

- f07d79a: Adds `createBrevoTestContactsPage` for creating a test contacts page, that is indepent from the main list.

    Remove `email` and `redirectionUrl` from `brevoContactsPageAttributesConfig`

- d32e9e8: Replace the `TextField` with a `FinalFormSelect` component in the `TestEmailCampaignForm`, allowing users to choose contacts directly from the `TestContactList`
- ada83cf: Add filter for `sendingState` in `EmailCampaignsGrid`

## 2.1.6

### Patch Changes

- be6d19b: Remove the `totalContactsBlocked` field from the `TargetGroup` type, because it is not delivered in the list request in Brevo anymore.

## 2.1.5

## 2.1.4

## 2.1.3

## 2.1.2

### Patch Changes

- f675cd0: CSV Import Validation Improvements and Bug Fix

    Add better validation for csv imports.

    Add better feedback after a csv import when something goes wrong. User can download a file with failing rows.

    Fix a bug when importing via csv in a targetgroup. The contact was only added to the manually assigned contacts and not to the actual target group.

## 2.1.1

## 2.1.0

## 2.0.2

## 2.0.1

## 2.0.0

### Major Changes

- e5dbbfa: Add `resolvePreviewUrlForScope` in `BrevoConfigProvider` to be able to provide internationalization for the preview. The previous `previewUrl` option has been removed and must be defined via the `resolvePreviewUrlForScope`.

    **The project can then call different urls based on the scope like that:**

    ```typescript
        resolvePreviewUrlForScope: (scope: ContentScope) => {
            return `${config.campaignUrl}/preview/${scope.domain}/${scope.language}`;
        },
    ```

- 166ac36: Make this package compatible with [COMET v6](https://docs.comet-dxp.com/docs/migration/migration-from-v5-to-v6)

    **Breaking Changes**:
    - Now requires >= v6.0.0 for `@comet` packages

- aae0de4: Add `BrevoConfigProvider`

    You must add the new `BrevoConfigProvider` in you `App.tsx`. The config requires passing the `apiUrl`:

    ```tsx
    <BrevoConfigProvider value={{ apiUrl: config.apiUrl }}>{/* ... */}</BrevoConfigProvider>
    ```

    The `apiUrl` is used by the CSV contact import to upload files to the API.

- b254b38: Removes the brevo config page, `createBrevoConfigPage` is no longer available.

    ```diff
    -    const BrevoConfigPage = createBrevoConfigPage({
    -        scopeParts: ["domain", "language"],
    -    });
    ```

    Brevo config now must be set in the api brevo module initialization and can be adjusted depending on the scope.
    Scope argument was added to resolver and service functions to ensure the correct config is used for passed scope.

    ```diff
        BrevoModule.register({
            brevo: {
    +           resolveConfig: (scope: EmailCampaignContentScope) => {
    +               if (scope.domain === "main") {
    +                   return {
    +                       apiKey: config.brevo.apiKey,
    +                       doubleOptInTemplateId: config.brevo.doubleOptInTemplateId,
    +                       sender: { name: config.brevo.sender.name, email: config.brevo.sender.email },
    +                   };
    +               } else {
    +                   return {
    +                       apiKey: config.brevo.otherApiKey,
    +                       doubleOptInTemplateId: config.brevo.otherDoubleOptInTemplateId,
    +                       sender: { name: config.brevo.otherSender.name, email: config.brevo.otherSender.email },
    +                   };
    +               }
    +           },
                // ...
            },
        })
    ```

- 44fcc6c: A required brevo config page must now be generated with `createBrevoConfigPage`.
  All necessary brevo configuration (for each scope) must be configured within this page for emails campaigns to be sent.

    ```diff
    + const BrevoConfigPage = createBrevoConfigPage({
    +        scopeParts: ["domain", "language"],
    + });
    ```

    Env vars containing the brevo sender information can be removed.

    ```diff
    - BREVO_SENDER_NAME=senderName
    - BREVO_SENDER_EMAIL=senderEmail
    ```

### Minor Changes

- e774ecb: Allow manually assigning contacts to a target group

    This is in addition to the existing automatic assignment via filters.

- 34beaac: All assigned contacts are now displayed in a datagrid on the target group edit admin page.
- 274cc77: Add a download button in the target group grid to download a list of contacts as csv file.

    It is possible to configure additional contact attributes for the export in the `createTargetGroupsPage`.

    ```diff
    createTargetGroupsPage({
        // ....
    +   exportTargetGroupOptions: {
    +       additionalAttributesFragment: brevoContactConfig.additionalAttributesFragment,
    +       exportFields: brevoContactConfig.exportFields,
    +   },
    });
    ```

- a7b82e7: Add `scope` in `previewState` for the `EmailCampaignView`

    This can be useful for example when applications have different styling depending on the scope.

- be70f36: Fix `TargetGroupForms` if no additional form fields are defined.
- aae0de4: Add functionality to import Brevo contacts from CSV files

    You can import CSV files via the Admin interface or via CLI command.

    **Note:** For the import to work, you must provide a `redirectUrlForImport` to the `BrevoModule` in the API and an `apiUrl` to the `BrevoConfigProvider` in the admin. See the respective changelog entries for more information.

    CLI command:

    ```bash
    npm run --prefix api console import-brevo-contacts -- -p <path-to-csv-file> -s '<scope-json>' [--targetGroupIds <ids...>]

    // Example:
    npm run --prefix api console import-brevo-contacts -- -p test_contacts_import.csv -s '{"domain": "main", "language":"de"}' --targetGroupIds 2618c982-fdf8-4cab-9811-a21d3272c62c,c5197539-2529-48a7-9bd1-764e9620cbd2
    ```

- f7c0fdd: Allow sending a campaign to multiple target groups
- 539b321: Allow react-intl v5 and v6 as peerDependency
- 42746b1: Add an edit page for brevo contacts
  It is possible to configure additional form fields for this page in the `createBrevoContactsPage`.

    ```diff
        createBrevoContactsPage({
             //...
    +        additionalFormFields: brevoContactConfig.additionalFormFields,
    +        input2State: brevoContactConfig.input2State,
        });
    ```

### Patch Changes

- 5b763f3: Fix scheduledAt date validation error shown when scheduleAt date is in the past when email campaign is already sending or in sent state
  Now routing back to the email campaign grid after sending email campaign now
