---
title: Brevo Setup
---

# Setup

:::caution
This documentation refers to Brevo v3 or higher.
Make sure that your project uses COMET v7.10.0 or later.
:::

The Brevo Module provides three packages: `brevo-api`, `brevo-admin`, and the optional `brevo-mail-rendering` package. Please check the latest release [here](https://github.com/vivid-planet/comet-brevo-module/releases).

## API

### Installation

To add the Brevo API package, add the following to your `package.json` dependencies and install:

```json
"@vivid-planet/comet-brevo-api": "^3.0.0"
```

### Config

You need to provide configuration values so your application can connect to Brevo and related services.  
Replace the `envVars.*` placeholders with your actual environment variable names or values.

Example configuration:

```
brevo: {
    apiKey: envVars.BREVO_API_KEY,
    redirectUrlForImport: envVars.REDIRECT_URL_FOR_IMPORT,
},
campaign: {
    url: envVars.CAMPAIGN_URL,
    basicAuth: {
        username: envVars.CAMPAIGN_BASIC_AUTH_USERNAME,
        password: envVars.CAMPAIGN_BASIC_AUTH_PASSWORD,
    },
},
ecgRtrList: {
    apiKey: envVars.ECG_RTR_LIST_API_KEY,
},
```

See the table below for information on how to find the config values and what they are used for:

| Config Key                    | Description                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `brevo.apiKey`                | Your Brevo API key. Find it in your [Brevo account settings](https://app.brevo.com/settings/keys/api).            |
| `brevo.redirectUrlForImport`  | The URL in your app to redirect to after importing contacts. Set this to a route in your application.             |
| `campaign.url`                | The public URL of your campaign frontend (where users can view or interact with campaigns).                       |
| `campaign.basicAuth.username` | Username for HTTP Basic Auth if your campaign frontend is protected. Set this yourself if needed.                 |
| `campaign.basicAuth.password` | Password for HTTP Basic Auth if your campaign frontend is protected. Set this yourself if needed.                 |
| `ecgRtrList.apiKey`           | API key for the ECG RTR List integration, if used. Obtain this from the respective service or your administrator. |

### Register module

To use the Brevo Module in your project, you need to register it in your main `AppModule`.  
Pass the `scope` to the `resolveConfig` function to use the appropriate values for each scope.  
You can also register additional entities or features you want to use later on (see the section [Optional Brevo Features](http://localhost:3300/docs/features-modules/brevo-module/features/)).

Example implementation:

```
BrevoModule.register({
    brevo: {
        resolveConfig: (scope: EmailCampaignContentScope) => {
            // Change config based on scope, for example, different sender email.
            // This demonstrates how you can use the scope to change the config, but it has no real use in this example.
            if (scope.domain === "main") {
                return {
                    apiKey: config.brevo.apiKey,
                    redirectUrlForImport: config.brevo.redirectUrlForImport,
                };
            } else if (scope.domain === "secondary") {
                return {
                    apiKey: config.brevo.apiKey,
                    redirectUrlForImport: config.brevo.redirectUrlForImport,
                };
            }

            throw Error("Invalid scope passed");
        },
        BrevoContactAttributes,
        BrevoContactFilterAttributes,
        EmailCampaign,
        TargetGroup,
    },
    emailCampaigns: {
        EmailCampaignContentBlock,
        Scope: EmailCampaignContentScope,
        frontend: {
            url: config.campaign.url,
            basicAuth: {
                username: config.campaign.basicAuth.username,
                password: config.campaign.basicAuth.password,
            },
        },
    },
}),
```

## Admin

### Installation

To add the Brevo Admin package, add the following to your `package.json` dependencies and install:

```json
"@vivid-planet/comet-brevo-admin": "^3.0.0"
```

### Add Brevo Pages to the `MasterMenu`

The Brevo module offers predefined admin pages. Add those to the `MasterMenu`:

```
//...
        {
            type: "collapsible",
            primary: <FormattedMessage id="menu.newsletter" defaultMessage="Newsletter" />,
            icon: <Mail />,
            items: [
                {
                    type: "route",
                    primary: <FormattedMessage id="menu.newsletter.emailCampaigns" defaultMessage="Email campaigns" />,
                    route: {
                        path: "/newsletter/email-campaigns",
                        component: CampaignsPage,
                    },
                },
                {
                    type: "route",
                    primary: <FormattedMessage id="menu.newsletter.contacts" defaultMessage="Contacts" />,
                    route: {
                        path: "/newsletter/contacts",
                        render: () => <BrevoContactsPage />,
                    },
                },
                {
                    type: "route",
                    primary: <FormattedMessage id="menu.newsletter.testContacts" defaultMessage="Test contacts" />,
                    route: {
                        path: "/newsletter/test-contacts",
                        render: () => <BrevoTestContactsPage />,
                    },
                },
                {
                    type: "route",
                    primary: <FormattedMessage id="menu.newsletter.targetGroups" defaultMessage="Target groups" />,
                    route: {
                        path: "/newsletter/target-groups",
                        render: () => <TargetGroupsPage />,
                    },
                },
                {
                    type: "route",
                    primary: <FormattedMessage id="menu.newsletter.config" defaultMessage="Config" />,
                    route: {
                        path: "/newsletter/config",
                        render: () => <BrevoConfigPage />,
                    },
                    requiredPermission: "brevo-newsletter-config",
                },
            ],
            requiredPermission: "brevo-newsletter",
        },
//...
```

### Add Brevo configuration

Brevo must be configured using the `BrevoConfigPage` in your admin interface.

| Form Field                | Description                                                                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sender                    | The email address and name that will appear as the sender of your email campaigns. The sender address must be verified in your Brevo account.                                                                           |
| Double Opt-In Template ID | The ID of your double opt-in template. You can create a template and find its ID at [Brevo Templates](https://app.brevo.com/templates/listing).                                                                         |
| Folder ID                 | The ID of the folder in Brevo where your contacts or campaigns are organized. You can find this in your Brevo account under Contacts > Folders. If you have not changed your folder structure, this is usually `1`.     |
| Allowed Redirection URL   | Defines the pattern for valid redirection URLs used when creating or importing contacts. Only URLs matching this pattern will be accepted.                                                                              |
| Unsubscription Page ID    | The 24-digit ID of your configured unsubscription page. Go to [Brevo Unsubscription Pages](https://app.brevo.com/campaign/pages/unsubscription), add or edit a page, and copy the ID from the page URL into the config. |

## Mail Rendering

### Installation

To add the Brevo Mail Rendering package, add the following to your `package.json` dependencies and install:

```json
"@vivid-planet/comet-brevo-mail-rendering": "^3.0.0"
```
