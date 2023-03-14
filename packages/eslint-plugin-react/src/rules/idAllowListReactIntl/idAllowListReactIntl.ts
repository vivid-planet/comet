import { TSESTree } from "@typescript-eslint/typescript-estree";
import { Rule } from "eslint";

import { extractMessages, getSettings } from "../../utils/formatJs.util";

interface Options {
    idWhiteList?: string[];
    defaultPrefix?: string;
}

function checkNode(context: Rule.RuleContext, node: TSESTree.Node, options: Options) {
    const idWhitelistRegexps = options.idWhiteList?.map((str: string) => new RegExp(str, "i")) ?? [];
    const msgs = extractMessages(node, getSettings(context));

    for (const [
        {
            idPropNode,
            message: { id },
        },
    ] of msgs) {
        if (id && idWhitelistRegexps.some((r: RegExp) => r.test(id))) {
            // messageId is allowListed so skip interpolation id check
            return;
        }

        const correctId = `${options.defaultPrefix}${id}`;

        context.report({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            node: idPropNode as any,
            message: `id's must be prefixed with "${options.idWhiteList}"`,
            fix(fixer) {
                if (idPropNode) {
                    if (idPropNode.type === "JSXAttribute") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return fixer.replaceText(idPropNode as any, `id="${correctId}"`);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return fixer.replaceText(idPropNode as any, `id: '${correctId}'`);
                }
                return null;
            },
        });
    }
}

export default {
    meta: {
        type: "problem",
        docs: {
            description: "Id Allow List for MessageDescriptor for react-intl",
            category: "Errors",
            recommended: false,
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    idWhitelist: {
                        type: "array",
                        description: "An array of strings with regular expressions. This array allows allow list custom ids for messages. ",
                        items: {
                            type: "string",
                        },
                    },
                    defaultPrefix: {
                        type: "string",
                        description: "Default Prefix which will be auto fixed if no whitelist match can be found",
                    },
                },
                required: ["idWhitelist", "defaultPrefix"],
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options: Options = {};
        const tmp = context?.options?.[0];
        if (Array.isArray(tmp?.idWhitelist)) {
            const { idWhitelist, defaultPrefix } = tmp;
            options.idWhiteList = idWhitelist;
            options.defaultPrefix = defaultPrefix;
        }

        const callExpressionVisitor = (node: TSESTree.Node) => checkNode(context, node, options);

        if (context.parserServices.defineTemplateBodyVisitor) {
            return context.parserServices.defineTemplateBodyVisitor(
                {
                    CallExpression: callExpressionVisitor,
                },
                {
                    CallExpression: callExpressionVisitor,
                },
            );
        }
        return {
            JSXOpeningElement: (node: TSESTree.Node) => checkNode(context, node, options),
            CallExpression: callExpressionVisitor,
        };
    },
} as Rule.RuleModule;
