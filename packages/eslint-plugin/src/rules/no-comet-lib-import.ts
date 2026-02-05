import { type Rule } from "eslint";

const COMET_LIB_IMPORT = /^@comet\/[^/]+\/lib(?:\/|$)/;

export default {
    meta: {
        type: "problem",
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (typeof node.source.value !== "string") {
                    return;
                }

                if (!COMET_LIB_IMPORT.test(node.source.value)) {
                    return;
                }

                context.report({
                    node,
                    message: "Avoid importing from @comet packages via /lib. Use the package root instead.",
                });
            },
        };
    },
} as Rule.RuleModule;
