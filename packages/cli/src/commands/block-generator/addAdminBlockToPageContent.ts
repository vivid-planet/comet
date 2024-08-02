import fs from "fs";
import jscodeshift from "jscodeshift";

import { FileCreationData } from "./command";
import { BlockConfig } from "./getBlockConfig";
import { getCamelCaseName, getPascalCaseName } from "./util";

export const addAdminBlockToPageContent = (config: BlockConfig): FileCreationData => {
    const pageContentFile = "./admin/src/documents/pages/blocks/PageContentBlock.tsx"; // TODO: Should we look for this file dynamically?

    const fileExists = fs.existsSync(pageContentFile);

    if (!fileExists) {
        throw new Error(`File ${pageContentFile} does not exist`);
    }

    const fileContent = fs.readFileSync(pageContentFile, "utf-8");

    const keyToAddToSupportedBlocks = getCamelCaseName(config.name);
    const valueToAddToSupportedBlocks = `${getPascalCaseName(config.name)}Block`;

    const j = jscodeshift;
    const root = j(fileContent);

    const importDeclaration = j.importDeclaration(
        [j.importSpecifier(j.identifier(valueToAddToSupportedBlocks))],
        j.literal(`@src/common/blocks/${getPascalCaseName(config.name)}Block`),
    );

    const firstImport = root.find(j.ImportDeclaration).at(0);
    if (firstImport.length) {
        firstImport.insertBefore(importDeclaration);
    } else {
        root.get().node.program.body.unshift(importDeclaration);
    }

    root.find(j.VariableDeclarator, {
        id: { name: "PageContentBlock" },
    }).forEach((path) => {
        j(path)
            .find(j.CallExpression, {
                callee: {
                    type: "Identifier",
                    name: "createBlocksBlock",
                },
            })
            .forEach((createBlocksBlockPath) => {
                j(createBlocksBlockPath)
                    .find(j.Property, {
                        key: { type: "Identifier", name: "supportedBlocks" },
                    })
                    .forEach((supportedBlocksPath) => {
                        const supportedBlocksObject = supportedBlocksPath.value.value;
                        // @ts-expect-error IDK
                        supportedBlocksObject.properties.push(
                            j.property("init", j.identifier(keyToAddToSupportedBlocks), j.identifier(valueToAddToSupportedBlocks)),
                        );
                    });
            });
    });

    return {
        filePath: pageContentFile,
        package: "admin",
        content: root.toSource(),
    };
};
