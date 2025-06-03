import { type AnyEntity, type AutoPath, type ObjectQuery, type PopulatePath } from "@mikro-orm/postgresql";

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
        Reflect.defineMetadata(`data:entityInfo`, entityInfo, target);
    };
}
