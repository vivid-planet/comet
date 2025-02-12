import { FilterQuery } from "@mikro-orm/core";

import { ImporterEntityClass } from "../entities/base-target.entity";
import { PipeData } from "../pipes/importer-pipe.type";

export type PreProcessor = (inputData: PipeData) => Record<string, unknown>;
export type PreProcessorMap = Record<string, PreProcessor>;
export type GetFindConditionCallback = (pipeData: PipeData, additionalData?: Record<string, unknown>) => FilterQuery<object>;
interface Options {
    recordProcessors?: PreProcessorMap;
    getFindCondition?: GetFindConditionCallback;
}
export interface TargetEntityMetadata extends Options {
    name: string;
}
export function TargetEntity(options: Options = {}): ClassDecorator {
    const { recordProcessors, getFindCondition } = options;
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        const metadata: TargetEntityMetadata = { name: target.name, recordProcessors, getFindCondition };
        Reflect.defineMetadata(`data:TargetEntity`, metadata, target);
    };
}
export const getTargetEntityMetadata = (entity: ImporterEntityClass) => {
    const reflectMetadata: TargetEntityMetadata = Reflect.getOwnMetadata(`data:TargetEntity`, entity);
    return reflectMetadata;
};
