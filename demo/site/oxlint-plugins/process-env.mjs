const docsLink = "https://cms-docs.dextinity.com/docs/faqs/environment-variables-in-site";

/**
 * @param {import("eslint").Rule.Node} node
 */
function isProcessEnvMember(node) {
    return (
        node.object.type === "MemberExpression" &&
        node.object.object.type === "Identifier" &&
        node.object.object.name === "process" &&
        node.object.property.type === "Identifier" &&
        node.object.property.name === "env"
    );
}

/**
 * Replaces the `no-restricted-syntax` rules that Oxlint doesn't support. The rule API is the ESLint one, which Oxlint
 * implements for JS plugins.
 */
const plugin = {
    meta: {
        name: "process-env",
    },
    rules: {
        "no-next-public-env": {
            meta: {
                type: "problem",
            },
            create(context) {
                return {
                    MemberExpression(node) {
                        if (isProcessEnvMember(node) && node.property.type === "Identifier" && node.property.name.startsWith("NEXT_PUBLIC_")) {
                            context.report({
                                node,
                                message: `Usage of process.env.NEXT_PUBLIC_* is not allowed. Use site configs or a custom provider instead. See ${docsLink}`,
                            });
                        }
                    },
                };
            },
        },
        "no-process-env": {
            meta: {
                type: "problem",
            },
            create(context) {
                return {
                    MemberExpression(node) {
                        if (isProcessEnvMember(node)) {
                            context.report({
                                node,
                                message: `Usage of process.env in next.config is not allowed. Use site configs or runtime configuration instead. See ${docsLink}`,
                            });
                        }
                    },
                };
            },
        },
    },
};

export default plugin;
