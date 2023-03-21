import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";

export const isFile = (item: GQLDamFileTableFragment | GQLDamFolderTableFragment): item is GQLDamFileTableFragment => item.__typename === "DamFile";
