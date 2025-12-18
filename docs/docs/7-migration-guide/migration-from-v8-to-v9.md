---
title: Migrating from v8 to v9
sidebar_position: -9
---

# Migrating from v8 to v9

## Admin

### Tooltip-related Changes

#### 🤖 Replace the `variant` prop with `color` in `Tooltip`

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v9/admin/after-install/tooltip-replace-variant-prop.ts
    ```

:::

<details>

The `variant` prop has been renamed to color and the options `neutral` and `primary` have been removed.
Change the usage of `variant` to `color` and remove or replace the values `neutral` and `primary`.

Example:

```diff
 <Tooltip
     title="Title"
-    variant="light"
+    color="light"
 >
     <Info />
 </Tooltip>
```

```diff
 <Tooltip
     title="Title"
-    variant="neutral"
 >
     <Info />
 </Tooltip>
```

</details>

#### Replace `createHttpClient` with native fetch

The `createHttpClient` function has been removed. Use native fetch instead.

### Remove `clearable` prop from `Autocomplete`, `FinalFormInput`, `FinalFormNumberInput` and `FinalFormSearchTextField`

Those fields are now clearable automatically when not set to `required`, `disabled` or `readOnly`.

## Site

### 🤖 Upgrade peer dependencies

The following upgrade script will update peer dependency versions and make some minor changes in the code.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v9/site/before-install
```

:::

<details>

<summary>Updates handled by this batch upgrade script</summary>

#### ✅ Next.js

Upgrade all your dependencies to support Next.js v15

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v9/site/before-install/update-next-dependencies.ts
```

:::

```diff title=site/package.json
{
    "dependencies": {
-       "@next/bundle-analyzer": "^14.2.30",
+       "@next/bundle-analyzer": "^15.5.4",
-       "next": "^14.2.30",
-       "react": "^18.3.1",
-       "react-dom": "^18.3.1",
+       "next": "^15.5.4",
+       "react": "^19.2.0",
+       "react-dom": "^19.2.0",
    },
    "devDependencies": {
-       "@types/react": "^18.3.23",
-       "@types/react-dom": "^18.3.7",
+       "@types/react": "^19.2.0",
+       "@types/react-dom": "^19.2.0",
    }
}
```

</details>

</details>

### Add `next-env.d.ts` to `.gitignore`

```sh
git rm site/next-env.d.ts

echo "next-env.d.ts" >> site/.gitignore
```

### Add `next typegen` to `lint:tsc` script

This is necessary for the lint to work during CI.

```diff title="site/package.json"
{
    "scripts": {
-       "lint:tsc": "tsc --project ."
+       "lint:tsc": "npx next typegen && tsc --project ."
    }
}
```

### Remove `eslint` from the Next.js config file

```diff title="site/next.config.(js|mjs|ts)"
const nextConfig: NextConfig = {
    /* ... */,
-   eslint: {
-       ignoreDuringBuilds: process.env.NODE_ENV === "production",
-   },
};
```

### Disable Turbopack

Our site packages currently aren't compatible with Turbopack.
Disable Turbopack until this is resolved:

```diff title="site/server.(js|ts)"
- const app = next({ dev, hostname: host, port });
+ const app = next({ dev, hostname: host, port, webpack: true });
```

```diff title="site/package.json"
{
    "scripts": {
-       "build": "run-s intl:compile && run-p gql:types generate-block-types css:types build-server && next build"
+       "build": "run-s intl:compile && run-p gql:types generate-block-types css:types build-server && next build --webpack"
    }
}
```

### Fix TypeScript errors caused by React 19 upgrade

Fix all type errors caused by upgrading to React 19.
Review the [migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#typescript-changes) for more information.

### Change to Next.js Async Request APIs

Multiple Next.js APIs (e.g., `headers()`) are now asynchronous.
Update your usages to support the asynchronous APIs.
You can use the new props helper types.
Review the [migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16#async-request-apis-breaking-change) for more information.

```diff title="site/src/app/[visibility]/[domain]/[language]/[[...path]]/page.tsx"
- type PageProps = {
-   params: { path: string[]; domain: string; language: string; visibility: VisibilityParam };
- };

- export default async function Page({ params }: PageProps) {
+ export default async function Page({ params }: PageProps<"/[visibility]/[domain]/[language]/[[...path]]">) {
-   setVisibilityParam(params.visibility);
-   const scope = { domain: params.domain, language: params.language };
+   const { visibility, domain, language } = await params;
+   setVisibilityParam(visibility as VisibilityParam);
+   const scope = { domain, language };
}
```

### Rename `middleware.ts` to `proxy.ts`

```sh
mv site/src/middleware.ts site/src/proxy.ts
```

:::note

If you're using Knip, you may need to add `proxy.ts` as entry point:

```diff title="site/knip.json"
{
    "$schema": "https://unpkg.com/knip@5/schema.json",
    "entry": [
        "./src/app/**",
        "./cache-handler.ts",
        "./tracing.ts",
+       "./src/proxy.ts"
    ],
    "project": ["./src/**/*.{ts,tsx}"]
}
```

:::

### Domain Redirects

Domain redirects can now be set in the admin. To enable domain-based redirects, you need to:

1. **Add the relevant domains** to the `additional` array in your site config, so that the middleware can recognize and handle them.

2. **Adapt your middleware** to handle the new `domain` source type for redirects. Check for domain-based redirects and perform the appropriate redirect by updating your previous `redirectToMainHost` middleware.

#### Example: Site Config

```ts title="site-configs/main.ts"
export default ((env) => {
    return {
        //...
        domains: {
            main: envToDomainMap[env],
            additional: ["test.localhost:3000"], // Add your additional domains here
        },
        //...
    };
}) satisfies GetSiteConfig;
```

#### Example: Middleware Usage

Update your middleware—most likely the `redirectToMainHost` middleware—to handle domain redirects. For example:

```ts title="site/src/middleware/redirectToMainHost.ts"
const domainRedirectsQuery = gql`
    query DomainRedirects($scope: RedirectScopeInput!) {
        paginatedRedirects(scope: $scope) {
            nodes {
                id
                source
                target
                sourceType
            }
        }
    }
`;

async function fetchDomainRedirects(domain: string) {
    const key = `domainRedirects-${domain}`;
    return memoryCache.wrap(key, async () => {
        const graphQLFetch = createGraphQLFetch();
        const data = await graphQLFetch<
            {
                paginatedRedirects: {
                    nodes: {
                        id: string;
                        source: string;
                        target: RedirectsLinkBlockData;
                        sourceType: string;
                    }[];
                };
            },
            { scope: { domain: string } }
        >(domainRedirectsQuery, {
            scope: { domain },
        });

        return data?.paginatedRedirects?.nodes || [];
    });
}

async function getDomainRedirectTarget(
    domain: string,
    host: string,
): Promise<RedirectsLinkBlockData | undefined> {
    const redirects = await fetchDomainRedirects(domain);
    const redirectsArray = Array.isArray(redirects) ? redirects : [redirects];
    const normalizeHost = (value: string) => {
        return value.replace(/^https?:\/\//, "");
    };
    const matching = redirectsArray.find((redirect) => {
        return (
            redirect.sourceType === "domain" &&
            normalizeHost(redirect.source) === normalizeHost(host)
        );
    });
    if (matching) {
        return matching.target;
    }
    return undefined;
}

const matchesHostWithAdditionalDomain = (siteConfig: PublicSiteConfig, host: string) => {
    if (siteConfig.domains.main === host) return true;
    if (siteConfig.domains.additional?.includes(host)) return true;
    return false;
};

const matchesHostWithPattern = (siteConfig: PublicSiteConfig, host: string) => {
    if (!siteConfig.domains.pattern) return false;
    return new RegExp(siteConfig.domains.pattern).test(host);
};

export function withRedirectToMainHostMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        if (!siteConfig) {
            const redirectSiteConfig =
                getSiteConfigs().find((siteConfig) =>
                    matchesHostWithAdditionalDomain(siteConfig, host),
                ) ||
                getSiteConfigs().find((siteConfig) => matchesHostWithPattern(siteConfig, host));

            if (redirectSiteConfig) {
                const { scope } = redirectSiteConfig;

                const domainRedirectTarget = await getDomainRedirectTarget(scope.domain, host);

                if (domainRedirectTarget) {
                    let destination: string | undefined;
                    if (
                        typeof domainRedirectTarget === "object" &&
                        domainRedirectTarget.block !== undefined
                    ) {
                        switch (domainRedirectTarget.block.type) {
                            case "internal": {
                                const internalLink = domainRedirectTarget.block
                                    .props as InternalLinkBlockData;
                                if (internalLink.targetPage) {
                                    destination = createSitePath({
                                        path: internalLink.targetPage.path,
                                        scope: internalLink.targetPage.scope as Pick<
                                            GQLPageTreeNodeScope,
                                            "language"
                                        >,
                                    });
                                    if (destination && destination.startsWith("/")) {
                                        destination = `http://${host}${destination}`;
                                    }
                                }
                                break;
                            }
                            case "external":
                                destination = (
                                    domainRedirectTarget.block.props as ExternalLinkBlockData
                                ).targetUrl;
                                break;
                        }
                    }
                    if (destination) {
                        return NextResponse.redirect(destination, { status: 301 });
                    }
                }
            }

            return NextResponse.json({ error: `Cannot resolve domain: ${host}` }, { status: 404 });
        }
        return middleware(request);
    };
}
```

#### Admin UI

In the admin, you can now select `domain` as the source type when creating a redirect. Enter the full domain (e.g., `https://mydomain.com`) as the source, and specify the target as usual.

**Note:** Domain redirects only work if the DNS entry for the domain points to your web server.

### Add `cache: "force-cache"` to GraphQL fetch

Next.js no longer caches `fetch` requests by default.
Review the [migration guide](https://nextjs.org/docs/app/guides/upgrading/version-15#fetch-requests) for more information.
Add `cache: "force-cache"` to `createGraphQLFetch()`:

```diff title="site/src/util/graphQLClient.ts"
export function createGraphQLFetch() {
    // ...

    return createGraphQLFetchLibrary(
        createFetchWithDefaults(createFetchWithDefaultNextRevalidate(fetch, 7.5 * 60), {
+           cache: "force-cache",
            headers: {
                // ...
            },
        }),
        `${process.env.API_URL_INTERNAL}/graphql`,
    );
}
```
