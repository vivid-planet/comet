import { BlockContext, BlockDataInterface, isBlockDataInterface } from "@comet/blocks-api";
import { Inject, Injectable } from "@nestjs/common";

import { BLOCKS_MODULE_DEPENDENCY_TRANSFORMERS } from "./blocks.constants";

@Injectable()
export class BlocksTransformerService {
    constructor(@Inject(BLOCKS_MODULE_DEPENDENCY_TRANSFORMERS) private dependencies: Record<string, unknown>) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transformToPlain(block: BlockDataInterface, ctx: BlockContext): Promise<any> {
        const traverse = this.createAsyncTraverse("transformToPlain", [this.dependencies, ctx], isBlockDataInterface);
        return traverse(block);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private createAsyncTraverse(methodName: string, argsArray: any[], isTargetObject: (obj: any) => boolean = () => true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async function traverse(jsonObj: any): Promise<any> {
            if (Array.isArray(jsonObj)) {
                return await Promise.all(jsonObj.map(traverse));
            } else if (jsonObj !== null && typeof jsonObj === "object") {
                const entries = Object.entries(
                    isTargetObject(jsonObj) && typeof jsonObj[methodName] === "function" ? await jsonObj[methodName](...argsArray) : jsonObj,
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedEntries = entries.map(async ([k, i]: [string, any]) => {
                    return [k, await traverse(i)];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any;
                return Object.fromEntries(await Promise.all(mappedEntries));
            } else {
                // keep literal as it is
                return jsonObj;
            }
        };
    }
}
