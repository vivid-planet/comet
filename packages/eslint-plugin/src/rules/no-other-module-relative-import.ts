import { Rule } from "eslint";
import path from "path";

function parentDirCount(dir: string) {
    const match = dir.match(/^(\.\.\/)*/);
    return match[0].length / 3;
}

export default {
    meta: {
        type: "suggestion",
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    sourceRoot: {
                        type: "string",
                    },
                    sourceRootAlias: {
                        type: "string",
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        return {
            ImportDeclaration: function (node) {
                const options = context.options[0] ?? { sourceRoot: "./src", sourceRootAlias: "@src" };

                const importParentDirCount = parentDirCount(node.source.value.toString());
                if (!importParentDirCount) return;

                const filePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
                if (filePath == "<text>") return; // If the input is from stdin, this test can't fail
                const sourceDir = `${context.getCwd()}/${options.sourceRoot}`;

                const fileDir = path.dirname(filePath);

                const relative = path.relative(sourceDir, fileDir);
                const fileIsInSourceDir = relative && !relative.startsWith("..") && !path.isAbsolute(relative);
                if (!fileIsInSourceDir) return;

                const relativeDirCount = relative.split(path.sep).length;

                if (importParentDirCount >= relativeDirCount) {
                    context.report({
                        node,
                        message: "Avoid relative import from other module",
                        fix: (fixer) => {
                            const importPathRelativeToSourceDir = path.relative(sourceDir, `${fileDir}/${node.source.value.toString()}`);
                            return fixer.replaceText(node.source, `"${options.sourceRootAlias}/${importPathRelativeToSourceDir}"`);
                        },
                    });
                }
            },
        };
    },
} as Rule.RuleModule;
