import { type Rule } from "eslint";
import path from "path";

export default {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "array",
                description: "List of private sibling file extensions, defaults to gql, sc",
                items: {
                    type: "string",
                },
            },
        ],
    },
    create(context) {
        return {
            ImportDeclaration: function (node) {
                const optionSiblingExtensions = context.options[0] ?? ["gql", "sc"];
                const filePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
                if (filePath == "<text>") return; // If the input is from stdin, this test can't fail
                const isPrivateFileMatch = String(node.source.value).match(new RegExp(`^(.*)\\.(${optionSiblingExtensions.join("|")})$`));
                if (isPrivateFileMatch) {
                    if (!isPrivateFileMatch[1].startsWith("./")) {
                        context.report({
                            node,
                            message: "Import private siblings always with relative imports",
                        });
                    } else {
                        if (isPrivateFileMatch[1] != `./${path.basename(filePath).replace(/\.(.*)$/, "")}`) {
                            context.report({
                                node,
                                message: "Avoid private sibling import from other files",
                            });
                        }
                    }
                }
            },
        };
    },
} as Rule.RuleModule;
