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

```diff
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

## Mail Rendering

### Installation

To add the Brevo Mail Rendering package, add the following to your `package.json` dependencies and install:

```json
"@vivid-planet/comet-brevo-mail-rendering": "^3.0.0"
```
