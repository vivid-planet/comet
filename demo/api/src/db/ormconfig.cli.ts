import { UserContentScopes } from "@comet/cms-api/lib/user-permissions/entities/user-content-scopes.entity";
import { UserPermission } from "@comet/cms-api/lib/user-permissions/entities/user-permission.entity";
import { Options } from "@mikro-orm/core";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";

import ormConfig from "./ormconfig";

const config: Options = {
    ...ormConfig,
    entities: ["./dist/**/*.entity.js", PageTreeNodeScope, UserPermission, UserContentScopes],
    entitiesTs: ["./src/**/*.entity.ts", PageTreeNodeScope, UserPermission, UserContentScopes],
};

export = config;
