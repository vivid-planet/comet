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

The following dependencies used to be peer dependencies of Comet.
They are no longer required.
You can remove them **if you don't use them in your project**:

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

```diff
- @PublicApi()
+ @DisableCometGuards()
```

```diff
- @DisableGlobalGuard()
+ @DisableCometGuards()
```

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

    // news-link-block-transformer.service.ts
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

`axios` used to be a peer dependency of Comet.
It's no longer required, so you can remove `axios` **if you don't use it in your project**.

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

```diff
- previewUrl = `${siteConfig.previewUrl}/page`;
+ previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
```

### @comet/admin

#### Remove the `@mui/styles` package

The legacy `@mui/styles` package was removed in favor of `@mui/material/styles`.
You must remove `@mui/styles` from your project too:

```diff
//package.json

- "@mui/styles": "^5.8.6",
```

This has multiple implications:

-   Comet Admin components can now be styled using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/)
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

<summary>Expand for details</summary>

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

#### Change the structure of `MasterMenuData`

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

#### New Content Scope Picker

The content scope controls were changed to display all available combinations in a single select. This requires a few changes:

1. Change the `values` prop of `ContentScopeProvider` to an array:

    **Before**

    ```ts
    const values: ContentScopeValues<ContentScope> = {
        domain: [
            { label: "Main", value: "main" },
            { label: "Secondary", value: "secondary" },
        ],
        language: [
            { label: "English", value: "en" },
            { label: "German", value: "de" },
        ],
    };
    ```

    **Now**

    ```ts
    const values: ContentScopeValues<ContentScope> = [
        {
            domain: { label: "Main", value: "main" },
            language: { label: "English", value: "en" },
        },
        {
            domain: { label: "Main", value: "main" },
            language: { label: "German", value: "de" },
        },
        {
            domain: { label: "Secondary", value: "secondary" },
            language: { label: "English", value: "en" },
        },
    ];
    ```

2. The `config` prop of `ContentScopeControls` has been removed.
   You can use the props `searchable`, `groupBy`, and `icon` instead.
   You may also remove the convenience wrapper defined in the application as it doesn't offer a real benefit anymore:

    ```diff
    - import { ContentScopeControls as ContentScopeControlsLibrary } from "@comet/cms-admin";

    - export const ContentScopeControls: React.FC = () => {
    -     return <ContentScopeControlsLibrary<ContentScope> config={controlsConfig} />;
    - };
    + import { ContentScopeControls } from "@comet/cms-admin";
    ```

#### New Toolbar

The Toolbar was reworked. Now there are three Toolbar components:

-   `Toolbar`
-   `StackToolbar`
-   `DataGridToolbar`

Following steps are necessary to correctly use the new Toolbar:

1. If your project has a custom `ContentScopeIndicator`, remove it

    ```diff
    - admin/src/common/ContentScopeIndicator.tsx
    ```

    Instead, the `ContentScopeIndicator` exported by `@comet/cms-admin` should be used.

2. Grid: Use the `DataGridToolbar` in `DataGrid`s

    Example:

    ```diff
    // NewsGrid.tsx

    function NewsToolbar(): React.ReactElement {
        // ...

        return (
    -       <Toolbar>
    +       <DataGridToolbar>
                // ...
    -       </Toolbar>
    +       </DataGridToolbar>
        );
    }

    // ...

    return (
        <MainContent>
            <DataGrid
                // ...
                components={{
                    Toolbar: NewsToolbar,
                }}
            />
        </MainContent>
    );
    ```

3. Page: Add a `StackToolbar` to all `StackPage`s containing a `DataGrid`:

    Example:

    ```diff
    // NewsPage.tsx

    export default function NewsPage(): JSX.Element {
        const intl = useIntl();

        return (
            <Stack topLevelTitle={intl.formatMessage({ id: "news.news", defaultMessage: "News" })}>
                <StackSwitch initialPage="grid">
                    <StackPage name="grid">
    +                   <StackToolbar scopeIndicator={<ContentScopeIndicator />} />
                        <NewsGrid />
                    </StackPage>
                    // ...
                </StackSwitch>
            </Stack>
        );
    }
    ```

4. Page: Correctly configure the `ContentScopeIndicator`

    There are three cases:

    1. The entity uses the normal `ContentScope`

        Do nothing. The `ContentScopeIndicator` uses the scope provided by `useContentScope()` by default.

    2. The entity has a custom `Scope`

        Pass the custom scope:

        ```tsx
        <ContentScopeIndicator scope={customScope} />
        ```

    3. The entity has no scope

        Mark the page as global:

        ```tsx
        <ContentScopeIndicator global />
        ```

5. Form: Remove the `EditPageLayout`

    Example:

    ```diff
    // NewsForm.tsx

    function NewsForm({ id, mode }: NewsFormProps): JSX.Element {
        // ...

        return (
    -       <EditPageLayout>
    +       <>
                // ...
    -       </EditPageLayout>
    +       </>
        );
    }
    ```

6. Form: Add a `ContentScopeIndicator` to the `Toolbar`

    **Configure the `ContentScopeIndicator` the same way as the one in the page (see step 3).**

    Example:

    ```diff
    // NewsForm.tsx

    function NewsForm({ id, mode }: NewsFormProps): JSX.Element {
        // ...

        return (
            <>
                // ...
    -           <Toolbar>
    +           <Toolbar scopeIndicator={<ContentScopeIndicator />}>
                    // ...
                </Toolbar>
                // ...
            </>
        );
    }
    ```

### @comet/admin-theme

#### `Chip` theme rework

If you use MUI's `Chip` anywhere in your project, check if the styling still looks as intended.

#### `Typography` theme rework

All variants of `Typography` were reworked.
Check if the styling still looks as intended in your application.

#### Colors

Colors in all palettes were changed. The most notable changes are

-   The grey palette (neutrals) was completely reworked. Almost all color values changed
-   The secondary palette is now grey instead of green

Check if the styling still looks as intended in your application.

### @comet/admin-color-picker

#### Prop renames and removals

<details>

<summary>Expand for details</summary>

-   `ColorPicker`: Replace `componentsProps` with `slotProps`
-   `ColorPicker`: Remove the `clearable` prop. The clear button will be shown automatically for optional fields

</details>

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

#### Prop renames and removals

<details>

<summary>Expand for details</summary>

-   `DatePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DatePickerComponentsProps` type
    -   Remove the `clearable` prop. The clear button will be shown automatically for all optional fields.

-   `DateRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateRangePickerComponentsProps` type
    -   Rename the `calendar` class-key to `dateRange`
    -   Remove the `clearable` prop. The clear button will be shown automatically for all optional fields.

-   `DateTimePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateTimePickerComponentsProps` type
    -   Replace the `formControl` class-key with two separate class-keys: `dateFormControl` and `timeFormControl`
    -   Remove the `clearable` prop. The clear button will be shown automatically for all optional fields.

-   `TimePicker`:

    -   Remove the `clearable` prop. The clear button will be shown automatically for all optional fields.

-   `TimeRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `TimeRangePickerComponentsProps` and `TimeRangePickerIndividualPickerProps` types
    -   Replace the `formControl` class-key with two separate class-keys: `startFormControl` and `endFormControl`
    -   Replace the `timePicker` class-key with two separate class-keys: `startTimePicker` and `endTimePicker`
    -   Remove the `clearable` prop. The clear button will be shown automatically for all optional fields.

</details>

## Site

### Major dependency upgrades

You must upgrade

-   Next.js to v14 (Migration Guides: [12 -> 13](https://nextjs.org/docs/pages/building-your-application/upgrading/version-13), [13 -> 14](https://nextjs.org/docs/pages/building-your-application/upgrading/version-14))
-   React to v18 (Migration Guide: [17 -> 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide))
-   Styled Components to v6 (Migration Guide: [5 -> 6](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6))

### Add a custom `InternalLinkBlock`

The `InternalLinkBlock` provided by `@comet/cms-site` is deprecated.
Instead, implement your own `InternalLinkBlock`.
This is needed for more flexibility, e.g., support for internationalized routing.

### Add `legacyBevavior` to all link block usages

All link blocks in `@comet/cms-site` now render a child `<a>` tag by default to align with the new behavior of the Next `Link` component, which is used by `InternalLinkBlock`.
For existing projects, add the `legacyBehavior` prop to all library link block usages to use the old behavior, where the `<a>` tag is defined in the application. For example:

```diff title=LinkBlock.tsx
const supportedBlocks: SupportedBlocks = {
    internal: ({ children, title, ...props }) => (
        <InternalLinkBlock
            data={props}
            title={title}
+           legacyBehavior
        >
            {children}
        </InternalLinkBlock>
    ),
    external: ({ children, title, ...props }) => (
        <ExternalLinkBlock
            data={props}
            title={title}
+           legacyBehavior
        >
            {children}
        </ExternalLinkBlock>
    ),
    /* Other link blocks */
};

export const LinkBlock = withPreview(
    ({ data, children }: LinkBlockProps) => {
        return (
            <OneOfBlock data={data} supportedBlocks={supportedBlocks}>
                {children}
            </OneOfBlock>
        );
    },
    { label: "Link" },
);
```

:::info

New projects shouldn't use the legacy behavior. Instead, add support to pass the `className` prop through to the `LinkBlock` an its child blocks. See [this PR](https://github.com/vivid-planet/comet/pull/2271) for an example.

:::

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
+  aspectRatio="16x9"
 />
```

### Switch to Next.js Preview Mode

#### Requires following changes to site:

Import `useRouter` from `next/router` (not exported from `@comet/cms-site` anymore)

```diff
- import { useRouter } from "@comet/cms-site";
+ import { useRouter } from "next/router";
```

Import `Link` from `next/link` (not exported from `@comet/cms-site` anymore)

```diff
- import { Link } from "@comet/cms-site";
+ import { Link } from "next/link";
```

Remove the preview pages (pages in `src/pages/preview/` directory which call `createGetUniversalProps` with preview parameters).

```sh
rm -rf src/pages/preview/
```

Remove `createGetUniversalProps` from the "normal" pages:

```diff
- export function createGetUniversalProps({
-     includeInvisibleBlocks = false,
-     includeInvisiblePages = false,
-     previewDamUrls = false,
- }: CreateGetUniversalPropsOptions = {}) {
-     /* ... */
- }
```

Instead, implement `getStaticProps` (Preview Mode will automatically switch to SSR). Use `previewData` from `context` to configure the GraphQL Client:

```diff
+ import { ParsedUrlQuery } from "querystring";
+ import { SitePreviewParams } from "@comet/cms-site";

  export const getStaticProps: GetStaticProps<
      PageProps,
+     ParsedUrlQuery,
+     SitePreviewParams
  > = async (
      context,
  ) => {
+     const { scope, previewData } = context.previewData ?? {
+         scope: { domain, language: context.locale ?? defaultLanguage },
+         previewData: undefined,
+     };

      const client = createGraphQLClient({
+         includeInvisiblePages: context.preview,
+         includeInvisibleBlocks: previewData?.includeInvisible,
+         previewDamUrls: context.preview,
      });

      /* ... */
  };
```

Add the `SitePreviewProvider` to `App` (typically in `src/pages/_app.page.tsx`):

```diff
function CustomApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <>
            {/* ... */}
-           <Component {...pageProps} />
+           {router.isPreview ? (
+               <SitePreviewProvider>
+                   <Component {...pageProps} />
+               </SitePreviewProvider>
+           ) : (
+               <Component {...pageProps} />
+           )}
        </>
    );
}
```

Add an API Route to enable the preview mode. Must be the same as in `siteConfig.sitePreviewApiUrl` (default: `${siteConfig.url}/api/site-preview`):

```ts
// In pages/api/site-preview.page.ts
import { legacyPagesRouterSitePreviewApiHandler } from "@comet/cms-site";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { NextApiHandler } from "next";

const SitePreviewApiHandler: NextApiHandler = async (req, res) => {
    await legacyPagesRouterSitePreviewApiHandler(req, res, createGraphQLClient());
};

export default SitePreviewApiHandler;
```

### TODO: GraphQL fetch client

// TODO ?

plenty-cougars-warn.md

### TODO: New technique for blocks to load additional data at page level

// TODO ?

selfish-dolls-beg.md

## ESLint

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
