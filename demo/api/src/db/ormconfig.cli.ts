import { createFileEntity, createFolderEntity, FileImage } from "@comet/cms-api";
import { Options } from "@mikro-orm/core";
import { DamScope } from "@src/dam/dto/dam-scope";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";

import ormConfig from "./ormconfig";

const Folder = createFolderEntity({ Scope: DamScope });
const File = createFileEntity({ Scope: DamScope, Folder });

const config: Options = {
    ...ormConfig,
    entities: ["./dist/**/*.entity.js", PageTreeNodeScope, File, FileImage, Folder],
    entitiesTs: ["./src/**/*.entity.ts", PageTreeNodeScope, File, FileImage, Folder],
};

export = config;
