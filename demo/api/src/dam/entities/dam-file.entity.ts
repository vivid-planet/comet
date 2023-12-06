import { createFileEntity } from "@comet/cms-api";

import { DamScope } from "../dto/dam-scope";
import { DamFolder } from "./dam-folder.entity";

export const DamFile = createFileEntity({ Scope: DamScope, Folder: DamFolder });
