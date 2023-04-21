import { createFolderEntity } from "@comet/cms-api";

import { DamScope } from "../dto/dam-scope";

export const DamFolder = createFolderEntity({ Scope: DamScope });
