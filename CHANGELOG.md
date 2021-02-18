# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0]

### Highlights

-   Added a new InputBase (`CometAdminInputBase`) for use in all custom input-components in Comet 
-   Added `ClearInputButton`, this component can be used as `endAdornment`, to clear inputs
    -   Can be themed with `CometAdminClearInputButton` (props and overrides)
-   New methods of customization and default layout for `Field`
    -   Added theme-augmentation for `FieldContainer`
    -   New `variant` prop to select between vertical and horizontal positioning of label and input
    -   Label is now positioned above input by default (`variant={"vertical"}`)

### Incompatible Changes

-   Replaced form/Input (`VPAdminInputBase`) with form/InputBase (`CometAdminInputBase`)
    -   Deprecated `getDefaultVPAdminInputStyles` because the styled are included in InputBase, which should be used for all custom inputs in Comet
-   Replaced `@comet/admin-date-picker` with `@comet/admin-date-time`
- Usage and default layout of `Field` has changed
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

### Migration Guide

**Package Renaming**

Automatic migrations using codeshift are available (use -d for dry-run):

```angular2html
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/2.0.0/package-renames.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/package-renames.ts src/
```

**Admin-Date-Time Prop Renaming**

Automatic migrations using codeshift are available (use -d for dry-run):

```angular2html
npx jscodeshift --extensions=ts --parser=ts -t comet-admin/codemods/2.0.0/admin-date-time.ts src/
npx jscodeshift --extensions=tsx --parser=tsx -t comet-admin/codemods/2.0.0/admin-date-time.ts src/
```

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
npx jscodeshift -t apollo-client/codemods/ac2-to-ac3/imports.js --extensions ts --parser ts src/
npx jscodeshift -t apollo-client/codemods/ac2-to-ac3/imports.js --extensions tsx --parser tsx src/
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
