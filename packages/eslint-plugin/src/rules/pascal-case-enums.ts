import { pascalCase } from "change-case";
import { Rule } from "eslint";

export default {
    meta: {
        type: "layout",
        docs: {
            description: "Enforce PascalCase for enum names",
        },
        fixable: "code",
        messages: {
            pascalCaseEnumDeclarationMessage: "Enum name should be PascalCase, is: {{name}}, expected: {{pascalCaseName}}",
            pascalCaseEnumMemberMessage: "Enum member name should be PascalCase, is: {{name}}, expected: {{pascalCaseName}}",
            pascalCaseEnumMemberLiteralMessage: "Enum member literal should be PascalCase, is: {{name}}, expected: {{pascalCaseName}}",
        },
    },
    create(context) {
        return {
            "TSEnumDeclaration > Identifier": (identifier) => {
                const name = identifier.name;
                const pascalCaseName = pascalCase(name);

                if (name !== pascalCaseName) {
                    context.report({
                        node: identifier,
                        messageId: "pascalCaseEnumDeclarationMessage",
                        data: {
                            name,
                            pascalCaseName,
                        },
                        fix: function (fixer) {
                            return fixer.replaceText(identifier, pascalCaseName);
                        },
                    });
                }
            },
            "TSEnumMember > Identifier": (identifier) => {
                const name = identifier.name;
                const pascalCaseName = pascalCase(name);

                if (name !== pascalCaseName) {
                    context.report({
                        node: identifier,
                        messageId: "pascalCaseEnumMemberMessage",
                        data: {
                            name,
                            pascalCaseName,
                        },
                        fix: function (fixer) {
                            return fixer.replaceText(identifier, pascalCaseName);
                        },
                    });
                }
            },
            "TSEnumMember > Literal": (literal) => {
                const value = literal.value;
                const pascalCaseValue = pascalCase(value);

                if (value !== pascalCaseValue) {
                    context.report({
                        node: literal,
                        messageId: "pascalCaseEnumMemberLiteralMessage",
                        data: {
                            name: value,
                            pascalCaseName: pascalCaseValue,
                        },
                        fix: function (fixer) {
                            return fixer.replaceText(literal, literal.raw.replace(value, pascalCaseValue));
                        },
                    });
                }
            },
        };
    },
} as Rule.RuleModule;
