import { type Rule } from "eslint";

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow string literals in JSX to ensure proper internationalization",
            category: "Best Practices",
            recommended: true,
        },
        messages: {
            noStringLiteralsInJSX: "String literals are not allowed in JSX, use <FormattedMessage> instead",
            noStringConcatenationInJSX: "String concatenation with variables is not allowed, use <FormattedMessage> with values prop instead",
        },
        schema: [], // no options
    },
    create(context) {
        return {
            // Check for JSXText nodes (direct string literals in JSX)
            JSXText(node) {
                const text = node.value.trim();
                if (text.length > 0) {
                    context.report({
                        node,
                        messageId: "noStringLiteralsInJSX",
                    });
                }
            },
            JSXExpressionContainer(node) {
                if (node.expression.type === "Literal" && typeof node.expression.value === "string") {
                    context.report({
                        node,
                        messageId: "noStringLiteralsInJSX",
                    });
                } else if (node.expression.type === "BinaryExpression" && node.expression.operator === "+") {
                    // Check for string concatenation (e.g., {"Text " + variable + " more text"})
                    const hasStringLiteral = checkForStringInBinaryExpression(node.expression);
                    if (hasStringLiteral) {
                        context.report({
                            node,
                            messageId: "noStringConcatenationInJSX",
                        });
                    }
                }
            },
        };
    },
} as Rule.RuleModule;

function checkForStringInBinaryExpression(node) {
    if (node.type === "Literal" && typeof node.value === "string") {
        return true;
    }

    if (node.type === "BinaryExpression") {
        return checkForStringInBinaryExpression(node.left) || checkForStringInBinaryExpression(node.right);
    }

    return false;
}
