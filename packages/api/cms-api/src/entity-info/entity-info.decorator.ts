import type { AnyEntity, AutoPath, ObjectQuery, PopulatePath } from "@mikro-orm/postgresql";

import type { Permission } from "../user-permissions/user-permissions.types";

export const ENTITY_INFO_METADATA_KEY = "data:entity-info";

export type EntityInfoSql = {
    sql: string;
    requiredPermission?: Permission | Permission[];
};

export type EntityInfo<Entity> =
    | {
          name: AutoPath<Entity, PopulatePath.ALL> | string;
          secondaryInformation?: AutoPath<Entity, PopulatePath.ALL> | string;
          visible?: ObjectQuery<Entity>;
          fullText?: keyof Entity & string;
          requiredPermission?: Permission | Permission[];
      }
    | EntityInfoSql
    | string;

export function EntityInfo<Entity extends AnyEntity = AnyEntity>(entityInfo: EntityInfo<Entity>): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return (target: Function) => {
        Reflect.defineMetadata(ENTITY_INFO_METADATA_KEY, entityInfo, target);
    };
}
