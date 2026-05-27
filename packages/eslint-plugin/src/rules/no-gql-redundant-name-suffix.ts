import { type Rule } from "eslint";

const KIND_TO_SUFFIX = {
    fragment: "Fragment",
    query: "Query",
    mutation: "Mutation",
    subscription: "Subscription",
} as const;
type Kind = keyof typeof KIND_TO_SUFFIX;

const KIND_NAME_REGEX = /\b(fragment|query|mutation|subscription)\s+(\w+)/g;

export default {
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow GraphQL fragment, query, mutation, and subscription names that end with their own kind (e.g., `FooFragment`, `BarQuery`). GraphQL code generation appends the kind to the generated type name, which would otherwise produce duplicated suffixes such as `FragmentFragment` or `QueryQuery`.",
        },
        schema: [],
        messages: {
            redundantSuffix:
                "GraphQL {{kind}} name '{{name}}' must not end with '{{suffix}}'. Code generation appends '{{suffix}}' to the type name, which would result in a duplicated '{{suffix}}{{suffix}}' suffix.",
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

                    KIND_NAME_REGEX.lastIndex = 0;
                    let match: RegExpExecArray | null;
                    while ((match = KIND_NAME_REGEX.exec(text)) !== null) {
                        const kind = match[1] as Kind;
                        const name = match[2];
                        const suffix = KIND_TO_SUFFIX[kind];
                        if (!name.endsWith(suffix)) continue;

                        const nameOffsetInMatch = match[0].lastIndexOf(name);
                        const start = sourceCode.getLocFromIndex(textStartIndex + match.index + nameOffsetInMatch);
                        const end = sourceCode.getLocFromIndex(textStartIndex + match.index + nameOffsetInMatch + name.length);

                        context.report({
                            loc: { start, end },
                            messageId: "redundantSuffix",
                            data: { kind, name, suffix },
                        });
                    }
                }
            },
        };
    },
} as Rule.RuleModule;
