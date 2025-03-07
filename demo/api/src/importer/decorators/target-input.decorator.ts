import { FilterQuery } from "@mikro-orm/core";

import { ImporterInputClass } from "../importer-input.type";
import { PipeData } from "../pipes/importer-pipe.type";

export type PreProcessor = (inputData: PipeData) => Record<string, unknown>;
export type PreProcessorMap = Record<string, PreProcessor>;
export type GetFindConditionCallback = (pipeData: PipeData, additionalData?: Record<string, unknown>) => FilterQuery<object>;
interface Options {
    recordProcessors?: PreProcessorMap;
    getFindCondition?: GetFindConditionCallback;
}
export interface TargetInputMetadata extends Options {
    name: string;
}
export function TargetInput(options: Options = {}): ClassDecorator {
    const { recordProcessors, getFindCondition } = options;
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        const metadata: TargetInputMetadata = { name: target.name, recordProcessors, getFindCondition };
        Reflect.defineMetadata(`data:TargetInput`, metadata, target);
    };
}
export const getTargetInputMetadata = (input: ImporterInputClass) => {
    const reflectMetadata: TargetInputMetadata = Reflect.getOwnMetadata(`data:TargetInput`, input);
    return reflectMetadata;
};
