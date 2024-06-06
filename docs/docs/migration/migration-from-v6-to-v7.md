---
title: Migrating from v6 to v7
sidebar_position: 1
---

# Migrating from v6 to v7

First, execute `npx @comet/upgrade@latest v7` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Changes handled by @comet/upgrade</summary>

-   Disabling GraphQL field suggestions
-   Importing the types of `@comet/admin-theme` in `vendors.d.ts`
-   Replacing the Roboto font with Roboto Flex

</details>

## API

### Remove unnecessary dependencies

Remove following dependencies **if you don't use them in your project**:

-   `@aws-sdk/client-s3`
-   `@azure/storage-blob`
-   `pg-error-constants`

### Provide `strategyName` in createStaticCredentialsBasicStrategy

Make sure to use a meaningful strategy name as this name can be used to identify the user when using this strategy more than once. Do not forget to add the strategy to the App Guard.

```diff
  createStaticCredentialsBasicStrategy({
      password: "xxxxx",
+     strategyName: "system-user",
  }),
```

```diff
  {
      provide: APP_GUARD,
-     useClass: createCometAuthGuard(["static-credentials-basic", "..."]),
+     useClass: createCometAuthGuard(["system-user", "..."]),
  };
```

```diff
  UserPermissionsModule.forRootAsync({
      useFactory: (...) => ({
+         systemUsers: ["system-user"],
          ...
      }),
      ...
  }),
```

### Remove `language` field from `User`

```diff
// static-users.ts

export const staticUsers = {
    admin: {
        id: "3b09cc12-c7e6-4d16-b858-40a822f2c548",
        name: "Admin",
        email: "admin@customer.com",
-       language: "en",
    },
    // ...
} satisfies Record<string, User>;
```

### Remove `@PublicApi()` and rename `@DisableGlobalGuard()`

Replace all usages of `@PublicApi()` and `@DisableGlobalGuard()` with `@DisableCometGuards()`.
Use this occasion to check if all operations decorated with this decorator **should actually be public and don't return any confidential data**.

### Support dependency injection in `BlockData#transformToPlain`

1. Remove dynamic registration of `BlocksModule`:

    ```diff
    // In api/src/app.module.ts
    - BlocksModule.forRoot({
    -     imports: [PagesModule],
    -     useFactory: (pageTreeService: PageTreeService, filesService: FilesService, imagesService: ImagesService) => {
    -         return {
    -             transformerDependencies: {
    -                 pageTreeService,
    -                 filesService,
    -                 imagesService,
    -             },
    -         };
    -     },
    -     inject: [PageTreeService, FilesService, ImagesService],
    - }),
    + BlocksModule,
    ```

2. Pass `moduleRef` to `BlocksTransformerMiddlewareFactory` instead of `dependencies`

    ```diff
    // In api/src/app.module.ts
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
        ...
    -   useFactory: (dependencies: Record<string, unknown>) => ({
    +   useFactory: (moduleRef: ModuleRef) => ({
            ...
            buildSchemaOptions: {
    -           fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(dependencies)],
    +           fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(moduleRef)],
            },
        }),
    -   inject: [BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES],
    +   inject: [ModuleRef],
    }),
    ```

3. Remove `dependencies` from `BlockData#transformToPlain` calls:

    ```diff
    class NewsLinkBlockData {
        ...
    -   transformToPlain(dependencies: TransformDependencies, context: BlockContext)
    +   transformToPlain(context: BlockContext)
    }
    ```

4. Convert existing `BlockData#transformToPlain` calls to new technqiue.
   This is only necessary if you have blocks that load additional data in `tranformToPlain`:

    **Before**

    ```ts
    // news-link.block.ts

    class NewsLinkBlockData extends BlockData {
        @BlockField({ nullable: true })
        id?: string;

        // Poor man's dependency injection using dependencies object
        transformToPlain({ newsRepository }: { newsRepository: EntityRepository<News> }) {
            if (!this.id) {
                return {};
            }

            const news = await newsRepository.findOneOrFail(this..id);

            return {
                news: {
                    id: news.id,
                    slug: news.slug,
                },
            };
        }
    }
    ```

    **After**

    ```ts
    // news-link.block.ts
    class NewsLinkBlockData extends BlockData {
        @BlockField({ nullable: true })
        id?: string;

        transformToPlain() {
            // Return service that does the transformation
            return NewsLinkBlockTransformerService;
        }
    }

    type TransformResponse = {
        news?: {
            id: string;
            slug: string;
        };
    };

    @Injectable()
    class NewsLinkBlockTransformerService
        implements BlockTransformerServiceInterface<NewsLinkBlockData, TransformResponse>
    {
        // Use dependency injection here
        constructor(@InjectRepository(News) private readonly repository: EntityRepository<News>) {}

        async transformToPlain(block: NewsLinkBlockData, context: BlockContext) {
            if (!block.id) {
                return {};
            }

            const news = await this.repository.findOneOrFail(block.id);

            return {
                news: {
                    id: news.id,
                    slug: news.slug,
                },
            };
        }
    }
    ```

### Remove CDN config from DAM

```diff
// app.module.ts

DamModule.register({
   damConfig: {
-     filesBaseUrl: `${config.apiUrl}/dam/files`,
-     imagesBaseUrl: `${config.apiUrl}/dam/images`,
+     apiUrl: config.apiUrl,
      // ...
   }
})
```

#### How to migrate (only required if CDN is used):

Remove the following env vars from the API

```diff
//.env

- DAM_CDN_ENABLED=
- DAM_CDN_DOMAIN=
- DAM_CDN_ORIGIN_HEADER=
- DAM_DISABLE_CDN_ORIGIN_HEADER_CHECK=false
```

If you want to enable the origin check:

1. Set the following env vars for the API

    ```diff
    // .env

    + CDN_ORIGIN_CHECK_SECRET="Use value from DAM_CDN_ORIGIN_HEADER to avoid downtime"
    ```

    _environment-variables.ts_

    ```diff
    // environment-variables.ts

    + @IsString()
    + @ValidateIf(() => process.env.NODE_ENV === "production")
    + CDN_ORIGIN_CHECK_SECRET: string;
    ```

    ```
    // config.ts

    + cdn: {
    +  originCheckSecret: envVars.CDN_ORIGIN_CHECK_SECRET,
    + },
    ```

2. Add CdnGuard

    ```diff
    // main.ts

    + // if CDN is enabled, make sure all traffic is either coming from the CDN or internal sources
    + if (config.cdn.originCheckSecret) {
    +   app.useGlobalGuards(new CdnGuard({ headerName: "x-cdn-origin-check", headerValue: config.cdn.originCheckSecret }));
    + }
    ```

3. Adjust `site/server.js`

```diff
// site/server.js

- const cdnEnabled = process.env.CDN_ENABLED === "true";
- const disableCdnOriginHeaderCheck = process.env.DISABLE_CDN_ORIGIN_HEADER_CHECK === "true";
- const cdnOriginHeader = process.env.CDN_ORIGIN_HEADER;
+ const cdnOriginCheckSecret = process.env.CDN_ORIGIN_CHECK_SECRET;

// ...

- if (cdnEnabled && !disableCdnOriginHeaderCheck) {
-    const incomingCdnOriginHeader = req.headers["x-cdn-origin-check"];
-    if (cdnOriginHeader !== incomingCdnOriginHeader) {
+ if (cdnOriginCheckSecret) {
+    if (req.headers["x-cdn-origin-check"] !== cdnOriginCheckSecret) {
```

4. DNS changes might be required. `api.example.com` should point to CDN, CDN should point to internal API domain

### API Generator: Remove support for `visible` boolean, use `status` enum instead

Replace the `visible` boolean field with a `status` enum field.
Recommended enum values are (depending on the use case):

-   Published/Unpublished
-   Published/Unpublished/Archived
-   Published/Unpublished/Deleted
-   Active/Deleted
-   Active/Archived

The `update{Entity}Visibility` mutation is also removed.
Use the generic `update{Entity}` mutation instead.

## Admin

### Remove `axios` dependency

Remove `axios` **if you don't use it in your project**.

### Rearrange components in `App.tsx`

-   `ErrorDialogHandler` must be beneath `MuiThemeProvider` and `IntlProvider`
-   `CurrentUserProvider` must be beneath or parallel to `ErrorDialogHandler`

The resulting order should look something like this:

```tsx
// ...
<IntlProvider locale="en" messages={getMessages()}>
// ...
    <MuiThemeProvider theme={theme}>
    // ...
        <ErrorDialogHandler />
        <CurrentUserProvider>
        // ...
```

### Rename `previewUrl` prop of `SiteConfig`

The `previewUrl` prop of `SiteConfig` was renamed to `blockPreviewBaseUrl`.

Example:

```diff
- previewUrl = `${siteConfig.previewUrl}/page`;
+ previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
```

### @comet/admin

#### Change admin component styling method

The legacy `@mui/styles` package was removed in favor of `@mui/material/styles`.
You can remove `@mui/styles` too:

```diff
//package.json
- "@mui/styles": "^5.8.6",
```

This has multiple implications:

-   Components can now be styled using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/)
-   Individual elements (slots) of a component can now be styled using the `slotProps` and `sx` props
-   The `$` syntax in the theme's `styleOverrides` is no longer supported, see: [MUI Docs](https://mui.com/material-ui/migration/v5-style-changes/#migrate-theme-styleoverrides-to-emotion):

```diff
 const theme = createCometTheme({
     components: {
         CometAdminMyComponent: {
             styleOverrides: {
-                root: {
-                    "&$hasShadow": {
-                        boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
-                    },
-                    "& $header": {
-                        backgroundColor: "lime",
-                    },
-                },
+                hasShadow: {
+                    boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
+                },
+                header: {
+                    backgroundColor: "lime",
+                },
             },
         },
     },
 });
```

-   Overriding a component's styles using `withStyles` is no longer supported. Use the `sx` and `slotProps` props instead:

```diff
-import { withStyles } from "@mui/styles";
-
-const StyledMyComponent = withStyles({
-    root: {
-        backgroundColor: "lime",
-    },
-    header: {
-        backgroundColor: "fuchsia",
-    },
-})(MyComponent);
-
-// ...
-
-<StyledMyComponent title="Hello World" />;
+<MyComponent
+    title="Hello World"
+    sx={{
+        backgroundColor: "lime",
+    }}
+    slotProps={{
+        header: {
+            sx: {
+                backgroundColor: "fuchsia",
+            },
+        },
+    }}
+/>
```

-   The module augmentation for the `DefaultTheme` type from `@mui/styles/defaultTheme` is no longer needed and needs to be removed from the admins theme file, usually located in `admin/src/theme.ts`:

```diff
-declare module "@mui/styles/defaultTheme" {
-    // eslint-disable-next-line @typescript-eslint/no-empty-interface
-    export interface DefaultTheme extends Theme {}
-}
```

-   Some props and class keys of certain components were removed or renamed

<details>

<summary>Affected components</summary>

-   `Alert`: Remove the `message` class key (use `.MuiAlert-message` instead)
-   `AppHeaderButton`: Remove class keys `disabled` and `focusVisible` (use the `:disabled` or `:focus` selectors instead)
-   `AppHeaderButton`: Rename the `inner` class key to `content`
-   `AppHeaderDropdown`: Remove the `popoverPaper` class key
-   `AppHeaderDropdown`: Rename the `popoverRoot` class key to `popover`
-   `ClearInputButton`: Remove the `disabled` class key (use the `:disabled` selector instead)
-   `CopyToClipboardButton`: Remove `components` prop. Use `copyIcon` and `successIcon` instead
-   `CopyToClipboardButton`: Replace `componentProps` with `slotProps`
-   `FieldSet`: Replace `componentsProps` with `slotProps`
-   `FinalFormSelect`: Remove the `endAdornment` prop
-   `InputWithPopper`: Replace `componentsProps` with `slotProps`
-   `Menu`: Replace `temporaryDrawerProps`, `permanentDrawerProps`, `temporaryDrawerPaperProps` and `permanentDrawerPaperProps` props (use `slotProps` instead)
-   `Menu`: Rename `permanent` class key to `permanentDrawer` and `temporary` class key to `temporaryDrawer`
-   `MenuCollapsibleItem`: Remove the `listItem` class key
-   `MenuCollapsibleItem`: Replace `openedIcon` and `closedIcon` props with `iconMapping`
-   `MenuItem`: No longer supports props of `ListItem`. Instead supports the props of `ListItemButton`

</details>

### Change the structure of `MasterMenuData`

You must add a `type` to all items. There are four types available:

-   `route`

    ```diff
    {
    +   type: "route",
        primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
        icon: <DashboardIcon />,
        route: {
            path: "/dashboard",
            component: Dashboard,
        },
    },
    ```

-   `externalLink`

    ```diff
    {
    +   type: "externalLink",
        primary: <FormattedMessage id="menu.cometDxp" defaultMessage="COMET DXP" />,
        icon: <Snips />,
        href: "https://comet-dxp.com",
    },
    ```

-   `collapsible`

    ```diff
    {
    +   type: "collapsible",
        primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
        icon: <Data />,
    -   submenu: [
    +   items: [
            // ...
        ],
    },
    ```

-   `group` (new)

    ```diff
    {
    +  type: "group",
    +  title: <FormattedMessage id="menu.products" defaultMessage="Products" />,
    +  items: [
    +      // ...
    +  ]
    },
    ```

#### New Toolbar

// TODO

// brave-kiwis-pay.md
// curly-pillows-decide.md
// fifty-keys-sit.md
// giant-ladybugs-greet.md

#### New Content Scope Picker

// TODO

// funny-paws-dream.md
// real-roses-applaud.md

### @comet/admin-theme

#### `Chip` theme rework

If you use MUI's `Chip` anywhere in your project, check if the styling still looks as intended.
Otherwise, adjust it to your needs.

#### `Typography` theme rework

The theme of `Typography` was changed for most variants.
Check if the styling still looks as intended in your application.

#### Colors

-   Colors in all palettes were changed
-   Most notable changes:
    -   The grey palette (neutrals) were reworked
    -   The secondary palette is now grey instead of green

Check if the styling still looks as intended in your application.

### @comet/admin-color-picker

#### Prop renames and removals

-   `ColorPicker`: Replace `componentsProps` with `slotProps`

#### Remove the `clearable` prop

Remove the `clearable` prop from `ColorPicker`.
The clear button will automatically be shown for optional fields.

### @comet/admin-date-time

#### Change the value type

The value returned by `DatePicker` and `DateRangePicker` is now a `string` (previously it was a `Date`).

The code that handles values from these components needs to be adjusted.
**This may include how the values are stored in or sent to the database.**

**Required Admin Changes:**

```diff
-   const [date, setDate] = useState<Date | undefined>(new Date("2024-03-10"));
+   const [date, setDate] = useState<string | undefined>("2024-03-10");
    return <DatePicker value={date} onChange={setDate} />;
```

```diff
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
-       start: new Date("2024-03-10"),
-       end: new Date("2024-03-16"),
+       start: "2024-03-10",
+       end: "2024-03-16",
    });
    return <DateRangePicker value={dateRange} onChange={setDateRange} />;
```

#### Remove the `clearable` prop

Remove the `clearable` prop from `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker` and `TimeRangePicker`.
The clear button will automatically be shown for all optional fields.

#### Prop renames and removals

-   `DatePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DatePickerComponentsProps` type

-   `DateRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateRangePickerComponentsProps` type
    -   Rename the `calendar` class-key to `dateRange`

-   `DateTimePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateTimePickerComponentsProps` type
    -   Replace the `formControl` class-key with two separate class-keys: `dateFormControl` and `timeFormControl`

-   `TimeRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `TimeRangePickerComponentsProps` and `TimeRangePickerIndividualPickerProps` types
    -   Replace the `formControl` class-key with two separate class-keys: `startFormControl` and `endFormControl`
    -   Replace the `timePicker` class-key with two separate class-keys: `startTimePicker` and `endTimePicker`

## Site

### Major dependency upgrades

-   Next.js to v14
-   React to v18
-   Styled Components to v6

Follow the official migration guides:

Migration Guides Next.js:

-   [12 -> 13](https://nextjs.org/docs/pages/building-your-application/upgrading/version-13)
-   [13 -> 14](https://nextjs.org/docs/pages/building-your-application/upgrading/version-14)

Migration Guide React:

-   [17 -> 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)

Migration guide Styled Components:

-   [5 -> 6](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6)

### Add a custom `InternalLinkBlock`

The `InternalLinkBlock` provided by `@comet/cms-site` is deprecated.
Instead, implement your own `InternalLinkBlock` in your project.

This is needed for more flexibility, e.g., support for internationalized routing.

### Add `aspectRatio` to `PixelImageBlock` and `Image`

Previously, there was a default aspect ratio of `16x9`.
This has repeatedly led to incorrectly displayed images.

Now `aspectRatio` is required and must be added to `PixelImageBlock` and `Image`.
**Consider which aspect ratio should be used.**

Example:

```diff
<PixelImageBlock
  data={teaser}
  layout="fill"
+ aspectRatio="16x9"
/>
```

### Make relative DAM URLs work

This requires the following change (depending on which router you use):

#### Pages Router

```diff
// next.config.js

const nextConfig = {
    rewrites: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var rewrites = await require("./preBuild/build/preBuild/src/createRewrites").createRewrites();
-       return rewrites;
+       return [
+           ...rewrites,
+           {
+               source: "/dam/:path*",
+               destination: process.env.API_URL + "/dam/:path*",
+           },
+       ];
    },
    // ...
```

#### App Router

```diff
// middleware.ts

export async function middleware(request: NextRequest) {
+   if (request.nextUrl.pathname.startsWith("/dam/")) {
+       return NextResponse.rewrite(new URL(`${process.env.API_URL_INTERNAL}${request.nextUrl.pathname}`));
+   }
    // ...
```

### Switch to Next.js preview mode

#### Requires following changes to site:

-   Import `useRouter` from `next/router` (not exported from `@comet/cms-site` anymore)
-   Import `Link` from `next/link` (not exported from `@comet/cms-site` anymore)
-   Remove preview pages (pages in `src/pages/preview/` directory which call `createGetUniversalProps` with preview parameters)
-   Remove `createGetUniversalProps`
    -   Just implement `getStaticProps`/`getServerSideProps` (Preview Mode will SSR automatically)
    -   Get `previewData` from `context` and use it to configure the GraphQL Client
-   Add `SitePreviewProvider` to `App` (typically in `src/pages/_app.tsx`)
-   Provide a protected environment for the site
    -   Make sure that a Authorization-Header is present in this environment
    -   Add a Next.JS API-Route for the site preview (eg. `/api/site-preview`)
    -   Call `getValidatedSitePreviewParams()` in the API-Route (calls the API which checks the Authorization-Header with the submitted scope)
    -   Use the `path`-part of the return value to redirect to the preview

#### Requires following changes to admin:

-   The `SitesConfig` must provide a `sitePreviewApiUrl`

### TODO: GraphQL fetch client

// TODO ?

plenty-cougars-warn.md

### TODO: New technique for blocks to load additional data at page level

// TODO ?

selfish-dolls-beg.md

## ESLint

### Enforce PascalCase in enums

We now enforce PascalCase for enums.
If your project has enums that are cased differently, you should change the casing.

In some cases, changing the enum casing can be problematic.
For example, if the enum value is stored in the database.
In such cases, you can disable the rule like so

```diff
+ /* eslint-disable @typescript-eslint/naming-convention */
  export enum ExampleEnum {
      attr1 = "attr1",
  }
+ /* eslint-enable @typescript-eslint/naming-convention */
```

### @typescript-eslint/prefer-enum-initializers

It's now mandatory to initialize enums:

```diff
enum ExampleEnum {
-   One,
-   Two,
+   One = "One",
+   Two = "Two",
}
```
