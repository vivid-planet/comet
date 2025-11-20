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

### Add `next-env.d.ts` to `eslint.config.mjs`

```diff title="site/eslint.config.mjs"
/** @type {import('eslint')} */
const config = [
    {
-       ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**"],
+       ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", "next-env.d.ts"],
    },
    ...eslintConfigNextJs,
];
```

### Fix TypeScript errors caused by React 19 upgrade

Fix all type errors caused by upgrading to React 19.
Review the [migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#typescript-changes) for more information.

### Change to Next.js Async Request APIs

Multiple Next.js APIs (e.g., `headers()`) are now asynchronous.
Update your usages to support the asynchronous APIs.
Review the [migration guide](https://nextjs.org/docs/app/guides/upgrading/version-15#async-request-apis-breaking-change) for more information.

```diff title="site/src/app/[visibility]/[domain]/[language]/[[...path]]/page.tsx"
+ type Params = Promise<{ path: string[]; domain: string; language: string; visibility: VisibilityParam; }>;

type PageProps = {
-   params: { path: string[]; domain: string; language: string; visibility: VisibilityParam };
+   params: Params;
};

export default async function Page({ params }: PageProps) {
setVisibilityParam(params.visibility);
-   setVisibilityParam(params.visibility);
-   const scope = { domain: params.domain, language: params.language };
+   const { visibility, domain, language } = await params;
+   setVisibilityParam(visibility);
+   const scope = { domain, language };
}
```

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
