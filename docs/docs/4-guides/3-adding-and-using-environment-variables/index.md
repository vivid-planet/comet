---
title: Adding and using environment variables
---

Environment variables are key-value pairs used to configure applications outside the source-code.
They are commonly used for managing sensitive or environment-specific information, e.g., secrets, third-party API keys or environment-specific domains.
You will likely need additional environment variables in your application.
This guide explains how you can add them to your COMET project.

## Adding environment variables

### Local development

Your COMET project has multiple .env files:

-   .env
-   .env.secrets
-   .env.site-configs
-   .env.local

All files are symlinked into all service, so all env variables are available in API, admin and site.

#### .env

.env is the main file for environment variables.
It's checked into git and contains values that are specific to the local development and non-sensitive.
For example, the password for your local postgres DB (POSTGRESQL_PWD) or the local API_URL.

You should add new values to this file if they are required for local development and non-sensitive:

```dotenv title=".env"
CUSTOM_SERVICE_URL=http://localhost:5000
```

#### .env.secrets

.env.secrets is meant for actual secrets that you still need for local development, e.g., a third-party API key that you depend on.
This file is not checked into git and should never be.

We recommend storing the secrets in a safe space (e.g., 1Password) and injecting them into .env.secrets during install.

##### Example: Injecting the values with 1Password

In this case, you should create a second file, `.env.secrets.tpl` next to your .env.secrets in the project root.
You can add values to this file like this:

```dotenv title=".env.secrets.tpl"
THIRD_PARTY_API_KEY="{{ op://your-vault/your-item/key }}"
```

In your `install.sh` you should add the op inject command:

```shell title="install.sh"
# ...

echo "Creating .env.secrets from .env.secrets.tpl using op (1password)..."
op inject -f -i .env.secrets.tpl -o .env.secrets

# ...
```

This will replace the placeholders and write the result to .env.secrets.

You can find [more information about op inject in the 1Password docs](https://developer.1password.com/docs/cli/reference/commands/inject/)

#### .env.site-configs

.env.site-configs is created automatically based on the site config.
It's not checked into git and should never be.
You shouldn't edit this file manually.

You will be able to find more information about this in the site config docs which are currently WIP (see https://github.com/vivid-planet/comet/pull/3552).

[//]: # "TODO: Remove this once https://github.com/vivid-planet/comet/pull/3552 is finished"

#### .env.local

.env.local is meant for overriding values locally during development, e.g., changing the ports of the services to run multiple COMET apps at once.
This file is also not checked into git.

### Deployed environments

The aforementioned files are only used during development.
Deployed environments should supply their own env variables.
How this can and should be done depends heavily on your setup.

#### Example: Configuration via Helm

:::info
Note: This is a setup that we regularly use to host COMET apps.
However, this is not included in [the open-source starter repository](https://github.com/vivid-planet/comet-starter) and COMET can also be hosted in other setups.
:::

Helm supports [values.yaml](https://helm.sh/docs/chart_template_guide/values_files/) files for providing configuration.
However, this file doesn't support templating.
Thus, we use a non-standard `values.tpl.yaml` file that, for example, also supports injecting 1Password items (as described for .env.secrets above).
This file is then converted to the standard `values.yaml` by a script that replaces the templates.

Our setup also includes a `values-nonprod.yaml` file that inherits from the `values.tpl.yaml` and can be used to override values in the non-prod environments (staging, test, dev).

To make env variables available in deployed environments, you have to add them to `values.tpl.yaml`.
The file is split into an api, admin and site section, so it's possible to define precisely which env variables should be available in which pods.

:::warning
Env variables are only available in the pods you add them to
:::

```yaml title="values.tpl.yaml"
admin:
    # ...
    env:
        # ...

api:
    # ...
    env:
        API_PORT: "3000"
        API_URL: "https://$AUTHPROXY_DOMAIN/api"
        # ...
    secrets:
        SECRET_API_KEY: "{{ op://$OP_PREFIX-$OP_ENVIRONMENT/your-item/password }}"
        # ...

site:
    # ...
    env:
        ADMIN_URL: "https://$AUTHPROXY_DOMAIN"
        API_URL_INTERNAL: "http://$APP_NAME-$APP_ENV-api:3000/api"
        # ...
    secrets:
        # ...
```

:::warning
There is a `env` and a `secrets` section.
Sensitive values should be added under `secrets` because this ensures they are removed from the pod logs and hidden per default in Kubernetes admin interfaces.
In the code, the variables in `env` and `secrets` can be accessed identically.
:::

## Accessing environment variables in the code

How env variables can and should be accessed depends on the service.

### API

1. Add the env variable to `/src/config/environment-variables.ts`

This file contains a `EnvironmentVariables` that is used to validate the environment variables.
This should prevent errors because of missing configuration at runtime.

Add the new env variable and at least one [class-validator decorator](https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators) to `EnvironmentVariables`:

```ts title="environment-variables.ts"
export class EnvironmentVariables {
    @IsString()
    REQUIRED_VARIABLE: string;

    @IsOptional()
    @IsString()
    OPTIONAL_VARIABLE?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    VARIABLE_WITH_TRANSFORM: boolean;

    @IsString()
    @ValidateIf(() => process.env.NODE_ENV === "production")
    VARIABLE_FOR_PROD_ONLY: string;

    // ...
}
```

2. Add the variable to the config object in `/src/config/config.ts`

```ts title="config.ts"
export function createConfig(processEnv: NodeJS.ProcessEnv) {
    // ...

    return {
        // ...
        yourNewOption: envVars.YOUR_ENV_VARIABLE,
    };
}
```

3. Use your config option

Either for module configuration in the `AppModule`:

```diff
@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        const authModule = AuthModule.forRoot(config);

        return {
            module: AppModule,
            imports: [
                YourModule.register({
+                   option: config.yourNewOption,
                }),
                // ...
            ],
        };
    }
}
```

Or in an injectable class by injecting the config:

```diff
@Injectable()
export class ExampleService {
    constructor(
+       @Inject(CONFIG) private readonly config: Config,
    ) {
    }

    async exampleMethod() {
+       const example = this.config.yourNewOption;
    }
}
```

### Admin

:::warning
Environment variables used in the admin are injected into the client-side code and sent to the browser.
**They must never include sensitive secrets.**
:::

1. Add the env variable name to `/src/environment.ts`

```ts title="environment.ts"
export const environment = [
    // ...
    "YOUR_ENV_VARIABLE",
];
```

2. Add the variable to the config object in `/src/config.tsx`

```tsx
export function createConfig() {
    // ...

    return {
        // ...
        yourNewOption: environmentVariables.YOUR_ENV_VARIABLE,
    };
}
```

3. Use your config option in `App.tsx`:

```diff
// ...

const config = createConfig();

// ...

export function App() {
+   const yourOption = config.yourNewOption;

    // ...
}
```

:::info
If you need the config in another component, you should use a custom provider.
:::

### Site

#### On the server-side

On the server-side, e.g., in the middleware, you can use the env variables directly:

```diff title="src/middleware/customMiddleware.ts"
export function withCustomMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
+       const option = process.env.YOUR_ENV_VARIABLE;

        // ...
    };
}

```

#### On the client-side

:::warning
Environment variables used on the client-side are sent to the browser. **They must never include sensitive secrets.**
:::

Per default, you can't access env variables on the client-side.
To do this, you must add a provider that injects the `NEXT_PUBLIC_` env variables into the client-side code.
This could look like this:

```ts title="src/config/extract-next-public-envs.ts"
import { type NextPublicEnvs } from "./NextPublicProvider";

export function extractNextPublicEnvs(envs: typeof process.env): NextPublicEnvs {
    return Object.fromEntries(
        Object.entries(envs)
            .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
            .map(([key, val]) => [key.replace("NEXT_PUBLIC_", ""), val || ""]),
    );
}
```

```tsx title="src/config/NextPublicProvider.tsx"
"use client";

import { type PropsWithChildren, createContext, useContext } from "react";

export type NextPublicEnvs = Record<string, string>;

const NextPublicContext = createContext<NextPublicEnvs>({});

export function NextPublicProvider({
    children,
    envs,
}: PropsWithChildren<{ envs: NextPublicEnvs }>) {
    return <NextPublicContext.Provider value={envs}>{children}</NextPublicContext.Provider>;
}

export function useNextPublic(key: string) {
    return useContext(NextPublicContext)[key];
}
```

```tsx title="src/app/layout.tsx"
import { extractNextPublicEnvs } from "@src/config/extract-next-public-envs";
import { NextPublicProvider } from "@src/config/NextPublicProvider";

export default async function RootLayout({ children }) {
    return (
        <html lang={siteConfig.language}>
            {/* ... */}
            <body>
                <NextPublicProvider envs={extractNextPublicEnvs(process.env)}>
                    {/* ... */}
                </NextPublicProvider>
            </body>
        </html>
    );
}
```

:::info
In this case, your env variable must be called `NEXT_PUBLIC_YOUR_ENV_VARIABLE`
:::

```tsx title="src/**/YourComponent.tsx"
export default async function YourComponent() {
    const option = useNextPublic("YOUR_ENV_VARIABLE");

    // ...
}
```
