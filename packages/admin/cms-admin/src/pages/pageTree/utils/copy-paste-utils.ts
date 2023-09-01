import cloneDeep from "lodash.clonedeep";

type BlockJsonValue = BlockJsonObject | BlockJsonArray | string | boolean | number;

type BlockJsonObject = {
    [key: string]: BlockJsonValue;
};

type BlockJsonArray = Array<BlockJsonValue>;

type BlockJsonInput = BlockJsonObject | BlockJsonArray;

const findTargetBlockByJsonPath = (input: BlockJsonInput, jsonPath: string[]): BlockJsonInput => {
    let objectRef: BlockJsonInput = input;

    for (const segment of jsonPath) {
        if (Array.isArray(objectRef)) {
            // since the jsonPath points to the block that uses the id,
            // all values on the way must be arrays or objects
            objectRef = objectRef[Number(segment)] as BlockJsonInput;
        } else {
            // is always array or object (see above)
            objectRef = objectRef[segment] as BlockJsonInput;
        }
    }

    return objectRef;
};

const findAndReplaceValueInTargetBlock = (inputRef: BlockJsonInput, { oldValue, newValue }: { oldValue: string; newValue: string }): void => {
    for (const key of Object.keys(inputRef)) {
        let typedKey: string | number = key;
        if (Array.isArray(inputRef)) {
            typedKey = Number(key);
        }
        // The key is typed correctly in the if above
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const currentValue = inputRef[typedKey] as BlockJsonValue;

        if (Array.isArray(currentValue) || typeof currentValue === "object") {
            findAndReplaceValueInTargetBlock(currentValue, { oldValue, newValue });
        } else {
            if (currentValue === oldValue) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                inputRef[typedKey] = newValue;
            }
        }
    }
};

export const replaceNestedIdInBlockJson = (
    input: Record<string, unknown>,
    jsonPathArr: string[],
    values: { oldValue: string; newValue: string },
): BlockJsonInput => {
    const deepClonedInput = cloneDeep(input) as BlockJsonInput;

    const targetBlock = findTargetBlockByJsonPath(deepClonedInput, jsonPathArr);
    findAndReplaceValueInTargetBlock(targetBlock, values);

    return deepClonedInput;
};
