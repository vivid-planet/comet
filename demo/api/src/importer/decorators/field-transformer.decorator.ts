import { ImporterEntityClass } from "../entities/base-import-target.entity";

export interface FieldTransformerData {
    key: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformFieldCallback: (input: string) => string;
}

const metadataKey = "fieldTransformer";

/**
 * Decorator to add a callback function to modify the value before assigning it to the entity property
 *
 * @param {function} transformFieldCallback - callback function to modify the value before assigning it to the entity property
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FieldTransformer = (transformFieldCallback: (input: any) => any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, key: string) {
        const fieldTransformer: FieldTransformerData[] =
            Reflect.getOwnMetadata(metadataKey, target.constructor) || (Reflect.getMetadata(metadataKey, target.constructor) || []).slice(0);
        fieldTransformer.push({ key, transformFieldCallback });
        Reflect.defineMetadata(metadataKey, fieldTransformer, target.constructor);
    };
};

export const getFieldTransformers = (entity: ImporterEntityClass): FieldTransformerData[] => {
    return Reflect.getOwnMetadata(metadataKey, entity);
};
