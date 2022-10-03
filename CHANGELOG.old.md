**Note: prior to 2.x, packages have been released independently, therefore having separate version numbers and changelogs**

## @comet/admin

### 1.3.0

_Mar 4, 2021_

This is a bugfix/maintenance release.

#### Bugfixes

-   Handle submit error in EditDialog (#209)
-   Pass `innerRef` from `TableBodyRow` to `sc.TableBodyRow`

#### Changes

-   The `styled-components` peer dependency has been changed to `^4.0.0 || ^5.0.0` to include v5.
-   The `graphql` peer dependency has been changed to `^14.0.0 || ^15.0.0` to include v14.

### 1.2.0

_Feb 23, 2021_

#### Highlights

-   RouterPrompt: comet-admin's [react-router Prompt Component](https://reactrouter.com/core/api/Prompt) Wrapper (that adds support for multiple Prompt instances) adds missing message callback parameters for full react-router compatibility

#### Changes

-   TotalCount of the tables Pagination is now formatted with FormattedNumber from react-intl.
-   Switch from Yarn to NPM v7 (updated all dependencies)

### 1.1.0 (re-release under new name)

_Jan 12, 2021_

This package has been renamed to @comet/admin

### 1.1.0

_Jan 11, 2021_

This is a bugfix/maintenance release.

#### Highlights

-   Added migration guide for 1.0 update https://github.com/vivid-planet/comet-admin/blob/master/CHANGELOG.md#migration-guide

#### Bugfixes

-   Render MenuItem in children of Route (#277)
-   Fix ability to open temporary menu (#279)
-   dependency-cleanup (#278)

### 1.0.0

_Dec 18, 2020_

This version is the first stable version.

#### Highlights

-   Renamed from react-admin to comet-admin (!!!)
-   Made comet-admin translatable with react-intl
-   Updated apollo

#### Incompatible Changes

-   Restructured packages:
    -   Consolidated react-admin-core, fetch-provider, file-icons, react-admin-final-form-material-ui, react-admin-form, react-admin-layout and react-admin-mui into comet-admin
    -   Moved react-select to own package comet-admin-react-select
-   Removed date-fns for date formatting in favor of react-intl
-   Removed exports for styled and css, use styled-components directly
-   FinalForm wrappers (e.g. Checkbox, Input, ...) are now prefixed with FinalForm

#### Changes

-   Switched form TSLint to ESLint

#### Migration Guide

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

## @comet/admin-color-picker

### 1.0.2

_Feb 23, 2021_

use fixed version of react-color
Switch from Yarn to NPM v7 (updated all dependencies)

### 1.0.1 (re-release under new name)

_Jan 12, 2021_

This package has been renamed to @comet/admin-color-picker

### 1.0.1

_Jan 11, 2021_

This is a bugfix/maintenance release

### 1.0.0

_Dec 18, 2020_

This version is the first stable version.

## @comet/admin-date-picker

### 1.0.2

_Feb 23, 2021_

Switch from Yarn to NPM v7 (updated all dependencies)

### 1.0.1 (re-release under new name)

_Jan 12, 2021_

This package has been renamed to @comet/admin-date-picker

### 1.0.1

_Jan 11, 2021_

This is a bugfix/maintenance release

### 1.0.0

_Dec 18, 2020_

This version is the first stable version.

## @comet/admin-react-select

### 1.0.2

_Feb 23, 2021_

Switch from Yarn to NPM v7 (updated all dependencies)

### 1.0.1 (re-release under new name)

_Jan 12, 2021_

This package has been renamed to @comet/admin-react-select

### 1.0.1

_Jan 11, 2021_

This is a bugfix/maintenance release

### 1.0.0

_Dec 18, 2020_

This version is the first stable version.

## @comet/admin-rte

### 1.2.1

_Feb 23, 2021_

#### Bugfixes

-   Make controls for RTE sticky
-   Use mui-grey-palette for default colors
-   Remove min-width of link buttons (MuiButtonGroup)

#### Changes

-   Switch from Yarn to NPM v7 (updated all dependencies)

### 1.2.0

_Jan 22, 2021_

#### Highlights

-   Add default styles (MUI) to built-in blocktypes
-   Make built-in blocktypes styleable
-   Supports disabled-attribute

#### Changes

-   Rename prop-name "customBlockMap" to "blocktypeMap", deprecate prop-name "customBlockMap"
-   Rename prop-name "Icon" to "icon", deprecate prop-name "Icon"

### 1.1.1 (re-release under new name)

_Jan 12, 2021_

This package has been renamed to @comet/admin-rte

### 1.1.1

_Jan 11, 2021_

This is a bugfix/maintenance release

### 1.1.0

_Dec 22, 2020_

#### Changes

-   Add `blockquote` support

### 1.0.0

_Dec 18, 2020_

This version is the first stable version.
