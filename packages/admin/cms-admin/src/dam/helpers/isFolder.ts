import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";

export const isFolder = (item: GQLDamFileTableFragment | GQLDamFolderTableFragment): item is GQLDamFolderTableFragment =>
    item.__typename === "DamFolder";
