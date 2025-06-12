// filepath: /Users/manuelblum/Developer/comet/next/packages/eslint-plugin/src/rules/no-jsx-string-literals.test.ts
import { RuleTester } from "eslint";

import noJsxStringLiterals from "./no-jsx-string-literals";

// Configure a simple RuleTester using flat config format
const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run("no-jsx-string-literals", noJsxStringLiterals, {
    valid: [
        {
            code: '<div><FormattedMessage id="test" defaultMessage="Hello" /></div>',
        },
        {
            code: "<div>{variable}</div>",
        },
        {
            code: "<div>{true}</div>",
        },
        {
            code: '<FormattedMessage defaultMessage="Die Bestell-Summe beträgt {price}" values={{ price: <FormattedNumber value={70} /> }} />',
        },
    ],
    invalid: [
        {
            code: "<div>Hello World</div>",
            errors: [{ messageId: "noStringLiteralsInJSX" }],
        },
        {
            code: "<div>{'Hello World'}</div>",
            errors: [{ messageId: "noStringLiteralsInJSX" }],
        },
        {
            code: '<div>{"Page " + currentPage + " of " + totalPages}</div>',
            errors: [{ messageId: "noStringConcatenationInJSX" }],
        },
        {
            code: "<div>Hello {name}</div>",
            errors: [{ messageId: "noStringLiteralsInJSX" }],
        },
    ],
});
