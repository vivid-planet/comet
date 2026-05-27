import { type Rule } from "eslint";

const FRAGMENT_NAME_REGEX = /\bfragment\s+(\w*Fragment)\b/g;

export default {
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow GraphQL fragment names ending with 'Fragment'. GraphQL code generation appends 'Fragment' to the generated type, which would otherwise produce duplicated 'FragmentFragment' type names.",
        },
        schema: [],
        messages: {
            fragmentSuffix:
                "GraphQL fragment name '{{name}}' must not end with 'Fragment'. Code generation appends 'Fragment' to the type name, which would result in a duplicated 'FragmentFragment' suffix.",
        },
    },
    create(context) {
        function isGqlTag(tag: Rule.Node): boolean {
            if (tag.type === "Identifier") {
                return tag.name === "gql" || tag.name === "graphql";
            }
            if (tag.type === "MemberExpression" && tag.property.type === "Identifier") {
                return tag.property.name === "gql" || tag.property.name === "graphql";
            }
            return false;
        }

        const sourceCode = context.sourceCode ?? context.getSourceCode();

        return {
            TaggedTemplateExpression(node) {
                if (!isGqlTag(node.tag as Rule.Node)) return;

                for (const quasi of node.quasi.quasis) {
                    const text = quasi.value.cooked ?? quasi.value.raw;
                    if (!text || !quasi.range) continue;

                    // quasi.range[0] points to the opening "`" or "}" character; the cooked text starts one character later.
                    const textStartIndex = quasi.range[0] + 1;

                    FRAGMENT_NAME_REGEX.lastIndex = 0;
                    let match: RegExpExecArray | null;
                    while ((match = FRAGMENT_NAME_REGEX.exec(text)) !== null) {
                        const fragmentName = match[1];
                        const nameOffsetInMatch = match[0].lastIndexOf(fragmentName);
                        const start = sourceCode.getLocFromIndex(textStartIndex + match.index + nameOffsetInMatch);
                        const end = sourceCode.getLocFromIndex(textStartIndex + match.index + nameOffsetInMatch + fragmentName.length);

                        context.report({
                            loc: { start, end },
                            messageId: "fragmentSuffix",
                            data: { name: fragmentName },
                        });
                    }
                }
            },
        };
    },
} as Rule.RuleModule;
