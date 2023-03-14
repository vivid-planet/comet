# @comet/eslint-plugin-react

## Installation

You will first need to install [ESLint](https://eslint.org/):
`yarn add -D eslint`

Next install `@comet/eslint-plugin-react`

`yarn add -D @comet/eslint-plugin-react`

## Usage

Add `@comet/eslint-plugin-react` to the plugin section of you
`.eslintrc` configuration file. The `eslint-plugin` prefix must be omitted,
it will be resolved by eslint automatically.

```
{
    "plugins": [
         /* other plugins*/
        "@comet/react"
    ]
}
```

Then configure the rules you want to use under the rules section.

```
{
    "rules": {
        "@comet/react/id-allow-list-react-intl": [
            "error",
            {
                "idWhitelist": ["comet\\."],
                "defaultPrefix": "comet."
            }
        ],
    },
}
```

## Supported Rules

-   `id-allow-list-react-intl`

### `id-allow-list-react-intl`

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

This rule reports any id's of `MessageDescriptor` (`defineMessage`, `formatMessage`, `<FormattedMessage />`)of react-intl package that are not whitelisted.

#### Configuration

```
"@comet/react/id-allow-list-react-intl": [
        "error",
        {
            "idWhitelist": ["comet\\."],
            "defaultPrefix": "comet."
        }
    ],
```

#### Rule Details

```
<FormattedMessage id="comet.foo" defaultMessage="foo" /> // ok
<FormattedMessage id="foo" defaultMessage="foo" /> // reported

const message = defineMessage({id: "comet.foo", defaultMessage: "foo" }) // ok
const message = defineMessage({id: "foo", defaultMessage: "foo" }) // reported

const intl = useIntl();

const message = intl.formatMessage({ id: "comet.foo", defaultMessage: "foo" }) // ok
const message2 = intl.formatMessage({ id: "foo", defaultMessage: "foo" }) // reported

```

#### Properties


| Property        | Description                                                                                        | Example                         |
| --------------- |----------------------------------------------------------------------------------------------------| ------------------------------- |
| `idWhitelist`   | An array of strings with regular expressions. This array allows allowlist custom ids for messages. | `"idWhitelist": ["comet\\."]` |
| `defaultPrefix` | If whitelist is not passed, the existing id will be prefixed with this value                       | `"defaultPrefix": "comet."`  |

|
