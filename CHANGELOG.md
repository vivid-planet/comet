# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [next]

## @comet/admin

### Highlights

-   Added `ClearInputButton`, this component can be used as `endAdornment`, to clear inputs
    -   Can be themed with `CometAdminClearInputButton` (props and overrides)
-   New methods of customization and default layout for `Field`
    -   Added theme-augmentation for `FieldContainer`
    -   New `variant` prop to select between vertical and horizontal positioning of label and input
    -   Label is now positioned above input by default (`variant={"vertical"}`)
-   The Menu component and it's items can be customized using the material-ui theme
    -   Allows custom styling of the Menu, MenuItem and MenuCollapsibleItem _(theme -> overrides -> CometAdminMenu/CometAdminMenuItem/CometAdminMenuCollapsibleItem)_
    -   Allows using custom open/close icons for CollapsibleItem _(theme -> props -> CometAdminMenuCollapsibleItem -> openedIcon/closedIcon)_
-   The MasterLayout component can be customized using the material-ui theme
    -   Using the new `headerHeight` prop, the top-spacing of the content and the menu, will now be adjusted automatically
-   add new package @comet/admin-icons
-   add onAfterSubmit to FinalForm
-   add useStoredState() hook
-   Added a new FinalFormRangeInput Component
-   add standard Toolbar that can be used as application wide consistent element containing navigation, action buttons and filters
-   add SplitButton - combine multiple buttons behind one ButtonGroup
-   add SaveButton which handles and displays state(idle, saving, success and error)
-   add SnackbarProvider, useSnackbarApi() hook and UndoSnackbar
-   add `FinalFormSaveCancelButtonsLegacy` as drop in replacement for removed Cancel and Save Button in `FinalForm`.
-   add PrettyBytes component for formatting file sizes and other byte values
-   Add `validateWarning` validator to `Field` and `FinalForm`.

### Incompatible Changes

-   `createMuiTheme` has been removed from `@comet/admin` in favour of `createMuiTheme` from `@material-ui/core`
-   Removed `VPAdminInputBase` and `getDefaultVPAdminInputStyles`, in favour of InputBase from Material-UI
-   Usage and default layout of `Field` has changed
    -   The `fieldContainer` prop has been removed, in favour of the `variant` prop and theme-augmentation of `CometAdminFormFieldContainer`
    -   Removed `FieldContainerLabelAbove` component (the new default looks like this)
    -   The old default layout of `Field` can be restored by adding the following to the theme:
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
-   Changes to Menu component
    -   Removed default styling in favour of the ability to style the component using the theme without the need to override these default styles
    -   Removed the `permanentMenuMinWidth` prop, now `variant` can be passed instead
        -   This allows for more control, like giving certain pages more width by always using the temporary variant on those pages
    -   Allows maximum item-nesting of two levels
-   Changes to MasterLayout
    -   The default values for content-spacing and header-height have changed slightly
-   Changes to Stack
    -   Removed prop `components.breadcrumbsContainer` in favour of a div that can be styled using the theme (`overrides -> CometAdminStack -> breadcrumbs`)
-   Removed component `FixedLeftRightLayout`
-   Changes to MasterLayout
    -   the html tag <main> was removed from the `MasterTemplate` and a new Component `MainContent` is introduced
    -   Best way to handle this change is to wrap your main content with the `MainContent` Component
-   Changes to Tabs & RouterTabs
    -   Removed `AppBar` from Tabs, you can style `CometAdminTabs-root` to bring back the previous appearance, if necessary
    -   Removed `tabLabel` prop, use `label` instead
    -   In `RouterTabs`, the props `variant` and `indicatorColor` now need to be set in the `tabsProps` prop

```
  <MasterLayout headerComponent={AppHeader} menuComponent={AppMenu}>
    <Toolbar />
    <MainContent>
     /* You main content goes here*/
    </MainContent>
  </MasterLayout
```

-   removed `showBreadcrumbs` Prop from Stack and added Breadcrumbs component for compatibility. It's recommended at all to use new Toolbar System
    old:

```
   <Stack topLevelTitle="Stack Nested">
       <StackSwitch>
           <StackPage name="page1">
               <Page1 />
           </StackPage>
           <StackPage name="page2">page2-2</StackPage>
       </StackSwitch>
   </Stack>
```

-   Changes to Table (CometAdminTable)

    -   Removed alternating background-color of body-rows in comet-theme, can be restored by adding the following styles to `CometAdminTableBodyRow`:

        ```js
        odd: {
            backgroundColor: neutrals[50],
        }
        ```

    -   Removed background-color from TableHead, can be restored by adding the following styles to `MuiTableHead`:

        ```js
        root: {
            backgroundColor: neutrals[100],
        }
        ```

new:

```
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

-   Changes to DndOrderRow

    DndOrderRow requires new peer dependencies and a DndProvider setup in the application.

    -   Install peer dependencies in your application

        ```bash
        npm install react-dnd@"~14"
        npm install react-dnd-html5-backend@"~14"
        ```

    -   Put your application code inside a DndProvider

        ```
        import { DndProvider } from "react-dnd";
        import { HTML5Backend } from "react-dnd-html5-backend";

        export function App() {
            return (
                <DndProvider backend={HTML5Backend}>
                        ... your application code
                </DndProvider>
            )
        }
        ```

### Migration Guide

install jscodeshift in your project - otherwise you will get a lodash error

    npm install jscodeshift --dev

Clone this repository into your project repository. If you have a monorepo, you have to clone it into the right subfolder.

An example can be found [here](https://github.com/vivid-planet/comet-admin-starter/pull/36).

**Migrate FinalForm**

Final Form: Following props have been removed: `renderButtons` and `components`

```
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/final-form-dissolve-final-form-save-cancel-buttons.ts src/
```

**Migrate Stack**

Follow props has been removed: `showBreadcrumbs`and `showBackButton`

```
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/stack-dissolve-breadcrumbs.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/stack-dissolve-backbutton.ts  src/
```

**Migrate Theme**

Automatic migrations using codeshift are available (use -d for dry-run):

```
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/2.0.0/update-theme.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/update-theme.ts src/
```

## @comet/admin-color-picker

### Highlights

-   Allow custom icons/adornment for color-input
-   The clear-button is now optional (using the `showClearButton` prop)

### Incompatible Changes

-   Renamed `VPAdminColorPicker` to `CometAdminColorPicker`
-   Removed `clearButton` and `clearIcon` classes from color-picker
    -   Using theme-augmentation the new common clear-button can now be styled with `CometAdminClearInputButton` instead of `VPAdminColorPicker`
-   The clear-button is no longer shown by default
-   Removed `clearButton` and `clearIcon` classes from color-picker
    -   Using theme-augmentation the new common clear-button can now be styled with `CometAdminClearInputButton` instead of `VPAdminColorPicker`

## @comet/admin-react-select

### Incompatible Changes

-   Renamed theme-key from `VPAdminSelect` to `CometAdminSelect`

## @comet/admin-rte

### Highlights

-   Add ability to customize the styling using theme-overrides

### Incompatible Changes

-   Removed `rte` key from theme
    -   The rte-colors should now be defined under `props` -> `CometAdminRte` -> `colors` instead of `rte` -> `colors`

# @comet/admin

## [1.3.0] - 4. March 2021

This is a bugfix/maintenance release.

### Bugfixes

-   Handle submit error in EditDialog (#209)
-   Pass `innerRef` from `TableBodyRow` to `sc.TableBodyRow`

### Internal Changes

-   The `styled-components` peer dependency has been changed to `^4.0.0 || ^5.0.0` to include v5.
-   The `graphql` peer dependency has been changed to `^14.0.0 || ^15.0.0` to include v14.

## [1.2.0] - 23. Feb 2021

### Highlights

-   RouterPrompt: comet-admin's [react-router Prompt Component](https://reactrouter.com/core/api/Prompt) Wrapper (that adds support for multiple Prompt instances) adds missing message callback parameters for full react-router compatibility

### Internal Changes

-   TotalCount of the tables Pagination is now formatted with FormattedNumber from react-intl.
-   switched from yarn to npm 7 (updated all dependencies)

## [1.1.0] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin

## [1.1.0] - 11. Jan 2021

This is a bugfix/maintenance release.

### Highlights

-   Added migration guide for 1.0 update https://github.com/vivid-planet/comet-admin/blob/master/CHANGELOG.md#migration-guide

### Bugfixes

-   Render MenuItem in children of Route (#277)
-   Fix ability to open temporary menu (#279)
-   dependency-cleanup (#278)

## [1.0.0] - 18. Dec 2020

This version ist the first stable version.

### Highlights

-   Renamed from react-admin to comet-admin (!!!)
-   Made comet-admin translatable with react-intl
-   Updated apollo

### Incompatible Changes

-   Restructured packages:
    -   Consolidated react-admin-core, fetch-provider, file-icons, react-admin-final-form-material-ui, react-admin-form, react-admin-layout and react-admin-mui into comet-admin
    -   Moved react-select to own package comet-admin-react-select
-   Removed date-fns for date formatting in favor of react-intl
-   Removed exports for styled and css, use styled-components directly
-   FinalForm wrappers (e.g. Checkbox, Input, ...) are now prefixed with FinalForm

### Internal Changes

-   Switched form TSLint to ESLint

### Migration Guide

Clone this repository into your project repository. If you have a monorepo, you have to clone it into the right subfolder.

An example can be found [here](https://github.com/vivid-planet/comet-admin-starter/pull/36).

**Package Renaming**

Automatic migrations using codeshift are available (use -d for dry-run):

```
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/1.0.0/package-renames.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/1.0.0/package-renames.ts src/
```

**Styled Components**

Automatic migrations using codeshift are available (use -d for dry-run):

```
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/1.0.0/styled-components.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/1.0.0/styled-components.ts src/
```

**Apollo-Client**

Detailed instructions can be found [here](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration). Automatic migrations using codeshift are available (use -d for dry-run):

```
git clone https://github.com/apollographql/apollo-client.git
npx jscodeshift -t apollo-client/scripts/codemods/ac2-to-ac3/imports.js --extensions ts --parser ts src/
npx jscodeshift -t apollo-client/scripts/codemods/ac2-to-ac3/imports.js --extensions tsx --parser tsx src/
```

**Component-Renames**

FinalForm fields are now prefixed with FinalForm. Automatic migrations using codeshift are available (use -d for dry-run):

```
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/1.0.0/component-renames.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/1.0.0/component-renames.ts src/
```

**FormatLocalized**

`FormatLocalized` has been removed in favor of `FormattedDate` and `FormattedTime` of react-intl. An example migration can look like this:

Before:

```
<FormatLocalized date={parseISO(publishDate)} format="dd.MM.yyyy - HH:mm" />
```

After:

```
<FormattedDate value={date} day="2-digit" month="2-digit" year="numeric" />
{" - "}
<FormattedTime value={date} />
```

As an alternative, FormatLocalized can be created inside the project by using:

```
import { format } from "date-fns";
import * as React from "react";
import { useIntl } from "react-intl";

interface IProps {
    format: string;
    date: Date | number;
}
export const FormatLocalized: React.FunctionComponent<IProps> = ({ date, format: formatString }) => {
    const intl = useIntl();
    const locale = intl.locale;
    return <>{format(date, formatString, { locale })}</>;
};
```

However, imports need to be adjusted manually.

**Internationalization**

Strings are now prepared for internationalization. The default language is switched from German to English. A sample setup can be found [here](https://github.com/vivid-planet/comet-admin-starter/pull/36).

**Fix Eslint Errors**

```
npx eslint --ext .ts,.tsx,.js,.jsx,.json,.md --fix src/
```

# @comet/admin-color-picker

## [1.0.2] - 23. Feb 2021

use fixed version of react-color
switched from yarn to npm 7 (updated all dependencies)

## [1.0.1] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin-color-picker

## [1.0.1] - 11. Jan 2021

This is a bugfix/maintenance release

## [1.0.0] - 22. Dec 2020

This version ist the first stable version.

# @comet/admin-date-picker

## [1.0.2] - 23. Feb 2021

switched from yarn to npm 7 (updated all dependencies)

## [1.0.1] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin-date-picker

## [1.0.1] - 11. Jan 2021

This is a bugfix/maintenance release

## [1.0.0] - 22. Dec 2020

This version ist the first stable version.

# @comet/admin-react-select

## [1.0.2] - 23. Feb 2021

switched from yarn to npm 7 (updated all dependencies)

## [1.0.1] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin-react-select

## [1.0.1] - 11. Jan 2021

This is a bugfix/maintenance release

## [1.0.0] - 22. Dec 2020

This version ist the first stable version.

# @comet/admin-rte

## [1.2.1] - 23. Feb 2021

### Bugfixes

-   Make controls for RTE sticky
-   Use mui-grey-palette for default colors
-   Remove min-width of link buttons (MuiButtonGroup)

### Internal Changes

-   switched from yarn to npm 7 (updated all dependencies)

## [1.2.0] - 22. Jan 2021

### Highlights

-   Add default styles (MUI) to built-in blocktypes
-   Make built-in blocktypes styleable
-   Supports disabled-attribute

### Internal Changes

-   Rename prop-name "customBlockMap" to "blocktypeMap", deprecate prop-name "customBlockMap"
-   Rename prop-name "Icon" to "icon", deprecate prop-name "Icon"

## [1.1.1] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin-rte

## [1.1.1] - 11. Jan 2021

This is a bugfix/maintenance release

## [1.1.0] - 22. Dec 2020

### Changes

-   Add `blockquote` support
