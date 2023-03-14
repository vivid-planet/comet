import { RuleTester } from "eslint";

import idAllowListReactIntl from "../idAllowListReactIntl";
export const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            modules: true,
            jsx: true,
        },
    },
});
const options = [{ idWhitelist: ["comet."], defaultPrefix: "comet." }];

ruleTester.run("id-allow-list-react-intl", idAllowListReactIntl, {
    valid: [
        {
            code: `intl.formatMessage({ id: "comet.foo", defaultMessage: "foo" })`,
            options,
        },
        {
            code: `defineMessage({ id: "comet.foo", defaultMessage: "foo" })`,
            options,
        },
        {
            code: `<FormattedMessage id="comet.foo" defaultMessage="foo" />`,
            options,
        },
    ],
    invalid: [
        {
            code: `intl.formatMessage({ id: "foo", defaultMessage: "foo" })`,
            errors: [`id's must be prefixed with "comet."`],
            output: `intl.formatMessage({ id: 'comet.foo', defaultMessage: "foo" })`,
            options,
        },
        {
            code: `defineMessage({ id: "foo", defaultMessage: "foo" })`,
            errors: [`id's must be prefixed with "comet."`],
            output: `defineMessage({ id: 'comet.foo', defaultMessage: "foo" })`,
            options,
        },
        {
            code: `<FormattedMessage id="foo" defaultMessage="foo" />`,
            errors: [`id's must be prefixed with "comet."`],
            output: `<FormattedMessage id="comet.foo" defaultMessage="foo" />`,
            options,
        },
    ],
});
