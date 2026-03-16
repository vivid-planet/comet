---
title: Migrating from v8 to v9
sidebar_position: -9
---

# Migrating from v8 to v9

:::info AI-Assisted Migration

This migration guide is designed to be executed by an AI coding agent (e.g., Claude Code). Each section contains structured, step-by-step instructions that an agent can follow to perform the migration automatically.

**Sample prompt to get started:**

```
Migrate this project from Comet v8 to v9. Follow the migration guide at https://docs.comet-dxp.com/docs/migration-guide/migration-from-v8-to-v9 step by step. Work through each section sequentially, making the required changes and running any verification commands. Commit after each major section.
```

:::

## Root

### Update Comet dependencies

Update the `@comet/*` dependencies in the root `package.json` to version `9.0.0`:

```diff title="package.json"
{
    "devDependencies": {
-       "@comet/cli": "^8.0.0",
+       "@comet/cli": "9.0.0",
    }
}
```

Then, install the updated dependencies:

```sh
npm install
```

### Verify lint passes

```sh
npm run lint:root
```

Repeat this step, fixing all lint errors, until the lint passes.

## API

### Update Comet dependencies

Update all `@comet/*` dependencies in `api/package.json` to version `9.0.0`:

```diff title="api/package.json"
{
    "dependencies": {
-       "@comet/cms-api": "^8.0.0",
+       "@comet/cms-api": "9.0.0",
-       "@comet/mail-react": "^8.0.0",
+       "@comet/mail-react": "9.0.0",
    },
    "devDependencies": {
-       "@comet/api-generator": "^8.0.0",
+       "@comet/api-generator": "9.0.0",
-       "@comet/eslint-config": "^8.0.0",
+       "@comet/eslint-config": "9.0.0",
    }
}
```

Update any other `@comet/*` packages your project uses (e.g., `@comet/brevo-api`) to `9.0.0` as well.

Then, install the updated dependencies:

```sh
npm install
```

### API Generator: Remove the `targetDirectory` option

The `targetDirectory` option of the `@CrudGenerator` decorator has been removed.
Generated files are now always written to `${__dirname}/../generated/`, which was a commonly used default.

```diff title="api/src/products/entities/product.entity.ts"
@CrudGenerator({
-   targetDirectory: `${__dirname}/../generated/`,
    requiredPermission: ["products"],
})
export class Product extends BaseEntity {}
```

### Enable MikroORM dataloader for generated CRUD resolvers

Generated list resolvers from `@comet/api-generator` no longer inspect GraphQL selection sets to build `populate` options.
Relation loading is now expected to be handled by MikroORM's dataloader.

Enable dataloader in your MikroORM config:

```diff title="api/src/db/ormconfig.ts"
+ import { DataloaderType } from "@mikro-orm/core";

  export const ormConfig = createOrmConfig(
      defineConfig({
          // ...
+         dataloader: DataloaderType.ALL,
      }),
 );
```

Without enabling dataloader, relation fields resolved by generated resolvers can lead to significantly more SQL queries.

### Update `@EntityInfo` decorator usage

The `@EntityInfo` decorator no longer accepts a TypeScript function or a service class. Migrate to the new object-based API using dot-notation field paths.

#### Entities using an inline function:

```diff
- @EntityInfo<News>((news) => ({ name: news.title, secondaryInformation: news.slug }))
+ @EntityInfo<News>({ name: "title", secondaryInformation: "slug" })
  @Entity()
  export class News { ... }
```

If the entity has a visibility concept, move it into the `visible` field using a MikroORM `ObjectQuery`:

```diff
- @EntityInfo<News>((news) => ({ name: news.title, secondaryInformation: news.slug }))
+ @EntityInfo<News>({ name: "title", secondaryInformation: "slug", visible: { status: { $eq: NewsStatus.active } } })
  @Entity()
  export class News { ... }
```

Dot-notation is supported for nested relations and embeddables (ManyToOne/OneToOne only):

```ts
@EntityInfo<Product>({ name: "title", secondaryInformation: "manufacturer.name", visible: { status: { $eq: ProductStatus.Published } } })
```

#### Documents using a service class (e.g. `PageTreeNodeDocumentEntityInfoService`):

Remove `@EntityInfo(PageTreeNodeDocumentEntityInfoService)` from `Page`, `Link`, and any other `DocumentInterface` entities. Their entity info is now derived automatically from the `PageTreeNodeEntityInfo` SQL view — no decorator is needed.

```diff
- @EntityInfo(PageTreeNodeDocumentEntityInfoService)
  @Entity()
  @ObjectType({ implements: () => [DocumentInterface] })
  export class Page { ... }
```

Remove `PageTreeNodeDocumentEntityInfoService` from all NestJS module providers as well.

#### Entities with complex info logic (custom `EntityInfoServiceInterface` -> raw SQL string):

For cases where the object syntax is insufficient, e.g. cases where you used a custom `EntityInfoService` before, you can pass a raw `SELECT` statement instead.
The query must return the columns `name`, `secondaryInformation`, `visible`, `id`, and `entityName`:

```ts
@EntityInfo<DamFile>(`SELECT "name", "secondaryInformation", "visible", "id", 'DamFile' AS "entityName" FROM "DamFileEntityInfo"`)
```

Don't forget to remove all custom services that implemented `EntityInfoServiceInterface` as they are no longer needed:

```diff
- import { EntityInfoServiceInterface } from "@comet/cms-api";
-
- @Injectable()
- export class MyEntityInfoService implements EntityInfoServiceInterface<MyEntity> {
-     async getEntityInfo(entity: MyEntity) {
-         return { name: entity.title, secondaryInformation: entity.slug };
-     }
- }
```

### Verify lint passes

```sh
cd api
npm run lint
```

Repeat this step, fixing all lint errors, until the lint passes.

## Admin

### Update Comet and peer dependencies

Update all `@comet/*` dependencies in `admin/package.json` to version `9.0.0` and update peer dependencies:

```diff title="admin/package.json"
{
    "dependencies": {
-       "@comet/admin": "^8.0.0",
+       "@comet/admin": "9.0.0",
-       "@comet/admin-date-time": "^8.0.0",
+       "@comet/admin-date-time": "9.0.0",
-       "@comet/admin-icons": "^8.0.0",
+       "@comet/admin-icons": "9.0.0",
-       "@comet/cms-admin": "^8.0.0",
+       "@comet/cms-admin": "9.0.0",
-       "rdndmb-html5-to-touch": "^8.1.2",
+       "rdndmb-html5-to-touch": "^9.0.0",
-       "react": "^18.3.1",
-       "react-dom": "^18.3.1",
+       "react": "^19.2.0",
+       "react-dom": "^19.2.0",
-       "react-dnd-multi-backend": "^8.1.2",
+       "react-dnd-multi-backend": "^9.0.0",
-       "react-intl": "^6.8.9",
+       "react-intl": "^7.1.9",
    },
    "devDependencies": {
-       "@comet/admin-generator": "^8.0.0",
+       "@comet/admin-generator": "9.0.0",
-       "@comet/cli": "^8.0.0",
+       "@comet/cli": "9.0.0",
-       "@comet/eslint-config": "^8.0.0",
+       "@comet/eslint-config": "9.0.0",
-       "@types/react": "^18.3.23",
-       "@types/react-dom": "^18.3.7",
+       "@types/react": "^19.2.14",
+       "@types/react-dom": "^19.2.3",
    }
}
```

Update any other `@comet/*` packages your project uses (e.g., `@comet/admin-color-picker`, `@comet/admin-rte`, `@comet/brevo-admin`) to `9.0.0` as well.
Ensure that all other dependencies are compatible with React 19.

For `react-final-form`, add the following `overrides` to your `package.json`:

```diff title="admin/package.json"
{
+   "overrides": {
+        "react-final-form": {
+            "react": "^19.2.4"
+        },
+        "react-final-form-arrays": {
+            "react": "^19.2.4"
+        }
+    },
}
```

:::info Why do we need these overrides?

The latest Final Form version does include support for React 19.
However, it was rewritten to TypeScript using AI, which introduced some incompatibilities.
Since the project isn't actively maintained anymore and we're planning to switch to react-hook-form, we decided to not upgrade and override the supported React version instead.

:::

Then, install the updated dependencies:

```sh
npm install
```

### Replace `DependencyList` with `DependenciesList` or `DependentsList`

The `DependencyList` component has been replaced by two focused components:

- `DependenciesList` — displays what an entity depends on (query must return `item.dependencies`)
- `DependentsList` — displays what depends on an entity (query must return `item.dependents`)

```diff
- import { DependencyList } from "@comet/cms-admin";
+ import { DependenciesList, DependentsList } from "@comet/cms-admin";

- <DependencyList query={myDependentsQuery} variables={{ id }} />
+ <DependentsList query={myDependentsQuery} variables={{ id }} />

- <DependencyList query={myDependenciesQuery} variables={{ id }} />
+ <DependenciesList query={myDependenciesQuery} variables={{ id }} />
```

### Admin packages are now ESM-only

The admin packages now ship ESM-only builds.
This should not require any significant changes if you're already using Vite.
Review the [Starter](https://github.com/vivid-planet/comet-starter/tree/main/admin) for an example of a Vite-based admin setup.

The only required change is to update your TSConfig's `module` and `moduleResolution` options:

```diff title="admin/tsconfig.json"
{
    "compilerOptions": {
-       "module": "ESNext",
-       "moduleResolution": "Node",
+       "module": "preserve",
+       "moduleResolution": "bundler"
    }
}
```

:::info Why do we need this change?

This is necessary to support importing from Admin packages (e.g, `import { GridCellContent } from "@comet/admin"`) in the Admin Generator configuration files.

:::

### Upgrade to React 19

Execute the following codemods:

```sh
cd admin

npx codemod@latest react/19/migration-recipe
```

```sh
npx types-react-codemod@latest preset-19 ./src
```

See the official React 19 [migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) for more information.

### Replace the `variant` prop with `color` in `Tooltip`

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

### Replace `createHttpClient` with native fetch

The `createHttpClient` function has been removed. Use native fetch instead.

### Remove `clearable` prop from `Autocomplete`, `FinalFormInput`, `FinalFormNumberInput` and `FinalFormSearchTextField`

Those fields are now clearable automatically when not set to `required`, `disabled` or `readOnly`.

### Replacement of `@comet/admin-date-time`

Most components of `@comet/admin-date-time` are now deprecated and are being replaced by new components in `@comet/admin`.

#### Use the new components from `@comet/admin` (recommended)

In most cases, the new components will be a drop-in replacement for the legacy components, so you can simply replace the imports:

| Legacy component from `@comet/admin-date-time` | New component from `@comet/admin`                  |
| ---------------------------------------------- | -------------------------------------------------- |
| `DatePicker`                                   | `DatePicker`                                       |
| `DateField`                                    | `DatePickerField`                                  |
| `FinalFormDatePicker`                          | `DatePickerField` (without using `<Field />`)      |
| `DateRangePicker`                              | `DateRangePicker`                                  |
| `DateRangeField`                               | `DateRangePickerField`                             |
| `FinalFormDateRangePicker`                     | `DateRangePickerField` (without using `<Field />`) |
| `TimePicker`                                   | `TimePicker`                                       |
| `TimeField`                                    | `TimePickerField`                                  |
| `FinalFormTimePicker`                          | `TimePickerField` (without using `<Field />`)      |
| `DateTimePicker`                               | `DateTimePicker`                                   |
| `DateTimeField`                                | `DateTimePickerField`                              |
| `FinalFormDateTimePicker`                      | `DateTimePickerField` (without using `<Field />`)  |

```diff title="Example of replacing DatePicker"
-import { DatePicker } from "@comet/admin-date-time";
+import { DatePicker } from "@comet/admin";
```

```diff title="Example of replacing DateField"
-import { DateField } from "@comet/admin-date-time";
+import { DatePickerField } from "@comet/admin";
```

When using final-form, only the field-components are available for the new components. Therefore, usage of the `FinalForm*` components with `<Field />` must be updated to use the respective `*Field` directly, without using `<Field />`.

```diff title="Example of replacing FinalFormDatePicker"
-import { Field } from "@comet/admin";
-import { FinalFormDatePicker } from "@comet/admin-date-time";
+import { DatePickerField } from "@comet/admin";

export const ExampleFields = () => {
    return (
        <>
-           <Field component={FinalFormDatePicker} name="date" label="Date Picker" />
+           <DatePickerField name="date" label="Date Picker" />
        </>
    );
};
```

#### Continue using the deprecated components

The legacy components will continue to work as they did previously. The only change is that the class-names and theme component-keys are now prefixed with "Legacy".

Update any use of class-names of the component's slots:

- `CometAdminDatePicker-*` -> `CometAdminLegacyDatePicker-*`
- `CometAdminDateRangePicker-*` -> `CometAdminLegacyDateRangePicker-*`
- `CometAdminDateTimePicker-*` -> `CometAdminLegacyDateTimePicker-*`
- `CometAdminTimePicker-*` -> `CometAdminLegacyTimePicker-*`

```diff title="Example of updating the class-names"
const WrapperForStyling = styled(Box)(({ theme }) => ({
-   ".CometAdminDatePicker-calendar": {
+   ".CometAdminLegacyDatePicker-calendar": {
        backgroundColor: "magenta",
    },
}));
```

Update the component-keys when using `defaultProps` or `styleOverrides` in the theme:

- `CometAdminDatePicker` -> `CometAdminLegacyDatePicker`
- `CometAdminDateRangePicker` -> `CometAdminLegacyDateRangePicker`
- `CometAdminDateTimePicker` -> `CometAdminLegacyDateTimePicker`
- `CometAdminTimePicker` -> `CometAdminLegacyTimePicker`

```diff title="Example of updating the component-keys"
export const theme = createCometTheme({
    components: {
-       CometAdminDatePicker: {
+       CometAdminLegacyDatePicker: {
            defaultProps: {
                startAdornment: <FancyCalendarIcon />,
            },
        },
    },
});
```

#### Update usages of "Future" (now stable) components

The "Future" prefix has been removed from date/time components that are now considered stable.

**If already in use, update the imports of these components and their types:**

DatePicker:

- `Future_DatePicker` -> `DatePicker`
- `Future_DatePickerProps` -> `DatePickerProps`
- `Future_DatePickerClassKey` -> `DatePickerClassKey`
- `Future_DatePickerField` -> `DatePickerField`
- `Future_DatePickerFieldProps` -> `DatePickerFieldProps`

DateRangePicker:

- `Future_DateRangePicker` -> `DateRangePicker`
- `Future_DateRangePickerProps` -> `DateRangePickerProps`
- `Future_DateRangePickerClassKey` -> `DateRangePickerClassKey`
- `Future_DateRangePickerField` -> `DateRangePickerField`
- `Future_DateRangePickerFieldProps` -> `DateRangePickerFieldProps`

TimePicker:

- `Future_TimePicker` -> `TimePicker`
- `Future_TimePickerProps` -> `TimePickerProps`
- `Future_TimePickerClassKey` -> `TimePickerClassKey`
- `Future_TimePickerField` -> `TimePickerField`
- `Future_TimePickerFieldProps` -> `TimePickerFieldProps`

DateTimePicker:

- `Future_DateTimePicker` -> `DateTimePicker`
- `Future_DateTimePickerProps` -> `DateTimePickerProps`
- `Future_DateTimePickerClassKey` -> `DateTimePickerClassKey`
- `Future_DateTimePickerField` -> `DateTimePickerField`
- `Future_DateTimePickerFieldProps` -> `DateTimePickerFieldProps`

**If your theme is using `defaultProps` or `styleOverrides` for any of these components, update their component-keys:**

- `CometAdminFutureDatePicker` -> `CometAdminDatePicker`
- `CometAdminFutureDateRangePicker` -> `CometAdminDateRangePicker`
- `CometAdminFutureTimePicker` -> `CometAdminTimePicker`
- `CometAdminFutureDateTimePicker` -> `CometAdminDateTimePicker`

**If you are using class-names to access these components' slots, update them:**

- `CometAdminFuture_DatePicker-*` -> `CometAdminDatePicker-*`
- `CometAdminFuture_DateRangePicker-*` -> `CometAdminDateRangePicker-*`
- `CometAdminFuture_TimePicker-*` -> `CometAdminTimePicker-*`
- `CometAdminFuture_DateTimePicker-*` -> `CometAdminDateTimePicker-*`

### Verify lint passes

```sh
cd admin
npm run lint
```

Repeat this step, fixing all lint errors, until the lint passes.

## Site

### Update Comet and peer dependencies

Update all `@comet/*` dependencies in `site/package.json` to version `9.0.0` and update peer dependencies:

```diff title="site/package.json"
{
    "dependencies": {
-       "@comet/site-nextjs": "^8.0.0",
+       "@comet/site-nextjs": "9.0.0",
-       "@next/bundle-analyzer": "^14.2.30",
+       "@next/bundle-analyzer": "^16.1.6",
-       "next": "^14.2.30",
+       "next": "^16.1.6",
-       "react": "^18.3.1",
-       "react-dom": "^18.3.1",
+       "react": "^19.2.0",
+       "react-dom": "^19.2.0",
-       "react-intl": "^6.8.9",
+       "react-intl": "^7.1.9",
    },
    "devDependencies": {
-       "@comet/cli": "^8.0.0",
+       "@comet/cli": "9.0.0",
-       "@comet/eslint-config": "^8.0.0",
+       "@comet/eslint-config": "9.0.0",
-       "@types/react": "^18.3.23",
-       "@types/react-dom": "^18.3.7",
+       "@types/react": "^19.2.0",
+       "@types/react-dom": "^19.2.0",
    }
}
```

Ensure that all other dependencies are compatible with React 19 and Next.js 16.

After updating the dependencies, remove `node_modules/` and `package-lock.json` (or your lock file) before reinstalling to avoid peer dependency conflicts:

```sh
rm -rf site/node_modules site/package-lock.json
npm install
```

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

Now, execute `npx next typegen` once to generate the necessary types.

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

### Upgrade to React 19

Execute the following codemods:

```sh
cd site

npx codemod@latest react/19/migration-recipe
```

```sh
npx types-react-codemod@latest preset-19 ./src
```

See the official React 19 [migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) for more information.

### Change to Next.js Async Request APIs

Multiple Next.js APIs (e.g., `headers()`) are now asynchronous.
Update your usages to support the asynchronous APIs.
Use the new props helper types.
Review the [migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16#async-request-apis-breaking-change) for more information.

#### Examples

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

```diff title="site/src/app/[visibility]/[domain]/[language]/[[...path]]/page.tsx"
- async function fetchPageTreeNode(params: { path: string[]; domain: string; language: string }) {
+ async function fetchPageTreeNode(params: PageProps<"/[visibility]/[domain]/[language]/[[...path]]">["params"]) {
-     const siteConfig = getSiteConfigForDomain(params.domain);
+     const { domain, language, path: pathParam } = await params;
+     const siteConfig = getSiteConfigForDomain(domain);

-     const path = `/${(params.path ?? []).join("/")}`;
-     const { scope } = { scope: { domain: params.domain, language: params.language } };
+     const path = `/${(pathParam ?? []).join("/")}`;
+     const { scope } = { scope: { domain, language } };
```

```diff title="site/src/app/[visibility]/[domain]/[language]/layout.tsx"
- interface LayoutProps {
-     params: { domain: string; language: string };
- }

- export default async function Layout({ children, params: { domain, language } }: PropsWithChildren<LayoutProps>) {
+ export default async function Layout({ children, params }: LayoutProps<"/[visibility]/[domain]/[language]">) {
+   const { domain, language: languageParam } = await params;
    const siteConfig = getSiteConfigForDomain(domain);
+   let language = languageParam;
    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
```

### Rename `middleware.ts` to `proxy.ts`

```sh
mv site/src/middleware.ts site/src/proxy.ts
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

### Verify lint passes

```sh
cd site
npm run lint
```

Repeat this step, fixing all lint errors, until the lint passes.
