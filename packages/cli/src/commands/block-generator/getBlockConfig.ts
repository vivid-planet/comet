/* eslint-disable no-console */
import { input, select } from "@inquirer/prompts";

import { getFilesContainingFunctionCall, nonEmptyInputValidation } from "./util";

type ChildBlockConfig = {
    name: string;
    type: "block";
    block: string;
};

type ChildTextFieldConfig = {
    name: string;
    type: "textfield";
};

export type CompositeBlockChild = ChildBlockConfig | ChildTextFieldConfig;

type BlockType = "composite" | "list";

export type BlockConfig = {
    name: string;
    type: BlockType;
    children: Array<CompositeBlockChild>;
    targetBlockPath?: string;
};

const blockList = ["RichTextBlock", "DamImageBlock"]; // TODO: Dynamically get all blocks in project

const selectBlock = (): Promise<string> => {
    return select({
        message: "Select a block",
        choices: blockList.map((block) => ({
            name: block,
            value: block,
        })),
    });
};

const addExistingCompositeBlockChild = async (): Promise<CompositeBlockChild> => {
    return {
        name: startStringUpperCase(
            await input({ message: 'Name of child Block (e.g. "Title"', validate: nonEmptyInputValidation("Name cannot be empty") }),
        ),
        type: "block",
        block: await selectBlock(),
    };
};

const addTextFieldChild = async (): Promise<CompositeBlockChild> => {
    return {
        name: startStringUpperCase(await input({ message: "Name of child textField", validate: nonEmptyInputValidation("Name cannot be empty") })),
        type: "textfield",
    };
};

const startStringUpperCase = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const createCompositeBlockConfig = async (blockName: string, targetBlockPath: string | null): Promise<BlockConfig> => {
    const upperCaseBlockName = startStringUpperCase(blockName);
    const childBlocks: Array<CompositeBlockChild> = [];

    let addingChildren = true;

    while (addingChildren) {
        console.log("");
        console.log("");
        console.log("Current block structure:");
        console.log(`-> ${blockName} (Composite)`);
        childBlocks.forEach((child) => {
            console.log(`  -> ${child.name} (${child.type === "block" ? `Block: ${child.block}` : "TextField"})`);
        });
        console.log("");
        console.log("");

        const addChildAction = await select<"addBlock" | "addTextField" | "complete">({
            message: "Add child block or complete the block",
            choices: [
                {
                    name: "Add a child block",
                    value: "addBlock" as const,
                },
                {
                    name: "Add a textfield",
                    value: "addTextField" as const,
                },
                {
                    name: "Complete this block",
                    value: "complete" as const,
                },
            ],
        });

        if (addChildAction === "complete") {
            addingChildren = false;
        } else if (addChildAction === "addBlock") {
            childBlocks.push(await addExistingCompositeBlockChild());
        } else if (addChildAction === "addTextField") {
            childBlocks.push(await addTextFieldChild());
        }
    }

    return {
        type: "composite",
        name: upperCaseBlockName,
        targetBlockPath,
        children: childBlocks,
    };
};

type TargetBlockChioce = {
    name: string;
    value: string | null;
};

const getTargetBlock = async (): Promise<TargetBlockChioce[]> => {
    const targetBlockFiles = getFilesContainingFunctionCall("admin", "createBlocksBlock");

    targetBlockFiles.sort((a, b) => {
        if (a.getBaseNameWithoutExtension() === "PageContentBlock") {
            return -1;
        }

        if (b.getBaseNameWithoutExtension() === "PageContentBlock") {
            return 1;
        }

        return 0;
    });

    return [
        ...targetBlockFiles.map((file) => {
            const filePath = file.getFilePath().replace(`${process.cwd()}/`, "");

            return {
                name: `🟦 ${file.getBaseNameWithoutExtension()} (${filePath})`,
                value: filePath,
            };
        }),
        {
            name: "⛔️ Skip (block will not be added to a blocks-block)",
            value: null,
        },
    ];
};

export const getBlockConfig = async (): Promise<BlockConfig> => {
    const blockName = await input({
        message: 'Block name (e.g. "My Special Teaser")',
        validate: nonEmptyInputValidation("Block name cannot be empty"),
    });

    const targetBlock = await select<string | null>({
        message: "TargetBlock",
        choices: await getTargetBlock(),
    });

    const blockType = await select<BlockType>({
        message: "Block type",
        choices: [
            {
                name: "Composite",
                value: "composite" as const,
            },
            {
                name: "List",
                value: "list" as const,
            },
        ],
    });

    if (blockType === "composite") {
        return createCompositeBlockConfig(blockName, targetBlock);
    }

    throw new Error("Not implemented yet");
};
