# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.2.7

_Sep 19, 2023_

### @comet/cms-api

#### Changes

-   Fix improper validation of input when creating/updating page tree nodes or redirects
-   Prevent the fileUrl from being exposed in the Site via the PixelImageBlock

## 3.2.6

_Sep 4, 2023_

### @comet/cms-api

#### Changes

-   add content validation for SVG files to prevent the upload of SVGs containing JavaScript

### @comet/cms-admin

#### Changes

-   add error message for SVG content validation

## 3.2.5

_Jul 17, 2023_

### @comet/cms-api

#### Changes

-   get file stats from uploaded file in filestorage

## 3.2.4

_Jun 19, 2023_

### @comet/cms-api

#### Changes

-   add stream end when create files from buffer in filestorage

## 3.2.3

_Feb 7, 2023_

### @comet/cms-api

#### Changes

-   Fix `createRedirect` mutation when no scoping is used

### @comet/blocks-admin

#### Changes

-   Fix `createCompositeSetting` not working when using an array value

## 3.2.2

_Jan 25, 2023_

### @comet/admin

#### Changes

-   Fix `readClipboardText()` not working in Firefox by using local storage as a fallback

## 3.2.1

_Dec 6, 2022_

### @comet/admin

#### Changes

-   Fix a bug where the slider thumbs are not visible when using `FinalFormRangeInput`
-   Fix a bug where `SaveButton` would not clear `error` and `success` display states after timeout

## 3.2.0

_Nov 29, 2022_

### Highlights

-   Add support to type root blocks in the GraphQL schema using `RootBlockDataScalar` and `RootBlockInputScalar`. See [page.entity.ts](/demo/api/src/pages/entities/page.entity.ts), [schema.gql](/demo/api/schema.gql), and [codegen.ts](demo/admin/codegen.ts) for an example on how to use

### @comet/admin-rte

#### Changes

-   Fix a bug where control buttons in the toolbar would trigger submission when used in a form

### @comet/cms-admin

#### Changes

-   Fix a bug where the pages query would query for a field `undefined` when no `additionalPageTreeNodeFragment` is set

### @comet/cms-api

#### Changes

-   Add default value `{}` for `RedirectScopeInput` when no explicit scope is set to make redirects scope support backwards compatible
-   Add `RootBlockDataScalar` and `RootBlockInputScalar` scalars to type root blocks in the GraphQL schema

## 3.1.0

_Nov 15, 2022_

### Highlights

-   Add scope support for redirects (`@comet/cms-api` and `@comet/cms-admin`)

### @comet/admin

#### Changes

-   Add `useFocusAwarePolling` hook that can be used in combination with `useQuery` to only fetch when the current browser tab is focused

### @comet/cms-admin

#### Changes

-   `useSaveConflict` now only checks for conflicts when the current browser tab is focused
-   Add `additionalPageTreeNodeFragment` prop to `CmsBlockContextProvider` that can be used to load additional page tree node fields in the page tree

## 3.0.0

_Oct 17, 2022_

This release marks the first public release of the CMS packages used for [Comet DXP](https://comet-dxp.com) applications. See the [documentation](https://docs.comet-dxp.com) for more information.

### Highlights

-   Add new CMS packages `@comet/blocks-api`, `@comet/cms-api`, `@comet/blocks-admin`, `@comet/cms-admin`, and `@comet/cms-site`. Review [package overview](https://docs.comet-dxp.com/docs/overview/packages-tools) for usage
-   Add new `@comet/cli` package to provide commonly used scripts (e.g., `generate-block-types`) to all applications
-   Add new `@comet/eslint-config` package to provide ESLint configs used by all packages
-   Add new [MUI X DataGrid](https://mui.com/x/react-data-grid/) helper functions
-   Migrate all `@comet/admin` packages to MUI 5

### Migration Guide

1.  Migrate to MUI 5, following the official [MUI Migration Guide](https://mui.com/guides/migration-v4/)

2.  Install jscodeshift in your project

    ```bash
    npm install --save-dev jscodeshift
    ```

3.  Clone this repository into your project repository. If you have a monorepo, clone it into the correct subfolder

4.  Migrate from styled-components to MUI's style engine

    ```bash
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet/codemods/3.0.0/mui-style-engine.ts src/
    ```

### @comet/cli

This release is the first stable version.

### @comet/eslint-config

This release is the first stable version.

### @comet/blocks-api

This release is the first stable version.

### @comet/cms-api

This release is the first stable version.

### @comet/blocks-admin

This release is the first stable version.

### @comet/cms-admin

This release is the first stable version.

### @comet/admin

#### Breaking changes

-   Change the minimum supported React version to 17
-   Remove `Select` component in favor of MUI's [Select](https://mui.com/material-ui/react-select/#main-content) component
-   `StackBreadcrumbs` do not support MUI's [Breadcrumbs props](https://mui.com/material-ui/react-breadcrumbs/#main-content) anymore
-   Remove `ErrorDialog` dependency from `createErrorDialogApolloLink()`. Doing so eliminates the need to create the Apollo client in the React component tree, which is preferable:

    **Before**

    ```tsx
    const Providers: React.FunctionComponent = ({ children }) => {
        const errorDialog = useErrorDialog();

        const apolloClient = new ApolloClient({
            link: ApolloLink.from([
                createErrorDialogApolloLink({ errorDialog }),
                createHttpLink({
                    uri: `https://anyapi.com/graphql`,
                }),
            ]),
            cache: new InMemoryCache(),
        });

        return (
            <OtherProviders>
                <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
            </OtherProviders>
        );
    };
    ```

    **After**

    ```tsx
    const apolloClient = new ApolloClient({
        link: ApolloLink.from([
            createErrorDialogApolloLink(),
            createHttpLink({
                uri: `https://anyapi.com/graphql`,
            }),
        ]),
        cache: new InMemoryCache(),
    });

    const Providers: React.FunctionComponent = ({ children }) => {
        return (
            <OtherProviders>
                <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
            </OtherProviders>
        );
    };
    ```

-   Rename `ErrorDialogProvider` to `ErrorDialogHandler`. `ErrorDialogHandler` does not need to wrap the application anymore
-   The default color of MUI's `Button` and `IconButton` [has been changed](https://mui.com/material-ui/migration/v5-component-changes/#button) from `"default"` to `"primary"`. Restore the previous "default" appearance by setting the `color` prop to `"info"`
-   Rename `StackBreadcrumbProps` to `StackBreadcrumbsProps`
-   Rename `FormSectionKey` to `FormSectionClassKey`
-   Remove the default clear button from `FinalFormSearchTextField`. Re-enable by using the `clearable` prop

#### Changes

-   Expose `comet.generic.*` messages as public API through `messages.ts`. Doing so prevents the need to translate them for every application:

    **Before**

    ```tsx
    <FormattedMessage id="comet.generic.globalContentScope" defaultMessage="Global Content" />;

    intl.formatMessage({
        id: "comet.generic.doYouWantToSaveYourChanges",
        defaultMessage: "Do you want to save your changes?",
    });
    ```

    **After**

    ```tsx
    import { messages } from "@comet/admin";

    <FormattedMessage {...messages.globalContentScope} />;

    intl.formatMessage(messages.saveUnsavedChanges);
    ```

-   `StackBreadcrumbs` now shows an overflow menu when its items do not fit into a single row

### @comet/admin-color-picker

#### Breaking changes

-   Change the majority of classes used for style overrides. This may break custom styles
-   Remove `showPicker` prop from `ColorPicker` and show the picker by default. Hide by using the `hidePicker` prop
-   Rename the `showClearButton` prop to `clearable` in `ColorPicker`

#### Changes

-   Add a slider for the alpha channel, which is used when the `colorFormat` prop is set to `"rgba"`
-   Add a standalone `ColorPicker` component for usage outside Final Form
-   Disable the input when the setting the `disabled` prop
-   Add missing focus styling to the input
-   Open/close the picker when focusing/blurring the input using tab navigation

### @comet/admin-date-time (previously @comet/admin-date-picker)

#### Breaking changes

-   Rename `@comet/admin-date-picker` to `@comet/admin-date-time`
-   Change the internally used data picker library from [react-dates](https://github.com/react-dates/react-dates) to [react-date-range](https://github.com/hypeserver/react-date-range). Props specific to react-dates will no longer have any effect

-   The date-picker & date-range-picker components require a [date-fns locale](https://date-fns.org/v2.28.0/docs/Locale) that can be provided by wrapping the application with the `DateFnsLocaleProvider` and passing in the desired locale as the value.

    ```tsx
    import { DateFnsLocaleProvider } from "@comet/admin-date-time";
    import { enUS } from "date-fns/locale";

    <DateFnsLocaleProvider value={enUS}>
        <App />
    </DateFnsLocaleProvider>;
    ```

#### Changes

-   Add standalone `DatePicker` and `DateRangePicker` components for usage outside Final Form
-   Add new `TimePicker`, `DateTimePicker`, and `TimeRangePicker` components. Each component comes as a standalone version with a separate Final Form wrapper (`FinalFormTimePicker` etc.)

### @comet/admin-theme

#### Breaking changes

-   Update the theme to reflect the latest adaptations made in our applications
-   Add new default styling for MUI's [Chip](https://mui.com/material-ui/react-chip/#main-content) component

### @comet/cms-site

This release is the first stable version.

## Older versions

Changes before 3.x are listed in our [changelog for older versions](https://github.com/vivid-planet/comet/blob/main/CHANGELOG.old.md).
