import { BlockContext, BlockDataInterface, BlockTransformerService, isBlockDataInterface } from "@comet/blocks-api";
import { ModuleRef } from "@nestjs/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transformToPlain(block: BlockDataInterface, dependencies: any, ctx: BlockContext, moduleRef: ModuleRef): Promise<any> {
    return tracer.startActiveSpan("BlockTransformer", async (span) => {
        const traverse = createAsyncTraverse("transformToPlain", [dependencies, ctx], isBlockDataInterface, moduleRef);
        // TODO is await correct here?
        const ret = await traverse(block);
        span.end();
        return ret;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAsyncTraverse(methodName: string, argsArray: any[], isTargetObject: (obj: any) => boolean = () => true, moduleRef: ModuleRef) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function traverse(jsonObj: any): Promise<any> {
        if (Array.isArray(jsonObj)) {
            return Promise.all(jsonObj.map(traverse));
        } else if (jsonObj !== null && typeof jsonObj === "object") {
            const object = isTargetObject(jsonObj) && typeof jsonObj[methodName] === "function" ? await jsonObj[methodName](...argsArray) : jsonObj;
            const mappedEntries = Reflect.ownKeys(object).map(async (key) => {
                const value = object[key];
                const returnValue = await traverse(value);

                if (typeof returnValue === "object" && returnValue !== null && BlockTransformerService in returnValue) {
                    const service = await moduleRef.get(returnValue[BlockTransformerService], { strict: false });
                    // TODO fix context
                    return [key, await service.transformToPlain(value, argsArray[1])];
                }

                return [key, returnValue];
            });
            return (await Promise.all(mappedEntries)).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        } else {
            // keep literal as it is
            return jsonObj;
        }
    };
}
