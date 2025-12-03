import { type GQLDamFileTableFragment, type GQLDamFolderTableFragment } from "../DataGrid/FolderDataGrid";

export const isFile = (item: GQLDamFileTableFragment | GQLDamFolderTableFragment): item is GQLDamFileTableFragment => item.__typename === "DamFile";
