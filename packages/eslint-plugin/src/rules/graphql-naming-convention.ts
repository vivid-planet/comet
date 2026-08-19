import { type Rule } from "eslint";

const defaultTags = ["gql", "graphql"];
const defaultOperationForbiddenSuffixes = ["Query", "Mutation", "Subscription"];
const defaultFragmentForbiddenSuffixes = ["Fragment"];

const operationPattern = /(?<=^|[\s{}])(query|mutation|subscription)\s+([_A-Za-z][_0-9A-Za-z]*)/g;
const fragmentPattern = /(?<=^|[\s{}])fragment\s+([_A-Za-z][_0-9A-Za-z]*)/g;

/**
 * Blanks out `#` comments and string values, so that names inside them aren't mistaken for definitions.
 */
function stripCommentsAndStrings(document: string) {
    return document.replace(/"""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|#[^\n]*/g, (match) => " ".repeat(match.length));
}

function findForbiddenSuffix(name: string, forbiddenSuffixes: string[]) {
    return forbiddenSuffixes.find((suffix) => name.length > suffix.length && name.endsWith(suffix));
}

/**
 * `pattern` must have the global flag. Its `lastIndex` is reset, so that the pattern can be shared between calls.
 */
function findMatches(pattern: RegExp, document: string) {
    const matches: RegExpExecArray[] = [];
    pattern.lastIndex = 0;
    let match = pattern.exec(document);
    while (match) {
        matches.push(match);
        match = pattern.exec(document);
    }
    return matches;
}

/**
 * Replacement for `@graphql-eslint/naming-convention` with `forbiddenSuffixes`, which can't be used with Oxlint:
 * it needs an ESLint processor to extract the GraphQL documents from `gql` template literals and Oxlint has no
 * processors.
 *
 * Instead of parsing the document, this rule scans the template literal for operation and fragment definitions.
 */
export default {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    tags: {
                        type: "array",
                        description: "Names of the template literal tags holding GraphQL documents, defaults to gql, graphql",
                        items: {
                            type: "string",
                        },
                    },
                    operationForbiddenSuffixes: {
                        type: "array",
                        description: "Forbidden suffixes for operation names, defaults to Query, Mutation, Subscription",
                        items: {
                            type: "string",
                        },
                    },
                    fragmentForbiddenSuffixes: {
                        type: "array",
                        description: "Forbidden suffixes for fragment names, defaults to Fragment",
                        items: {
                            type: "string",
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] ?? {};
        const tags: string[] = options.tags ?? defaultTags;
        const operationForbiddenSuffixes: string[] = options.operationForbiddenSuffixes ?? defaultOperationForbiddenSuffixes;
        const fragmentForbiddenSuffixes: string[] = options.fragmentForbiddenSuffixes ?? defaultFragmentForbiddenSuffixes;

        return {
            TaggedTemplateExpression: function (node) {
                const { tag } = node;
                let tagName: string | undefined;
                if (tag.type === "Identifier") {
                    tagName = tag.name;
                } else if (tag.type === "MemberExpression" && tag.property.type === "Identifier") {
                    // Supports namespaced tags such as `graphql.experimental`.
                    tagName = tag.property.name;
                }
                if (!tagName || !tags.includes(tagName)) {
                    return;
                }

                // Interpolations are replaced by a space: a definition name is never interpolated.
                const document = stripCommentsAndStrings(node.quasi.quasis.map((quasi) => quasi.value.raw).join(" "));

                for (const [, keyword, name] of findMatches(operationPattern, document)) {
                    const forbiddenSuffix = findForbiddenSuffix(name, operationForbiddenSuffixes);
                    if (forbiddenSuffix) {
                        context.report({
                            node: node.quasi,
                            message: `Forbidden suffix "${forbiddenSuffix}" in ${keyword} name "${name}"`,
                        });
                    }
                }

                for (const [, name] of findMatches(fragmentPattern, document)) {
                    const forbiddenSuffix = findForbiddenSuffix(name, fragmentForbiddenSuffixes);
                    if (forbiddenSuffix) {
                        context.report({
                            node: node.quasi,
                            message: `Forbidden suffix "${forbiddenSuffix}" in fragment name "${name}"`,
                        });
                    }
                }
            },
        };
    },
} as Rule.RuleModule;
