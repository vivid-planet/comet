import { type AnyEntity, type AutoPath, type ObjectQuery, type PopulatePath } from "@mikro-orm/postgresql";

export const ENTITY_INFO_METADATA_KEY = "data:entityInfo";

export type EntityInfo<Entity> =
    | {
          name: AutoPath<Entity, PopulatePath.ALL>;
          secondaryInformation?: AutoPath<Entity, PopulatePath.ALL>;
          visible?: ObjectQuery<Entity>;
      }
    | string;

export function EntityInfo<Entity extends AnyEntity = AnyEntity>(entityInfo: EntityInfo<Entity>): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return (target: Function) => {
        Reflect.defineMetadata(ENTITY_INFO_METADATA_KEY, entityInfo, target);
    };
}
