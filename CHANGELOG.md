# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [Next]

## @comet/admin

### Changes

-   `comet.generic` messages are exposed as public API through `messages.ts` (this stops them from being translated for every application)
-   `StackBreadcrumbs` has a new design and shows an overflow menu when the items don't fit into a single line.

### Incompatible Changes

-   Removed the `Select` component, use MUIs `Select` instead.
-   `StackBreadcrumbs` no longer supports props from MUIs `Breadcrumbs` component.
-   Upgraded class-transformer from 0.3.1 to 0.5.x, see [CHANGELOG](https://github.com/typestack/class-transformer/blob/develop/CHANGELOG.md)

### Bugfixes

-   close the EditDialog after submitting a contained form via ENTER click
-   [RTE] Fix a bug were `setEditorState` was incorrectly assumed to be a React state setter function.

### Migration Guide

-   replace all occurrences of `<FormattedMessage id="comet.generic.XXX" />` and `intl.formatMessage({id: "comet.generic.XXX"})`

    **before**

    ```typescript jsx
    <FormattedMessage id="comet.generic.globalContentScope" defaultMessage="Global Content" />;

    intl.formatMessage({
        id: "comet.generic.doYouWantToSaveYourChanges",
        defaultMessage: "Do you want to save your changes?",
    });
    ```

    **new**

    ```typescript jsx
    import { messages } from "@comet/admin";

    <FormattedMessage {...messages.globalContentScope} />;

    intl.formatMessage(messages.saveUnsavedChanges);
    ```

-   class-transformer changes:

    exported functions has been renamed

    ```typescript
    classToPlain -> instanceToPlain
    plainToClass -> plainToInstance
    classToClass -> instanceToInstance
    ```

    Signature change for @Transform decorator
    Before

    ```typescript
    @Transform((value, obj, type) => /* Do some stuff with value here. */)
    ```

    After

    ```typescript
    @Transform(({ value, key, obj, type }) => /* Do some stuff with value here. */)
    ```

    `ClassType` export changed
    Before

    ```typescript
    import { ClassType } from "class-transformer/ClassTransformer";
    ```

    After

    ```typescript
    import { ClassConstructor } from "class-transformer";
    ```

## @comet/admin-theme

### Incompatible Changes

-   Added new default styling for MuiChip component.
-   options have been removed from `createErrorDialogApolloLink()`, so it has no react hook dependency to error dialog anymore. This is perfect because of this we are not limited to create the apollo client in jsx.

**before:**

```typescript jsx
const Providers: React.FunctionComponent = ({ children }) => {
    const errorDialog = useErrorDialog();

    const link = ApolloLink.from([
        createErrorDialogApolloLink({ errorDialog }),
        createHttpLink({
            uri: `https://anyapi.com/graphql`,
        }),
    ]);
    const cache = new InMemoryCache();

    const apolloClient = new ApolloClient({
    return new ApolloClient({
        link,
        cache,
    });
    return (<OtherProviders><ApolloProvider client={apolloClient}>{children}</ApolloProvider></OtherProviders>);
};
```

**new:**

```typescript jsx
const createApolloClient = () => {
    const link = ApolloLink.from([
        createErrorDialogApolloLink(),
        createHttpLink({
            uri: `https://anyapi.com/graphql`,
        }),
    ]);
    const cache = new InMemoryCache();

    const apolloClient = new ApolloClient({
        return new ApolloClient({
            link,
            cache,
        });
    };
}
const apolloClient = createApolloClient();

const Providers: React.FunctionComponent = ({ children }) => {
    return (<OtherProviders><ApolloProvider client={apolloClient}>{children}</ApolloProvider></OtherProviders>)};
```

-   Rename `ErrorDialogProvider` to `ErrorDialogHandler` - `ErrorDialogHandler` must not wrap the whole application
-   The minimum version of `react` and `react-dom` has been changed to 17.0
-   Migrated from "Material-UI" v4 to "MUI" v5
    -   The default color of `MuiButton` and `MuiIconButton` was [changed](https://mui.com/guides/migration-v4/#button) from "default" to "primary", to restore the previous "default" style, set the color to "info"
    -   See the official [MUI Migration Guide](https://mui.com/guides/migration-v4/) for more details
-   Changed the styled engine from styled-components to emotion
-   Renamed some types for uniform naming
    -   `StackBreadcrumbProps` -> `StackBreadcrumbsProps`
    -   `FormSectionKey` -> `FormSectionClassKey`
-   Updated theme to reflect the latest adaptations made in our applications. The old behavior can be restored by adding the following to the theme:
    ```js
    {
        components: {
            MuiListItem: {
                defaultProps: {
                    dense: false,
                },
            },
            MuiSelect: {
                styleOverrides: {
                    icon: {
                        top: "calc(50% - 6px)",
                    },
                },
            },
        },
    }
    ```
-   `FinalFormSearchTextField` no longer has a clear button by default. It can be re-enabled using the `clearable` prop.

### Migration Guide

Migrate to MUI 5, following the official [MUI Migration Guide](https://mui.com/guides/migration-v4/)

1. Run the [MUI Codemods](https://mui.com/guides/migration-v4/#run-codemods)
2. Migrate the [Theme Structure](https://mui.com/guides/migration-v4/#theme-structure)
3. Migrate from styled-components to MUI's style engine. Automatic migrations using codeshift are available (use -d for dry-run):
    ```
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet-admin/codemods/3.0.0/mui-style-engine.ts src/
    ```

## @comet/admin-date-picker -> @comet/admin-date-time

### Changes

-   Add standalone `DatePicker` and `DateRangePicker` components for use outside Final Form.
-   Add new `TimePicker`, `DateTimePicker` and `TimeRangePicker` components. Each comes standalone and with a separate Final Form component.

### Incompatible Changes

-   `@comet/admin-date-picker` has been renamed `@comet/admin-date-time`
-   The date picker library used internally has been changed from [react-dates](https://github.com/react-dates/react-dates) to [react-date-range](https://github.com/hypeserver/react-date-range). Props specific to react-dates will no longer have any effect.
-   The date-picker & date-range-picker components require a [date-fns locale](https://date-fns.org/v2.28.0/docs/Locale) that can be provided by wrapping the application with the `DateFnsLocaleProvider` and passing in the desired locale as the value.

```tsx
import { DateFnsLocaleProvider } from "@comet/admin-date-time";
import { enUS } from "date-fns/locale";
// ...
<DateFnsLocaleProvider value={enUS}>
    <App />
</DateFnsLocaleProvider>;
```

## @comet/admin-color-picker

### Highlights

-   A slider for the alpha channel can be enabled by setting the `colorFormat` prop to "rgba"
-   Add a standalone `ColorPicker` component for use outside final-form

### Bugfixes

-   Disable the input when the `disabled` prop is set
-   Add missing focus styling to the input
-   Open & close the picker when focusing & blurring the input with tab navigation

### Incompatible Changes

-   The majority of the classes used for style overrides have been changed, therefore, custom styling may need to be refactored
-   The `showPicker` prop has been removed, the picker is now shown by default and can be hidden with the `hidePicker` prop
-   The `showClearButton` prop has been removed, it can be added manually by adding the `ClearInputButton` component to the `endAdornment`

## 2.2.1

_Oct 3, 2022_

### @comet/admin-rte

-   Fix a bug where `setEditorState` was incorrectly assumed to be a React state setter function

## 2.2.0

_Jun 30, 2022_

### @comet/admin

-   Display loading and error states of a contained form in `EditDialog` via its `SaveButton`
-   Close `EditDialog` when a contained form is submitted via `Enter` key press
-   Fix `FinalFormSelect` value generic to allow simple select values such as `string`

## 2.1.0

_Jun 20, 2022_

### Highlights

-   Add `FinalFormAutocomplete` component (see [story](https://comet-admin.netlify.app/?path=/story/comet-admin-form--autocomplete-async-select))

### @comet/admin

-   Add `useAsyncOptionsProps` hook to allow async loading of options in `FinalFormAutocomplete` and `FinalFormSelect`
-   Add support to pass options directly via props in `FinalFormSelect (they are rendered automatically)

### @comet/admin-rte

-   Add support for custom inline styles (see [story](https://comet-admin.netlify.app/?path=/story/comet-admin-rte--custom-inline-styles))
-   Show OS-specific shortcut tooltips on MacOS

## 2.0.0

_Nov 3, 2021_

### Highlights

-   Add package @comet/admin-icons
-   Add a standard `Toolbar` that can be used as an application-wide element with consistent styling containing navigation, action buttons, and filters
-   Add the ability to customize components, similar to Material UI components. Customization can be done either globally through theme [overrides](https://v4.mui.com/customization/globals/#css) and [props](https://v4.mui.com/customization/globals/#default-props) or individually with [classes](https://v4.mui.com/customization/components/#overriding-styles-with-class-names)
-   Start docs of components and general information about the development of Comet Admin
-   Implement [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) that catch errors in the component tree without crashing the application

### Migration Guide

1. Install jscodeshift in your project

    ```bash
    npm install --save-dev jscodeshift
    ```

2. Clone this repository into your project repository. If you have a monorepo, clone it into the correct subfolder
3. Run codemods depending on usage

    **Remove `renderButtons` and `components` from `FinalForm`**

    ```bash
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet-admin/codemods/2.0.0/final-form-dissolve-final-form-save-cancel-buttons.ts src/
    ```

    **Remove `showBreadcrumbs` from `Stack`**

    ```bash
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet-admin/codemods/2.0.0/stack-dissolve-breadcrumbs.ts src/
    ```

    **Remove `showBackButton` from `Stack`**

    ```bash
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet-admin/codemods/2.0.0/stack-dissolve-backbutton.ts  src/
    ```

    **Update theme**

    ```bash
    npx jscodeshift --extensions=ts,tsx --parser=tsx -t comet-admin/codemods/2.0.0/update-theme.ts src/
    ```

See an example migration [here](https://github.com/vivid-planet/comet-admin-starter/pull/36).

### @comet/admin

#### Breaking changes

-   Remove `createMuiTheme` in favor of `createTheme` from `@material-ui/core`
-   Remove `VPAdminInputBase` and `getDefaultVPAdminInputStyles`, in favor of [InputBase](https://v4.mui.com/api/input-base/) from Material UI
-   Remove `renderButtons` and `components` props from `FinalForm` (handled by codemods)
-   Remove `FinalFormTextField` in favor of `FinalFormInput`. Material UI's [TextField](https://v4.mui.com/components/text-fields/#textfield) component should not be used in Comet Admin projects as its design is incompatible with the Comet CI
-   Remove `fieldContainer` prop from `Field` in favor of a new `variant` prop
-   Remove `FieldContainerLabelAbove` component in favor of the default `vertical` variant. Restore the previous default layout of `Field` by adding the following to the theme:
    ```js
    {
        props: {
            CometAdminFormFieldContainer: {
                variant: 'horizontal'
            }
        },
        overrides: {
            CometAdminFormFieldContainer: {
                horizontal: {
                    "& $label": {
                        width: `${100 / 3}%`
                    },
                    "& $inputContainer": {
                        width: `${200 / 3}%`
                    }
                }
            }
        }
    }
    ```
-   Remove default styling from `Menu` component in favor of styling the component via the theme
-   Remove `permanentMenuMinWidth` prop from `Menu` in favor of a new `variant` prop, which allows for more control. For instance, variant `temporary` can be used to give some pages more space
-   Remove `components.breadcrumbsContainer` prop form `Stack` in favor of a div that can be customized via the theme
-   Remove `FixedLeftRightLayout` component
-   Remove `FormPaper` component in favor of Material UI's [Card](https://v4.mui.com/components/cards/#card) component
-   Change default content spacing and header height of `MasterLayout`
-   Custom `headerComponent` of `MasterLayout` expects a component built using the `AppHeader` system (see [docs](https://comet-admin.netlify.app/?path=/story/docs-components-appheader--page))
-   Remove `hideToolbarMenuIcon` prop from `MasterLayout` as it is no longer necessary when building a custom header using the `AppHeader` system
-   Remove `<main>` HTML tag from `MasterLayout` in favor of new `MainContent` component
    ```js
    <MasterLayout headerComponent={AppHeader} menuComponent={AppMenu}>
        <Toolbar />
        <MainContent>
        /* Main content goes here */
        </MainContent>
    </MasterLayout
    ```
-   Remove `AppBar` inside `Tabs`. Restore the previous appearance by overriding the `CometAdminTabs-root` class
-   Remove `tabLabel` prop from `Tabs`. Use `label` instead
-   `RouterTabs` do not inherit Material UI's [Tabs props](https://v4.mui.com/api/tabs/#props) anymore. Use `tabsProps` prop to set `Tabs` props
-   Remove `showBreadcrumbs` prop from `Stack`. `StackBreadcrumbs` has been added for compatibility. However, it is recommended to use the new `Toolbar` system (handled by codemods)

    ```js
    <Stack topLevelTitle="Stack Nested">
        <StackBreadcrumbs />
        <StackSwitch>
            <StackPage name="page1">
                <Page1 />
            </StackPage>
            <StackPage name="page2">page2-2</StackPage>
        </StackSwitch>
    </Stack>
    ```

-   Remove `showBackButton` prop from `Stack` (handled by codemods)
-   Remove alternating background color from body rows in `Table`. Restore the previous appearance by adding the following styles to `CometAdminTableBodyRow`:

    ```js
    odd: {
        backgroundColor: neutrals[50],
    }
    ```

-   Remove background color from table head in `Table`. Restore the previous appearance by adding the following styles to `MuiTableHead`:

    ```js
    root: {
        backgroundColor: neutrals[100],
    }
    ```

-   `TableDndOrder` requires new peer dependencies and a `DndProvider` setup in the application

    Install peer dependencies in your application

    ```bash
    npm install react-dnd@"~14" react-dnd-html5-backend@"~14"
    ```

    Wrap your application in a `DnDProvider`

    ```js
    import { DndProvider } from "react-dnd";
    import { HTML5Backend } from "react-dnd-html5-backend";

    export function App() {
        return <DndProvider backend={HTML5Backend}>...</DndProvider>;
    }
    ```

#### Changes

-   Add `ClearInputButton` component, which can be used as an `endAdornment` to clear inputs
-   Add `variant` prop to `Field` to control the positioning of label and input
-   Add `headerHeight` prop to `MasterLayout` which child components can use to position themselves
-   Add `onAfterSubmit` callback to `FinalForm`
-   Add `useStoredState` hook to store state in local storage or session storage
-   Add `FinalFormRangeInput` component
-   Add `SplitButton` component to combine buttons in a button group
-   Add `SaveButton` component, which handles and displays save state (idle, saving, success and error)
-   Add `SnackbarProvider`, `useSnackbarApi` hook and `UndoSnackbar`
-   Add `FinalFormSaveCancelButtonsLegacy` as drop-in replacement for removed cancel and save buttons in `FinalForm`
-   Add `PrettyBytes`  component for formatting byte values, for instance, file sizes
-   Add `validateWarning` validator to `Field` and `FinalForm`
-   Add `open` and `onOpenChange` props to `AppHeaderDropdown` to control the open state
-   Add `getTargetUrl()` to `StackSwitchApi`
-   Add `StackLink` component for navigating within a `Stack` via hyperlinks
-   Allow `boolean | undefined | null` as children of `RouterTabs`
-   Expose `selectionApi` through `useEditDialog`

### @comet/admin-color-picker

#### Breaking changes

-   Rename `VPAdminColorPicker` to `CometAdminColorPicker`
-   Remove `clearButton` and `clearIcon` theme classes from the color picker in favor of a new `ClearInputButton` component
-   The clear button is hidden by default

#### Changes

-   Allow custom icons/adornments for color input
-   The clear button is now optional (using the `showClearButton` prop)

### @comet/admin-react-select

#### Breaking changes

-   Rename theme key from `VPAdminSelect` to `CometAdminSelect`

### @comet/admin-rte

#### Breaking changes

-   Removed `rte` key from theme. RTE colors should be defined using by overriding `CometAdminRte` instead
    ```js
    {
        props: {
            CometAdminRte: {
                colors: {
                    // Colors go here
                }
            }
        }
    }
    ```

## Older versions

Changes before 2.x are listed in our [changelog for older versions](https://github.com/vivid-planet/comet/blob/main/CHANGELOG.old.md).
