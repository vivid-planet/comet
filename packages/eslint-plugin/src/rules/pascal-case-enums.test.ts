import { RuleTester } from "eslint";

import pascalCaseEnums from "./pascal-case-enums";

const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
});

const validCode = 'enum ProductVariant {  LightBlue = "LightBlue",}';

ruleTester.run("pascal-case-enums", pascalCaseEnums, {
    valid: [
        {
            code: validCode,
        },
    ],
    invalid: [
        // TSEnumDeclaration > Identifier
        {
            code: 'enum productVariant {  LightBlue = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum name should be PascalCase, is: productVariant, expected: ProductVariant",
                },
            ],
        },
        {
            code: 'enum PRODUCT_VARIANT {  LightBlue = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum name should be PascalCase, is: PRODUCT_VARIANT, expected: ProductVariant",
                },
            ],
        },
        {
            code: 'enum product_variant {  LightBlue = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum name should be PascalCase, is: product_variant, expected: ProductVariant",
                },
            ],
        },
        // TSEnumMember > Identifier
        {
            code: 'enum ProductVariant {  lightBlue = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member name should be PascalCase, is: lightBlue, expected: LightBlue",
                },
            ],
        },
        {
            code: 'enum ProductVariant {  LIGHT_BLUE = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member name should be PascalCase, is: LIGHT_BLUE, expected: LightBlue",
                },
            ],
        },
        {
            code: 'enum ProductVariant {  light_blue = "LightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member name should be PascalCase, is: light_blue, expected: LightBlue",
                },
            ],
        },
        // TSEnumMember > Literal
        {
            code: 'enum ProductVariant {  LightBlue = "lightBlue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member literal should be PascalCase, is: lightBlue, expected: LightBlue",
                },
            ],
        },
        {
            code: 'enum ProductVariant {  LightBlue = "LIGHT_BLUE",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member literal should be PascalCase, is: LIGHT_BLUE, expected: LightBlue",
                },
            ],
        },
        {
            code: 'enum ProductVariant {  LightBlue = "light_blue",}',
            output: validCode,
            errors: [
                {
                    message: "Enum member literal should be PascalCase, is: light_blue, expected: LightBlue",
                },
            ],
        },
    ],
});
