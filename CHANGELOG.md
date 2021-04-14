# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [next]

### Highlights

-   Added a new InputBase (`CometAdminInputBase`) for use in all custom input-components in Comet
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

### Incompatible Changes

-   Replaced form/Input (`VPAdminInputBase`) with form/InputBase (`CometAdminInputBase`)
    -   Deprecated `getDefaultVPAdminInputStyles` because the styled are included in InputBase, which should be used for all custom inputs in Comet
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
