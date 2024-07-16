# @comet/cms-admin

## 7.0.0-beta.5

### Minor Changes

-   569ad0463: Deprecate `SplitButton`, `FinalFormSaveSplitButton` and `SplitButtonContext` and remove all uses of these components in our libraries

    The reason is that we decided to retire the SplitButton pattern.

### Patch Changes

-   Updated dependencies [569ad0463]
    -   @comet/admin@7.0.0-beta.5
    -   @comet/admin-date-time@7.0.0-beta.5
    -   @comet/admin-icons@7.0.0-beta.5
    -   @comet/admin-rte@7.0.0-beta.5
    -   @comet/admin-theme@7.0.0-beta.5
    -   @comet/blocks-admin@7.0.0-beta.5

## 7.0.0-beta.4

### Major Changes

-   b7560e3a7: Move `YouTubeVideoBlock` to `@cms` packages

    **Migrate**

    ```diff
    - import { YouTubeVideoBlock } from "@comet/blocks-admin";
    + import { YouTubeVideoBlock } from "@comet/cms-admin";
    ```

    ```diff
    - import { YouTubeVideoBlock } from "@comet/blocks-api";
    + import { YouTubeVideoBlock } from "@comet/cms-api";
    ```

### Minor Changes

-   b7560e3a7: Add preview image to `YouTubeVideoBlock` and `DamVideoBlock`

    The `YouTubeVideoBlock` and the `DamVideoBlock` now support a preview image out of the box. For customisation the default `VideoPreviewImage` component can be overridden with the optional `renderPreviewImage` method.

    It is recommended to replace the custom implemented video blocks in the projects with the updated `YouTubeVideoBlock` and `DamVideoBlock` from the library.

### Patch Changes

-   Updated dependencies [a0bd09afa]
-   Updated dependencies [b7560e3a7]
-   Updated dependencies [170720b0c]
-   Updated dependencies [a58918893]
    -   @comet/admin@7.0.0-beta.4
    -   @comet/blocks-admin@7.0.0-beta.4
    -   @comet/admin-date-time@7.0.0-beta.4
    -   @comet/admin-icons@7.0.0-beta.4
    -   @comet/admin-rte@7.0.0-beta.4
    -   @comet/admin-theme@7.0.0-beta.4

## 7.0.0-beta.3

### Major Changes

-   06768a70f: Make icon required for top level menu and group items

    This fixes the problem, that there was no icon or text to display in the collapsed state of the menu if no icon was passed.
    Icons are required for all top level menu items and the items of groups. Groups themselves do not require an icon.

### Patch Changes

-   Updated dependencies [ce5eaede2]
    -   @comet/admin@7.0.0-beta.3
    -   @comet/admin-date-time@7.0.0-beta.3
    -   @comet/admin-icons@7.0.0-beta.3
    -   @comet/admin-rte@7.0.0-beta.3
    -   @comet/admin-theme@7.0.0-beta.3
    -   @comet/blocks-admin@7.0.0-beta.3

## 7.0.0-beta.2

### Major Changes

-   3574617ea: Remove `EditPageLayout`

    You can completely remove `EditPageLayout` from your application.
    Instead, use `MainContent` to wrap all your page content except the `Toolbar`.
    If needed, wrap `MainContent` and `Toolbar` in a fragment.

    Example:

    ```diff
    - <EditPageLayout>
    + <>
          <Toolbar>
              // ...
          </Toolbar>
    -     <div>
    +     <MainContent>
              // ...
    -     </div>
    +     </MainContent>
    - </EditPageLayout>
    + </>
    ```

### Minor Changes

-   acfcef9e4: The `documentTypes` prop of `PagesPage` now also accepts a function mapping categories to document types

    Previously, only the supported documentTypes of the current category could be passed to the `PagesPage`.
    That made it impossible to verify if a document can be moved to another category.
    If a document was moved to a category that didn't support its type, the PageTree crashed.

    If a mapping function is passed to `documentTypes`, documents can only be moved to categories that support their type.

    ```diff
    <PagesPage
    -   documentTypes={pageTreeDocumentTypes}
    +   documentTypes={(category): Record<DocumentType, DocumentInterface> => {
    +       if (category === "TopMenu") {
    +           return {
    +               Page,
    +               PredefinedPage,
    +           };
    +       }
    +
    +       return {
    +           Page,
    +           PredefinedPage,
    +           Link,
    +       };
    +   }}
        // ...
    />
    ```

-   61a43d270: Add a menu item to `PixelImageBlock`, `SvgImageBlock` and `DamVideoBlock` that opens the chosen file in the DAM

    Note: This feature only works if the `DependenciesConfig` is configured for `DamFile`:

    ```diff
    // App.tsx

    <DependenciesConfigProvider
        entityDependencyMap={{
    +       DamFile: createDamFileDependency(),
            // ...
        }}
    >
    ```

### Patch Changes

-   e106a02b2: Make the `ContentScopeIndicator` show the scope label instead of the scope value
-   Updated dependencies [2fc764e29]
-   Updated dependencies [2de81e40b]
    -   @comet/admin@7.0.0-beta.2
    -   @comet/admin-theme@7.0.0-beta.2
    -   @comet/admin-date-time@7.0.0-beta.2
    -   @comet/admin-icons@7.0.0-beta.2
    -   @comet/admin-rte@7.0.0-beta.2
    -   @comet/blocks-admin@7.0.0-beta.2

## 7.0.0-beta.1

### Major Changes

-   c3940df58: Replace `additionalMimeTypes` and `overrideAcceptedMimeTypes` in `DamConfigProvider` with `acceptedMimeTypes`

    You can now add mime types like this:

    ```tsx
    <DamConfigProvider
        value={{
            acceptedMimeTypes: [...damDefaultAcceptedMimetypes, "something-else"],
        }}
    >
        {/* ... */}
    </DamConfigProvider>
    ```

    And remove them like this:

    ```tsx
    <DamConfigProvider
        value={{
            acceptedMimeTypes: damDefaultAcceptedMimetypes.filter((mimeType) => mimeType !== "application/zip"),
        }}
    >
        {/* ... */}
    </DamConfigProvider>
    ```

    Don't forget to also remove/add the mime types in the API's `DamModule`

### Minor Changes

-   dcf3f70f4: Add `overrideAcceptedMimeTypes` configuration to DAM

    If set, only the mimetypes specified in `overrideAcceptedMimeTypes` will be accepted.

    You must configure `overrideAcceptedMimeTypes` in the API and the admin interface:

    API:

    ```diff
    // app.module.ts

    DamModule.register({
        damConfig: {
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
            // ...
        },
        // ...
    }),
    ```

    Admin:

    ```diff
    // App.tsx

    <DamConfigProvider
        value={{
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
        }}
    >
    ```

### Patch Changes

-   @comet/admin@7.0.0-beta.1
-   @comet/admin-date-time@7.0.0-beta.1
-   @comet/admin-icons@7.0.0-beta.1
-   @comet/admin-rte@7.0.0-beta.1
-   @comet/admin-theme@7.0.0-beta.1
-   @comet/blocks-admin@7.0.0-beta.1

## 7.0.0-beta.0

### Major Changes

-   f74544524: Change language field in User and CurrentUser to locale
-   0588e212c: Remove `locale`-field from `User`-object

    -   Providing the locale is not mandatory for ID-Tokens
    -   Does not have a real use case (better rely on the Accept-Language header of the browser to determine the language of the current user)

-   865f253d8: Add `@comet/admin-theme` as a peer dependency

    `@comet/cms-admin` now uses the custom `Typography` variants `list` and `listItem` defined in `@comet/admin-theme`.

-   0e6debb06: CRUD Generator: Remove `lastUpdatedAt` argument from update mutations
-   2abc096fe: Replace the `ContentScopeIndicator` with a new version intended for use in the new `Toolbar`

    The old `ContentScopeIndicator` was a purely cosmetic component. Hence, the logic for displaying the current scope had to be implemented in the project (usually in a project-internal `ContentScopeIndicator` component).

    The new `ContentScopeIndicator` has the logic for displaying the current scope built-in. Thus, you can remove your project's `ContentScopeIndicator` implementation and directly use the `ContentScopeIndicator` from this library.

    Usage:

    -   Per default, the `ContentScopeIndicator` displays the current `ContentScope`
    -   Pass a scope object via the `scope` prop if your page has a custom scope
    -   Pass the `global` prop if your page has no scope
    -   Pass `children` if you want to render completely custom content

-   c8e7a0496: Restructure `MasterMenuData`

    Items now need an explicit `type`. There are four types available:

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

-   ebf597120: Remove unused/unnecessary peer dependencies

    Some dependencies were incorrectly marked as peer dependencies.
    If you don't use them in your application, you may remove the following dependencies:

    -   Admin: `axios`
    -   API: `@aws-sdk/client-s3`, `@azure/storage-blob` and `pg-error-constants`

-   b777136f8: Rework `ContentScopeProvider` and `ContentScopeControls`

    The content scope controls were changed to display all available combinations in a single select.

    This requires a few breaking changes:

    1. The `values` props of `ContentScopeProvider` has been changed to an array:

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
        + import { ContentScopeControls } from "@comet/cms-admin";
        - import { ContentScopeControls as ContentScopeControlsLibrary } from "@comet/cms-admin";

        - export const ContentScopeControls: React.FC = () => {
        -     return <ContentScopeControlsLibrary<ContentScope> config={controlsConfig} />;
        - };
        ```

-   ae0142029: Support single host for block preview

    The content scope is passed through the iframe-bridge in the admin and accessible in the site in the IFrameBridgeProvider.
    Breaking: `previewUrl`-property of `SiteConfig` has changed to `blockPreviewBaseUrl`

-   92eae2ba9: Change the method of overriding the styling of Admin components

    -   Remove dependency on the legacy `@mui/styles` package in favor of `@mui/material/styles`.
    -   Add the ability to style components using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/).
    -   Add the ability to style individual elements (slots) of a component using the `slotProps` and `sx` props.
    -   The `# @comet/cms-admin syntax in the theme's `styleOverrides` is no longer supported, see: https://mui.com/material-ui/migration/v5-style-changes/#migrate-theme-styleoverrides-to-emotion

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

    -   Class-keys originating from MUI components have been removed from Comet Admin components, causing certain class-names and `styleOverrides` to no longer be applied.
        The components `root` class-key is not affected. Other class-keys will retain the class-names and `styleOverrides` from the underlying MUI component.
        For example, in `ClearInputAdornment` (when used with `position="end"`) the class-name `CometAdminClearInputAdornment-positionEnd` and the `styleOverrides` for `CometAdminClearInputAdornment.positionEnd` will no longer be applied.
        The component will retain the class-names `MuiInputAdornment-positionEnd`, `MuiInputAdornment-root`, and `CometAdminClearInputAdornment-root`.
        Also, the `styleOverrides` for `MuiInputAdornment.positionEnd`, `MuiInputAdornment.root`, and `CometAdminClearInputAdornment.root` will continue to be applied.

        This affects the following components:

        -   `AppHeader`
        -   `AppHeaderMenuButton`
        -   `ClearInputAdornment`
        -   `Tooltip`
        -   `CancelButton`
        -   `DeleteButton`
        -   `OkayButton`
        -   `SaveButton`
        -   `StackBackButton`
        -   `DatePicker`
        -   `DateRangePicker`
        -   `TimePicker`

    -   For more details, see MUI's migration guide: https://mui.com/material-ui/migration/v5-style-changes/#mui-styles

-   769bd72f0: Uses the Next.JS Preview mode for the site preview

    The preview is entered by navigating to an API-Route in the site, which has to be executed in a secured environment.
    In the API-Routes the current scope is checked (and possibly stored), then the client is redirected to the Preview.

    // TODO Move the following introduction to the migration guide before releasing

    Requires following changes to site:

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

    Requires following changes to admin

    -   The `SitesConfig` must provide a `sitePreviewApiUrl`

### Minor Changes

-   b777136f8: Add `ContentScopeSelect` component

    This can be used as the basis for both content-driven and data-driven applications.

    **Example**

    ```tsx
    function ContentScopeControls() {
        const [value, setValue] = useState({ domain: "main", language: "en" });

        return (
            <ContentScopeSelect
                value={value}
                onChange={(value) => {
                    setValue(value);
                }}
                options={[
                    { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                    { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                    { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                    { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
                ]}
            />
        );
    }
    ```

-   2486e8a91: Add future Admin Generator that works with configuration files
-   5c5500733: Remove "Re-login"-button from `CurrentUserProvider`

    The button is already implemented in `createErrorDialogApolloLink()`. The correct arrangement of
    the components in `App.tsx` (see migration guide) makes the double implementation needless.

-   3b1dc72d3: Adapt `Header` and `UserHeaderItem` used in `AppHeader` for mobile devices (<900px)

### Patch Changes

-   Updated dependencies [865f253d8]
-   Updated dependencies [05ce68ec0]
-   Updated dependencies [51a0861d8]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [803bc607f]
-   Updated dependencies [54f775497]
-   Updated dependencies [33ba50719]
-   Updated dependencies [73140014f]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [33ba50719]
-   Updated dependencies [e3efdfcc3]
-   Updated dependencies [02d33e230]
-   Updated dependencies [c702cc5b2]
-   Updated dependencies [ad73068f4]
-   Updated dependencies [6054fdcab]
-   Updated dependencies [535444623]
-   Updated dependencies [d0869ac82]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [47ec528a4]
-   Updated dependencies [33ba50719]
-   Updated dependencies [956111ab2]
-   Updated dependencies [f9615fbf4]
-   Updated dependencies [19eaee4ca]
-   Updated dependencies [758c65656]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [cb544bc3e]
-   Updated dependencies [04ed68cc9]
-   Updated dependencies [61b2acfb2]
-   Updated dependencies [0263a45fa]
-   Updated dependencies [4ca4830f3]
-   Updated dependencies [3397ec1b6]
-   Updated dependencies [20b2bafd8]
-   Updated dependencies [33ba50719]
-   Updated dependencies [51a0861d8]
-   Updated dependencies [9c4b7c974]
-   Updated dependencies [b5753e612]
-   Updated dependencies [2a7bc765c]
-   Updated dependencies [774977311]
-   Updated dependencies [f8114cd39]
-   Updated dependencies [b87c3c292]
-   Updated dependencies [f06f4bea6]
-   Updated dependencies [cce88d448]
-   Updated dependencies [2a7bc765c]
-   Updated dependencies [b87c3c292]
-   Updated dependencies [d2e64d1ec]
-   Updated dependencies [865f253d8]
-   Updated dependencies [f8114cd39]
-   Updated dependencies [241249bd4]
-   Updated dependencies [be4e6392d]
-   Updated dependencies [a53545438]
-   Updated dependencies [1a1d83156]
-   Updated dependencies [a2f278bbd]
-   Updated dependencies [66330e4e6]
-   Updated dependencies [b0249e3bc]
-   Updated dependencies [92eae2ba9]
-   Updated dependencies [33ba50719]
    -   @comet/admin@7.0.0-beta.0
    -   @comet/admin-theme@7.0.0-beta.0
    -   @comet/admin-date-time@7.0.0-beta.0
    -   @comet/admin-rte@7.0.0-beta.0
    -   @comet/blocks-admin@7.0.0-beta.0
    -   @comet/admin-icons@7.0.0-beta.0

## 6.15.1

### Patch Changes

-   @comet/admin@6.15.1
-   @comet/admin-date-time@6.15.1
-   @comet/admin-icons@6.15.1
-   @comet/admin-rte@6.15.1
-   @comet/admin-theme@6.15.1
-   @comet/blocks-admin@6.15.1

## 6.15.0

### Minor Changes

-   cdc861cb7: Add `buttonChildren` and `children` props to `UserHeaderItem`

    This increases the flexibility of the `UserHeaderItem` component by allowing the `AppHeaderDropdown` label to be passed via `buttonChildren`. More buttons or other list items in the dropdown can be passed via `children`.

    **Example:**

    ```tsx
    <UserHeaderItem buttonChildren="Some custom label">
        <Button variant="contained">Some custom button</Button>
        <Button>Some custom button 2</Button>
    </UserHeaderItem>
    ```

### Patch Changes

-   0654f7bce: Handle unauthorized and unauthenticated correctly in error dialog

    The error dialog now presents screens according to the current state. Required to work in all conditions:

    -   `CurrentUserProvider` must be beneath `MuiThemeProvider` and `IntlProvider` and above `RouterBrowserRouter`
    -   `ErrorDialogHandler` must be parallel to `CurrentUserProvider`

-   Updated dependencies [406027806]
-   Updated dependencies [0654f7bce]
-   Updated dependencies [ec7fb9ff2]
    -   @comet/admin-icons@6.15.0
    -   @comet/admin@6.15.0
    -   @comet/blocks-admin@6.15.0
    -   @comet/admin-date-time@6.15.0
    -   @comet/admin-rte@6.15.0
    -   @comet/admin-theme@6.15.0

## 6.14.1

### Patch Changes

-   @comet/admin@6.14.1
-   @comet/admin-date-time@6.14.1
-   @comet/admin-icons@6.14.1
-   @comet/admin-rte@6.14.1
-   @comet/admin-theme@6.14.1
-   @comet/blocks-admin@6.14.1

## 6.14.0

### Minor Changes

-   73dfb61c9: Add `PhoneLinkBlock` and `EmailLinkBlock`
-   9055ff71a: Remove label from `DamVideoBlock` file field

    This was done to streamline it with the `DamImageBlock`.

-   dddb03d1b: Add capability to generate alt texts and titles for images in DAM

    You can find instructions for adding this feature to your project [in the docs](https://docs.comet-dxp.com/docs/content-generation/).

-   acfcef9e4: The `documentTypes` prop of `PagesPage` now also accepts a function mapping categories to document types

    Previously, only the supported documentTypes of the current category could be passed to the `PagesPage`.
    That made it impossible to verify if a document can be moved to another category.
    If a document was moved to a category that didn't support its type, the PageTree crashed.

    If a mapping function is passed to `documentTypes`, documents can only be moved to categories that support their type.

    ```diff
    <PagesPage
    -   documentTypes={pageTreeDocumentTypes}
    +   documentTypes={(category): Record<DocumentType, DocumentInterface> => {
    +       if (category === "TopMenu") {
    +           return {
    +               Page,
    +               PredefinedPage,
    +           };
    +       }
    +
    +       return {
    +           Page,
    +           PredefinedPage,
    +           Link,
    +       };
    +   }}
        // ...
    />
    ```

-   61a43d270: Add a menu item to `PixelImageBlock`, `SvgImageBlock` and `DamVideoBlock` that opens the chosen file in the DAM

    Note: This feature only works if the `DependenciesConfig` is configured for `DamFile`:

    ```diff
    // App.tsx

    <DependenciesConfigProvider
        entityDependencyMap={{
    +       DamFile: createDamFileDependency(),
            // ...
        }}
    >
    ```

### Patch Changes

-   Updated dependencies [2fc764e29]
-   Updated dependencies [2de81e40b]
-   Updated dependencies [efccc42a3]
-   Updated dependencies [012a768ee]
    -   @comet/admin@6.14.0
    -   @comet/admin-theme@6.14.0
    -   @comet/admin-icons@6.14.0
    -   @comet/admin-date-time@6.14.0
    -   @comet/admin-rte@6.14.0
    -   @comet/blocks-admin@6.14.0

## 6.13.0

### Minor Changes

-   c51b250ca: Add loading spinner to `IFrameViewer`

    This feature was added to inform users that the iframe is loading. It is particularly useful when loading takes a long time due to a slow network connection or a large amount of content or data. The feedback remains visible until the iframe is fully loaded and the `onLoad` event is triggered.

-   dcf3f70f4: Add `overrideAcceptedMimeTypes` configuration to DAM

    If set, only the mimetypes specified in `overrideAcceptedMimeTypes` will be accepted.

    You must configure `overrideAcceptedMimeTypes` in the API and the admin interface:

    API:

    ```diff
    // app.module.ts

    DamModule.register({
        damConfig: {
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
            // ...
        },
        // ...
    }),
    ```

    Admin:

    ```diff
    // App.tsx

    <DamConfigProvider
        value={{
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
        }}
    >
    ```

### Patch Changes

-   aee7ae4a2: Use the same logic for checking the user's content scope in Admin as it is used in the API.
-   Updated dependencies [5e25348bb]
-   Updated dependencies [796e83206]
    -   @comet/admin@6.13.0
    -   @comet/admin-rte@6.13.0
    -   @comet/admin-date-time@6.13.0
    -   @comet/admin-icons@6.13.0
    -   @comet/admin-theme@6.13.0
    -   @comet/blocks-admin@6.13.0

## 6.12.0

### Minor Changes

-   3ee8c7a33: Add a `DamFileDownloadLinkBlock` that can be used to download a file or open it in a new tab

    Also, add new `/dam/files/download/:hash/:fileId/:filename` endpoint for downloading assets.

### Patch Changes

-   Updated dependencies [dc7eaeccb]
-   Updated dependencies [16ffa7be9]
-   Updated dependencies [c06c6f1e9]
    -   @comet/admin-rte@6.12.0
    -   @comet/admin@6.12.0
    -   @comet/admin-theme@6.12.0
    -   @comet/admin-date-time@6.12.0
    -   @comet/admin-icons@6.12.0
    -   @comet/blocks-admin@6.12.0

## 6.11.0

### Minor Changes

-   e10753b65: Allow disabling the "Open preview" button in the `PageTree` for certain document types

    The "Open preview" button is shown for all document types in the `PageTree`.
    But some document types (e.g., links) don't have a preview.
    Clicking on the preview button leads to an error page.

    Now, it's possible to disable the button by setting `hasNoSitePreview` for the document:

    ```diff
    export const Link: DocumentInterface<Pick<GQLLink, "content">, GQLLinkInput> = {
        // ...
    +   hasNoSitePreview: true,
    };
    ```

-   fdf9fa7cb: Automatic Redirects are now set to false if the page is unpublished or archived

### Patch Changes

-   815ba51e7: Fix link target validation in `ExternalLinkBlock`

    Previously, two different validation checks were used.
    This resulted in an error when saving an invalid link target but no error message was shown.

-   Updated dependencies [8e3dec523]
    -   @comet/admin@6.11.0
    -   @comet/admin-date-time@6.11.0
    -   @comet/admin-icons@6.11.0
    -   @comet/admin-rte@6.11.0
    -   @comet/admin-theme@6.11.0
    -   @comet/blocks-admin@6.11.0

## 6.10.0

### Minor Changes

-   f89af8bb2: Add `disableHideInMenu` option to `createEditPageNode` to hide the "Hide in menu" checkbox
-   d4a269e1e: Add `filterByFragment` to replace graphql-anywhere's `filter`

    [graphql-anywhere](https://www.npmjs.com/package/graphql-anywhere) is no longer maintained.
    However, its `filter` utility is useful for filtering data by a GraphQL document, e.g., a fragment.
    Therefore, the function was copied to `@comet/admin`.
    To migrate, replace all `filter` calls with `filterByFragment`:

    ```diff
    - import { filter } from "graphql-anywhere";
    + import { filterByFragment } from "@comet/admin";

    const initialValues: Partial<FormValues> = data?.product
        ? {
    -       ...filter<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
    +       ...filterByFragment<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
            price: String(data.product.price),
        }
        : {};
    ```

    You can then uninstall the `graphql-anywhere` package:

    ```bash
    # In admin/
    npm uninstall graphql-anywhere
    ```

-   f528bc340: CronJobModule: Show logs for job run

### Patch Changes

-   d340cabc2: DAM: Fix the duplicate name check when updating a file

    Previously, there were two bugs:

    1. In the `EditFile` form, the `folderId` wasn't passed to the mutation
    2. In `FilesService#updateByEntity`, the duplicate check was always done against the root folder if no `folderId` was passed

    This caused an error when saving a file in any folder if there was another file with the same name in the root folder.
    And it was theoretically possible to create two files with the same name in one folder (though this was still prevented by admin-side validation).

-   Updated dependencies [a8a098a24]
-   Updated dependencies [d4a269e1e]
-   Updated dependencies [52130afba]
-   Updated dependencies [e938254bf]
    -   @comet/admin@6.10.0
    -   @comet/admin-date-time@6.10.0
    -   @comet/admin-icons@6.10.0
    -   @comet/admin-rte@6.10.0
    -   @comet/admin-theme@6.10.0
    -   @comet/blocks-admin@6.10.0

## 6.9.0

### Minor Changes

-   e85837a17: Loosen peer dependency on `react-intl` to allow using v6

### Patch Changes

-   Updated dependencies [9ff9d66c6]
-   Updated dependencies [8fb8b209a]
-   Updated dependencies [e85837a17]
    -   @comet/admin@6.9.0
    -   @comet/admin-rte@6.9.0
    -   @comet/admin-date-time@6.9.0
    -   @comet/blocks-admin@6.9.0
    -   @comet/admin-icons@6.9.0
    -   @comet/admin-theme@6.9.0

## 6.8.0

### Patch Changes

-   c1ca9c335: Don't remove references to `DamFile` from blocks when copying a document from one scope to another if DAM scoping is not enabled
-   Updated dependencies [90c6f192e]
-   Updated dependencies [90c6f192e]
    -   @comet/blocks-admin@6.8.0
    -   @comet/admin@6.8.0
    -   @comet/admin-date-time@6.8.0
    -   @comet/admin-icons@6.8.0
    -   @comet/admin-rte@6.8.0
    -   @comet/admin-theme@6.8.0

## 6.7.0

### Patch Changes

-   2db3bc855: Fix `CurrentUserInterface` type

    Add missing `id` field, make `name`, `email`, and `language` required.

    -   @comet/admin@6.7.0
    -   @comet/admin-date-time@6.7.0
    -   @comet/admin-icons@6.7.0
    -   @comet/admin-rte@6.7.0
    -   @comet/admin-theme@6.7.0
    -   @comet/blocks-admin@6.7.0

## 6.6.2

### Patch Changes

-   0758d2339: Hide the "Dependents" tab in the DAM if the `DependenciesConfigProvider` is not configured

    Previously, the tab was always shown, even if the feature wasn't configured. Though it didn't cause an error, the tab showed no valuable information.

    Now, we hide the tab if no configuration is passed via the `DependenciesConfigProvider`.

    -   @comet/admin@6.6.2
    -   @comet/admin-date-time@6.6.2
    -   @comet/admin-icons@6.6.2
    -   @comet/admin-rte@6.6.2
    -   @comet/admin-theme@6.6.2
    -   @comet/blocks-admin@6.6.2

## 6.6.1

### Patch Changes

-   @comet/admin@6.6.1
-   @comet/admin-date-time@6.6.1
-   @comet/admin-icons@6.6.1
-   @comet/admin-rte@6.6.1
-   @comet/admin-theme@6.6.1
-   @comet/blocks-admin@6.6.1

## 6.6.0

### Patch Changes

-   c76666503: Make headers in `includeInvisibleContentContext` overridable in query

    You can now override the headers `x-include-invisible-content` and `x-preview-dam-urls` in your query like this:

    ```tsx
    const { loading, data, error } = useQuery(exampleQuery, {
        // ...
        context: {
            headers: {
                "x-include-invisible-content": [],
                "x-preview-dam-urls": 0,
            },
        },
    });
    ```

-   Updated dependencies [95b97d768]
-   Updated dependencies [a65679ba3]
-   Updated dependencies [6b04ac9a4]
    -   @comet/admin@6.6.0
    -   @comet/blocks-admin@6.6.0
    -   @comet/admin-date-time@6.6.0
    -   @comet/admin-icons@6.6.0
    -   @comet/admin-rte@6.6.0
    -   @comet/admin-theme@6.6.0

## 6.5.0

### Minor Changes

-   2f64daa9b: Add `title` field to link block

    Perform the following steps to use it in an application:

    1. API: Use the new `createLinkBlock` factory to create the LinkBlock:

        ```ts
        import { createLinkBlock } from "@comet/cms-api";

        // ...

        const LinkBlock = createLinkBlock({
            supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
        });
        ```

    2. Site: Pass the `title` prop to LinkBlock's child blocks:

    ```diff
    const supportedBlocks: SupportedBlocks = {
    -   internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
    +   internal: ({ children, title, ...props }) => <InternalLinkBlock data={props} title={title}>{children}</InternalLinkBlock>,
        // ...
    };
    ```

### Patch Changes

-   Updated dependencies [2f64daa9b]
-   Updated dependencies [6cb2f9046]
    -   @comet/blocks-admin@6.5.0
    -   @comet/admin@6.5.0
    -   @comet/admin-date-time@6.5.0
    -   @comet/admin-icons@6.5.0
    -   @comet/admin-rte@6.5.0
    -   @comet/admin-theme@6.5.0

## 6.4.0

### Minor Changes

-   2d1b9467a: createImageLinkBlock: Allow overriding name

    This allows using two different `ImageLink` blocks in one application.

    Perform the following steps to override the name:

    1. API: Add the name as second argument in the `createImageLinkBlock` factory:

        ```diff
        const MyCustomImageLinkBlock = createImageLinkBlock(
            { link: InternalLinkBlock },
        +   "MyCustomImageLink"
        );
        ```

    2. Admin: Set the `name` option in the `createImageLinkBlock` factory:

        ```diff
        const MyCustomImageLinkBlock = createImageLinkBlock({
            link: InternalLinkBlock,
        +   name: "MyCustomImageLink"
        });
        ```

-   322da3831: Add `DependencyInterface`

    The `DependencyInterface` must be implemented for entities to be displayed correctly in the `DependencyList`.
    The implementation must then be passed to the `DependenciesConfigProvider`.

    You can use one of the helper methods to implement the `resolvePath()` method required by `DependencyInterface`:

    -   `createDocumentDependencyMethods()` for documents
    -   `createDependencyMethods()` for all other entities

    You can find more information in [the docs](https://docs.comet-dxp.com/docs/dependencies/).

-   322da3831: Add `DependencyList` that can be used to display the dependencies of an entity in the admin

    The `DependencyList` is intended to be used in `Tabs` (as done in the DAM).

### Patch Changes

-   f6c972e59: Correctly evaluate the `language`-field of the `CurrentUser`-object
-   811903e60: Disable the content translation feature for input fields where it doesn't make sense
-   0efae68ff: Prevent XSS attacks in `isLinkTarget()` validator
-   Updated dependencies [30d9e0dee]
-   Updated dependencies [811903e60]
-   Updated dependencies [8ce21f34b]
-   Updated dependencies [322da3831]
-   Updated dependencies [811903e60]
-   Updated dependencies [887365c76]
    -   @comet/blocks-admin@6.4.0
    -   @comet/admin@6.4.0
    -   @comet/admin-date-time@6.4.0
    -   @comet/admin-icons@6.4.0
    -   @comet/admin-rte@6.4.0
    -   @comet/admin-theme@6.4.0

## 6.3.0

### Minor Changes

-   80e6fde4: Show DAM import source in grid

    To show the "Source" column in the DAM's data grid, provide `importSources` in `DamConfigProvider`:

    ```tsx
    <DamConfigProvider
        value={{
            ...
            importSources: {
                unsplash: {
                    label: <FormattedMessage id="dam.importSource.unsplash.label" defaultMessage="Unsplash" />,
                },
            },
        }}
    >
        ...
    </DamConfigProvider>
    ```

### Patch Changes

-   @comet/admin@6.3.0
-   @comet/admin-date-time@6.3.0
-   @comet/admin-icons@6.3.0
-   @comet/admin-rte@6.3.0
-   @comet/admin-theme@6.3.0
-   @comet/blocks-admin@6.3.0

## 6.2.1

### Patch Changes

-   @comet/admin@6.2.1
-   @comet/admin-date-time@6.2.1
-   @comet/admin-icons@6.2.1
-   @comet/admin-rte@6.2.1
-   @comet/admin-theme@6.2.1
-   @comet/blocks-admin@6.2.1

## 6.2.0

### Minor Changes

-   75865caa: Deprecate `isHref` validator, `IsHref` decorator and `IsHrefConstraint` class.

    New versions `isLinkTarget`, `IsLinkTarget` and `IsLinkTargetConstraint` are added as replacement.

### Patch Changes

-   ad153c99: Add the `x-preview-dam-urls` header to our axios client

    Now the axios client always requests preview DAM urls just like the GraphQL client.

-   5dfe4839: Prevent the document editor from losing its state when (re)gaining focus

    In v6.1.0 a loading indicator was added to the document editor (in `PagesPage`).
    This had an unwanted side effect: Focusing the edit page automatically causes a GraphQL request to check for a newer version of the document. This request also caused the loading indicator to render, thus unmounting the editor (`EditComponent`). Consequently, the local state of the editor was lost.

    -   @comet/admin@6.2.0
    -   @comet/admin-date-time@6.2.0
    -   @comet/admin-icons@6.2.0
    -   @comet/admin-rte@6.2.0
    -   @comet/admin-theme@6.2.0
    -   @comet/blocks-admin@6.2.0

## 6.1.0

### Patch Changes

-   7ea5f61f: Use `useCurrentUser` hook where possible
-   693cbdb4: Add loading state for edit `StackPage` in `PagesPage`

    Prevents flash of "Document not found" error message when reloading the page editor

-   Updated dependencies [dcfa03ca]
-   Updated dependencies [08e0da09]
-   Updated dependencies [b35bb8d1]
-   Updated dependencies [f1fc9e20]
-   Updated dependencies [8eb13750]
-   Updated dependencies [a4fac913]
    -   @comet/admin@6.1.0
    -   @comet/admin-icons@6.1.0
    -   @comet/admin-rte@6.1.0
    -   @comet/admin-theme@6.1.0
    -   @comet/admin-date-time@6.1.0
    -   @comet/blocks-admin@6.1.0

## 6.0.0

### Major Changes

-   d20f59c0: Enhance CronJob module

    -   Show latest job run on `CronJobsPage`
    -   Add option to manually trigger cron jobs to `CronJobsPage`
    -   Add subpage to `CronJobsPage` that shows all job runs

    Warning: Only include this module if all your users should be able to trigger cron jobs manually or you have sufficient access control in place.

    Includes the following breaking changes:

    -   Rename `JobStatus` to `KubernetesJobStatus` to avoid naming conflicts
    -   Rename `BuildRuntime` to `JobRuntime`

-   d86d5a90: Make sites config generic

    The sites config was previously assumed to be `Record<string, SiteConfg>`.
    However, as the sites config is solely used in application code, it could be of any shape.
    Therefore, the `SitesConfigProvider` and `useSitesConfig` are made generic.
    The following changes have to be made in the application:

    1.  Define the type of your sites config

        Preferably this should be done in `config.ts`:

        ```diff
        export function createConfig() {
            // ...

            return {
                ...cometConfig,
                apiUrl: environmentVariables.API_URL,
                adminUrl: environmentVariables.ADMIN_URL,
        +       sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
            };
        }

        + export type SitesConfig = Record<string, SiteConfig>;
        ```

    2.  Use the type when using `useSitesConfig`

        ```diff
        - const sitesConfig = useSitesConfig();
        + const sitesConfig = useSitesConfig<SitesConfig>();
        ```

    3.  Optional: Remove type annotation from `ContentScopeProvider#resolveSiteConfigForScope` (as it's now inferred)

        ```diff
        - resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
        + resolveSiteConfigForScope: (configs, scope: ContentScope) => configs[scope.domain],
        ```

### Minor Changes

-   0f814c5e: Add `MasterMenu` and `MasterMenuRoutes` components which both take a single data structure to define menu and routes.

### Patch Changes

-   Updated dependencies [921f6378]
-   Updated dependencies [76e50aa8]
-   Updated dependencies [298b63b7]
-   Updated dependencies [803f5045]
-   Updated dependencies [a525766c]
-   Updated dependencies [0d768540]
-   Updated dependencies [62779124]
    -   @comet/admin@6.0.0
    -   @comet/admin-icons@6.0.0
    -   @comet/admin-rte@6.0.0
    -   @comet/admin-date-time@6.0.0
    -   @comet/blocks-admin@6.0.0
    -   @comet/admin-theme@6.0.0

## 5.6.0

### Minor Changes

-   fe26a6e6: Show an error message when trying to edit a non-existing document and when trying to edit an archived document
-   3ee4ce09: Return newly uploaded items from `useDamFileUpload#uploadFiles`

### Patch Changes

-   Updated dependencies [fb6c8063]
-   Updated dependencies [76f85abe]
    -   @comet/admin-theme@5.6.0
    -   @comet/blocks-admin@5.6.0
    -   @comet/admin@5.6.0
    -   @comet/admin-date-time@5.6.0
    -   @comet/admin-icons@5.6.0
    -   @comet/admin-rte@5.6.0

## 5.5.0

### Patch Changes

-   1b37b1f6: Show `additionalToolbarItems` in `ChooseFileDialog`

    The `additionalToolbarItems` were only shown inside the `DamPage`, but not in the `ChooseFileDialog`.
    To fix this, use the `additionalToolbarItems` option in `DamConfigProvider`.
    The `additionalToolbarItems` prop of `DamPage` has been deprecated in favor of this option.

    **Previously:**

    ```tsx
    <DamPage
        // ...
        additionalToolbarItems={<ImportFromExternalDam />}
    />
    ```

    **Now:**

    ```tsx
    <DamConfigProvider
        value={{
            // ...
            additionalToolbarItems: <ImportFromExternalDam />,
        }}
    >
        {/*...*/}
    </DamConfigProvider>
    ```

-   85aa962c: Set unhandled dependencies to `undefined` when copying documents to another scope

    This prevents leaks between scopes. In practice, this mostly concerns links to documents that don't exist in the target scope.

    **Example:**

    -   Page A links to Page B
    -   Page A is copied from Scope A to Scope B
    -   Link to Page B is removed from Page A by replacing the `id` with `undefined` (since Page B doesn't exist in Scope B)

    **Note:** The link is only retained if both pages are copied in the same operation.

-   c4639be5: Clip crop values when cropping an image in the DAM or `PixelImageBlock`

    Previously, negative values could occur, causing the image proxy to fail on delivery.

    -   @comet/admin@5.5.0
    -   @comet/admin-date-time@5.5.0
    -   @comet/admin-icons@5.5.0
    -   @comet/admin-rte@5.5.0
    -   @comet/admin-theme@5.5.0
    -   @comet/blocks-admin@5.5.0

## 5.4.0

### Minor Changes

-   e146d8bb: Support the import of files from external DAMs

    To connect an external DAM, implement a component with the necessary logic (asset picker, upload functionality, ...). Pass this component to the `DamPage` via the `additionalToolbarItems` prop.

    ```tsx
    <DamPage
        // ...
        additionalToolbarItems={<ImportFromExternalDam />}
    />
    ```

    You can find an [example](demo/admin/src/dam/ImportFromUnsplash.tsx) in the demo project.

-   51d6c2b9: Move soft-hyphen functionality to `@comet/admin-rte`

    This allows using the soft-hyphen functionality in plain RTEs, and not only in `RichTextBlock`

    ```tsx
    const [useRteApi] = makeRteApi();

    export default function MyRte() {
        const { editorState, setEditorState } = useRteApi();
        return (
            <Rte
                value={editorState}
                onChange={setEditorState}
                options={{
                    supports: [
                        // Soft Hyphen
                        "soft-hyphen",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

-   dcaf750d: Make all DAM license fields optional if `LicenseType` is `ROYALTY_FREE` even if `requireLicense` is true in `DamConfig`

### Patch Changes

-   087cb01d: Enable copying documents from one `PageTree` category to another (e.g. from "Main navigation" to "Top menu" in Demo)
-   Updated dependencies [ba800163]
-   Updated dependencies [981bf48c]
-   Updated dependencies [60a18392]
-   Updated dependencies [51d6c2b9]
    -   @comet/admin@5.4.0
    -   @comet/admin-rte@5.4.0
    -   @comet/admin-date-time@5.4.0
    -   @comet/admin-icons@5.4.0
    -   @comet/admin-theme@5.4.0
    -   @comet/blocks-admin@5.4.0

## 5.3.0

### Patch Changes

-   0fdf4eaf: Always use the `/preview` file URLs in the admin application

    This is achieved by setting the `x-preview-dam-urls` in the `includeInvisibleContentContext`.

    This fixes a page copy bug where all files were downloaded and uploaded again, even when copying within the same environment.

-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [a677a162]
-   Updated dependencies [60cc1b2a]
-   Updated dependencies [5435b278]
-   Updated dependencies [a2273887]
    -   @comet/admin-icons@5.3.0
    -   @comet/admin@5.3.0
    -   @comet/blocks-admin@5.3.0
    -   @comet/admin-date-time@5.3.0
    -   @comet/admin-rte@5.3.0
    -   @comet/admin-theme@5.3.0

## 5.2.0

### Minor Changes

-   0bed4e7c: Improve the `SaveConflictDialog`

    -   extend the text in the dialog to explain
        -   what happened
        -   what the next steps are
        -   what can be done to avoid conflicts
    -   make the button labels more precise
    -   once the save dialog is closed
        -   stop polling
        -   mark the save button red and with an error icon

-   0bed4e7c: `useSaveConflict()`, `useSaveConflictQuery()` and `useFormSaveConflict()` now return a `hasConflict` prop

    If `hasConflict` is true, a save conflict has been detected.
    You should pass `hasConflict` on to `SaveButton`, `FinalFormSaveButton` or `FinalFormSaveSplitButton`. The button will then display a "conflict" state.

-   0bed4e7c: Admin Generator: In the generated form, the `hasConflict` prop is passed from the `useFormSaveConflict()` hook to the `FinalFormSaveSplitButton`
-   6fda5a53: CRUD Generator: Change the file ending of the private sibling GraphQL files from `.gql.tsx` to `.gql.ts`

    The GraphQL files do not contain JSX.
    Regenerate the files to apply this change to a project.

### Patch Changes

-   Updated dependencies [25daac07]
-   Updated dependencies [0bed4e7c]
-   Updated dependencies [9fc7d474]
-   Updated dependencies [3702bb23]
-   Updated dependencies [824ea66a]
    -   @comet/admin@5.2.0
    -   @comet/admin-icons@5.2.0
    -   @comet/blocks-admin@5.2.0
    -   @comet/admin-date-time@5.2.0
    -   @comet/admin-rte@5.2.0
    -   @comet/admin-theme@5.2.0

## 5.1.0

### Patch Changes

-   e1d3f007: Prevent false positive save conflicts while editing documents (e.g. `Page`):

    -   Stop checking for conflicts while saving is in progress
    -   Ensure that all "CheckForChanges" polls are cleared

-   6d69dfac: Fix issue in PixelImageBlock that caused the preview URLs for files without a file extension in their filename to be invalid
-   21c30931: Improved the EditPageNode dialog ("Page Properties" dialog):

    -   Execute the asynchronous slug validation less often (increased the debounce wait time from 200ms to 500ms)
    -   Cache the slug validation results. Evict the cache on the initial render of the dialog

-   Updated dependencies [21c30931]
-   Updated dependencies [93b3d971]
-   Updated dependencies [e33cd652]
    -   @comet/admin@5.1.0
    -   @comet/admin-date-time@5.1.0
    -   @comet/admin-icons@5.1.0
    -   @comet/admin-rte@5.1.0
    -   @comet/admin-theme@5.1.0
    -   @comet/blocks-admin@5.1.0

## 5.0.0

### Major Changes

-   9d3e8555: Add scoping to the DAM

    The DAM scoping can be enabled optionally. You can still use the DAM without scoping.

    To enable DAM scoping, you must

    In the API:

    -   Create a DAM folder entity using `createFolderEntity({ Scope: DamScope });`
    -   Create a DAM file entity using `createFileEntity({ Scope: DamScope, Folder: DamFolder });`
    -   Pass the `Scope` DTO and the `File` and `Folder` entities when intializing the `DamModule`

    In the Admin:

    -   Set `scopeParts` in the `DamConfigProvider` (e.g. `<DamConfigProvider value={{ scopeParts: ["domain"] }}>`)
    -   Render the content scope indicator in the `DamPage`
        ```tsx
        <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />} />
        ```

    You can access the current DAM scope in the Admin using the `useDamScope()` hook.

    See the [Demo project](https://github.com/vivid-planet/comet/pull/976) for an example on how to enable DAM scoping.

-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another

    The copy process was reworked:

    -   The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
    -   The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method
    -   `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

    `dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

    You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents.

-   c3f96d7d: Don't remember the last folder or file the user opened in the DAM. The `ChooseFileDialog` still remembers the last folder opened.

### Minor Changes

-   168380d9: Add Admin CRUD Generator that creates a simple CRUD admin view for an entity

    It automatically generates an admin page, grid and form based on the GraphQL schema definition of an object type.
    It's meant to be used together with the existing API CRUD Generator.
    Go through [the commits of this PR](https://github.com/vivid-planet/comet/pull/1294/files) for a step-by-step example of how to use the API and Admin Generators.

-   8ed96981: Support copy/pasting DAM files across server instances by downloading the copied file
-   adb5bc34: Add `queryUpdatedAt()` helper that can be used to check conflicts without having to write an additional query
-   6b9787e6: It's now possible to opt-out of creating a redirect when changing the slug of a page. Previously, a redirect was always created.
-   e6b8ec60: Show a bigger version of an image when hovering over an image thumbnail in the DAM and `ChooseFileDialog`
-   5bae9ab3: Show `LinearProgress` instead of `CircularProgress` when polling after initially loading the PageTree
-   47a7272c: Add `requireLicense` option to `DamConfig` to allow making DAM license fields required (when updating a file)
-   e26bd900: Add various UI/UX improvements to the DAM

    -   Replace underlying `Table` with `DataGrid`
    -   Add paging to improve performance
    -   Add a dialog to move files to another folder (instead of drag and drop)
    -   Highlight newly uploaded files
    -   Add a new footer to execute bulk actions
    -   Add a "More Actions" dropdown above the `DataGrid` to execute bulk actions

-   a6734760: Add new `createDocumentRootBlocksMethods()` helper for creating methods needed by DocumentInterface

    It automatically adds `inputToOutput()`, `anchors()`, `dependencies()` and `replaceDependenciesInOutput()` to a document.

    You can see how it can be used [in the COMET Demo project](https://github.com/vivid-planet/comet/blob/a673476017fa35efb6361877d0fcf2b0c8231439/demo/admin/src/pages/Page.tsx#L57-L60).

-   f25eccf0: Add a hover preview for images to the DAM
-   e57c6c66: Move dashboard components from the COMET Starter to the library (`DashboardHeader`, `LatestBuildsDashboardWidget`, `LatestContentUpdatesDashboardWidget`)
-   2d0f320c: Add `useFormSaveConflict()` hook to check for save conflicts in forms

### Patch Changes

-   564f66d3: Allow `:`, `?`, `=` and `&` in redirect source paths
-   c0e03edc: Add a progress dialog to the `PageTree` when pasting pages
-   49e85432: Show a button to re-login when API responses with 401 - Not Authenticated instead of a plain error message.
-   Updated dependencies [0453c36a]
-   Updated dependencies [692c8555]
-   Updated dependencies [2559ff74]
-   Updated dependencies [fe5e0735]
-   Updated dependencies [ed692f50]
-   Updated dependencies [987f08b3]
-   Updated dependencies [d0773a1a]
-   Updated dependencies [4fe08312]
-   Updated dependencies [5f0f8e6e]
-   Updated dependencies [7c6eb68e]
-   Updated dependencies [9875e7d4]
-   Updated dependencies [d4bcab04]
-   Updated dependencies [0f2794e7]
-   Updated dependencies [80b007ae]
-   Updated dependencies [a7116784]
-   Updated dependencies [a7116784]
-   Updated dependencies [e57c6c66]
    -   @comet/admin@5.0.0
    -   @comet/admin-icons@5.0.0
    -   @comet/blocks-admin@5.0.0
    -   @comet/admin-date-time@5.0.0
    -   @comet/admin-rte@5.0.0
    -   @comet/admin-theme@5.0.0

## 4.7.0

### Minor Changes

-   dbdc0f55: Add support for non-breaking spaces to RTE

    Add `"non-breaking-space"` to `supports` when creating an RTE:

    ```tsx
    const [useRteApi] = makeRteApi();

    export default function MyRte() {
        const { editorState, setEditorState } = useRteApi();
        return (
            <Rte
                value={editorState}
                onChange={setEditorState}
                options={{
                    supports: [
                        // Non-breaking space
                        "non-breaking-space",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

-   17f977aa: Add the possibility to search for a path in PageSearch

### Patch Changes

-   Updated dependencies [d1c7a1c5]
-   Updated dependencies [dbdc0f55]
-   Updated dependencies [eac9990b]
-   Updated dependencies [fe310df8]
-   Updated dependencies [fde8e42b]
-   Updated dependencies [f48a768c]
    -   @comet/admin-theme@4.7.0
    -   @comet/admin-icons@4.7.0
    -   @comet/admin-rte@4.7.0
    -   @comet/admin@4.7.0
    -   @comet/blocks-admin@4.7.0
    -   @comet/admin-date-time@4.7.0

## 4.6.0

### Patch Changes

-   c3b7f992: Replace current icons in the RTE toolbar with new icons from `@comet/admin-icons`
-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
-   Updated dependencies [031d86eb]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-rte@4.6.0
    -   @comet/admin-icons@4.6.0
    -   @comet/blocks-admin@4.6.0
    -   @comet/admin@4.6.0
    -   @comet/admin-date-time@4.6.0
    -   @comet/admin-theme@4.6.0

## 4.5.0

### Patch Changes

-   8a2c3302: Correctly position loading indicators by centring them using the new `Loading` component
-   Updated dependencies [46cf5a8b]
-   Updated dependencies [8a2c3302]
-   Updated dependencies [6d4ca5bf]
-   Updated dependencies [07d921d2]
-   Updated dependencies [01677075]
    -   @comet/admin@4.5.0
    -   @comet/admin-theme@4.5.0
    -   @comet/admin-date-time@4.5.0
    -   @comet/admin-icons@4.5.0
    -   @comet/admin-rte@4.5.0
    -   @comet/blocks-admin@4.5.0

## 4.4.3

### Patch Changes

-   0d2a2b96: Ignore empty labels for publisher
    -   @comet/admin@4.4.3
    -   @comet/admin-date-time@4.4.3
    -   @comet/admin-icons@4.4.3
    -   @comet/admin-rte@4.4.3
    -   @comet/admin-theme@4.4.3
    -   @comet/blocks-admin@4.4.3

## 4.4.2

### Patch Changes

-   b299375f: Fix the typing of `lastUpdatedAt` in the `createUsePage()` factory
    -   @comet/admin@4.4.2
    -   @comet/admin-date-time@4.4.2
    -   @comet/admin-icons@4.4.2
    -   @comet/admin-rte@4.4.2
    -   @comet/admin-theme@4.4.2
    -   @comet/blocks-admin@4.4.2

## 4.4.1

### Patch Changes

-   Updated dependencies [662abcc9]
    -   @comet/admin@4.4.1
    -   @comet/admin-date-time@4.4.1
    -   @comet/admin-icons@4.4.1
    -   @comet/admin-rte@4.4.1
    -   @comet/admin-theme@4.4.1
    -   @comet/blocks-admin@4.4.1

## 4.4.0

### Minor Changes

-   9b1a6507: Silence polling errors in page tree

    Errors during polling (pages query, check for changes query) led to multiple consecutive error dialogs, which were irritating for our users. As these errors occurred randomly and would typically be resolved by the next poll, we decided to silence them altogether.

-   a77da844: Add little helper for mui grid pagination (muiGridPagingToGql)

    Sample usage:

    ```
    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
            sort: muiGridSortToGql(sortModel),
        },
    });
    ```

### Patch Changes

-   11583624: Add content validation for SVG files to prevent the upload of SVGs containing JavaScript
-   Updated dependencies [e824ffa6]
-   Updated dependencies [d4960b05]
-   Updated dependencies [3e15b819]
-   Updated dependencies [a77da844]
    -   @comet/admin@4.4.0
    -   @comet/blocks-admin@4.4.0
    -   @comet/admin-date-time@4.4.0
    -   @comet/admin-icons@4.4.0
    -   @comet/admin-rte@4.4.0
    -   @comet/admin-theme@4.4.0

## 4.3.0

### Minor Changes

-   afc7a6b6: Add human readable label for publisher (cron jobs and jobs)
-   c302bc46: Admin: AboutModal: make logo configurable

### Patch Changes

-   c725984f: Disable the DAM license feature per default.

    The form fields to add license information to assets are now hidden per default. License warnings are not shown per default.
    Setting the `enableLicenseFeature` option via the DamConfigProvider is now necessary to show the license fields and warnings.

-   Updated dependencies [3dc5f55a]
-   Updated dependencies [865cc5cf]
    -   @comet/admin-rte@4.3.0
    -   @comet/admin@4.3.0
    -   @comet/admin-date-time@4.3.0
    -   @comet/admin-icons@4.3.0
    -   @comet/admin-theme@4.3.0
    -   @comet/blocks-admin@4.3.0

## 4.2.0

### Minor Changes

-   7b7b786e: Add support to search values in content scope controls. Add `searchable: true` to a control's config to make it searchable. See [ContentScopeProvider](demo/admin/src/common/ContentScopeProvider.tsx) for an example

### Patch Changes

-   b4d564b6: Add spacing by default between the tabs and the tab content when using `AdminTabs` or `BlockPreviewWithTabs`. This may add unwanted additional spacing in cases where the spacing was added manually.
-   Updated dependencies [67e54a82]
-   Updated dependencies [3567533e]
-   Updated dependencies [7b614c13]
-   Updated dependencies [aaf1586c]
-   Updated dependencies [b4d564b6]
-   Updated dependencies [d25a7cbb]
-   Updated dependencies [0f4ed6c1]
    -   @comet/admin-theme@4.2.0
    -   @comet/admin@4.2.0
    -   @comet/blocks-admin@4.2.0
    -   @comet/admin-date-time@4.2.0
    -   @comet/admin-icons@4.2.0
    -   @comet/admin-rte@4.2.0

## 4.1.0

### Patch Changes

-   51466b1a: Fix DAM path display
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [c5f2f918]
    -   @comet/admin@4.1.0
    -   @comet/admin-icons@4.1.0
    -   @comet/admin-date-time@4.1.0
    -   @comet/admin-rte@4.1.0
    -   @comet/admin-theme@4.1.0
    -   @comet/blocks-admin@4.1.0
