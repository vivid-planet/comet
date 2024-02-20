import { Options } from "@mikro-orm/core";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";

import ormConfig from "./ormconfig";

require("../auth/permission.interface");

const config: Options = {
    ...ormConfig,
    entities: ["./dist/**/*.entity.js", PageTreeNodeScope],
    entitiesTs: ["./src/**/*.entity.ts", PageTreeNodeScope],
};

export = config;
