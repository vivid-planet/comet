import { type Rule } from "eslint";

export default {
    meta: {
        type: "problem",
        docs: {
            description: "Disallow /lib imports from @comet/ packages",
        },
        fixable: "code",
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value;

                if (typeof source !== "string") {
                    return;
                }

                // Check if the import is from a @comet/ package with /lib in the path
                const match = source.match(/^(@comet\/[^/]+)\/lib(?:\/(.*))?$/);

                if (match) {
                    const packageName = match[1];
                    const remainingPath = match[2];

                    // Suggest the corrected import path (without /lib)
                    const suggestedImport = remainingPath ? `${packageName}/${remainingPath}` : packageName;

                    context.report({
                        node,
                        message: `Do not import from /lib of @comet packages. Import from "${suggestedImport}" instead.`,
                        fix(fixer) {
                            return fixer.replaceText(node.source, `"${suggestedImport}"`);
                        },
                    });
                }
            },
        };
    },
} as Rule.RuleModule;
