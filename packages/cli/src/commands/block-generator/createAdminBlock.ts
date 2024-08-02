import { FileCreationData } from "./command";
import { BlockConfig, CompositeBlockChild } from "./getBlockConfig";
import { getCamelCaseName, getPascalCaseName } from "./util";

export const createBlockAdmin = (blockConfig: BlockConfig): FileCreationData => {
    const camelCaseName = getCamelCaseName(blockConfig.name);
    const pascalCaseName = getPascalCaseName(blockConfig.name);

    return {
        filePath: `./admin/src/common/blocks/${pascalCaseName}Block.tsx`,
        package: "admin",
        content: `import { BlockCategory, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";
import React from "react";

${/* TOOD: Import blocks dynamically somehow */ ""}
import { DamImageBlock } from "@comet/cms-admin";
import { RichTextBlock } from "./RichTextBlock";

export const ${pascalCaseName}Block = createCompositeBlock({
    name: "${pascalCaseName}",
    displayName: <FormattedMessage id="${camelCaseName}.displayName" defaultMessage="${blockConfig.name}" />,
    category: BlockCategory.TextAndContent, ${/* TODO: Ask this when building config */ ""}
    blocks: {
        ${blockConfig.children.map((child) => getChildBlockCode(child, camelCaseName)).join(",\n")}
    },
});
`,
    };
};

const getChildBlockCode = (child: CompositeBlockChild, parentBlockCamelCaseName: string) => {
    const camelCaseName = getCamelCaseName(child.name);

    let keyContent = "";

    const blockTitleFormattedMessage = `<FormattedMessage id="${parentBlockCamelCaseName}.${camelCaseName}" defaultMessage="${child.name}" />`;

    if (child.type === "textfield") {
        keyContent = `block: createCompositeBlockTextField({
                fieldProps: { label: ${blockTitleFormattedMessage}, fullWidth: true },
            }),`;
    } else if (child.type === "block") {
        keyContent = `block: ${child.block}, title: ${blockTitleFormattedMessage}`;
    }

    return `${camelCaseName}: {
        ${keyContent}
    }`;
};
