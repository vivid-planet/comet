import { Args, createUnionType, Query, Resolver } from "@nestjs/graphql";

import { DamItemsService } from "./dam-items.service";
import { DamItemsArgs, PaginatedDamItems } from "./dto/dam-items.args";
import { File } from "./entities/file.entity";
import { Folder } from "./entities/folder.entity";

export const DamItem = createUnionType({
    name: "DamItem",
    types: () => [File, Folder] as const,
});

@Resolver(() => DamItem)
export class DamItemsResolver {
    constructor(private readonly damItemsService: DamItemsService) {}

    @Query(() => PaginatedDamItems)
    async damItemsList(@Args() args: DamItemsArgs): Promise<PaginatedDamItems> {
        return this.damItemsService.findPaginated(args);
    }
}
