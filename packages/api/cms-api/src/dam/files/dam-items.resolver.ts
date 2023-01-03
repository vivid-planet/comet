import { Args, createUnionType, Field, ID, Int, ObjectType, Query, registerEnumType, Resolver } from "@nestjs/graphql";

import { DamItemsService } from "./dam-items.service";
import { DamItemPositionInput, DamItemsArgs } from "./dto/dam-items.args";
import { File } from "./entities/file.entity";
import { Folder } from "./entities/folder.entity";

export const DamItem = createUnionType({
    name: "DamItem",
    types: () => [File, Folder] as const,
});

export enum DamItemTypeLiteral {
    File = "file",
    Folder = "folder",
}
registerEnumType(DamItemTypeLiteral, {
    name: "DamItemTypeLiteral",
});

@ObjectType()
class PaginatedDamItems {
    @Field(() => [DamItem])
    nodes: typeof DamItem[];

    @Field(() => Int)
    totalCount: number;

    constructor(nodes: typeof DamItem[], totalCount: number) {
        this.nodes = nodes;
        this.totalCount = totalCount;
    }
}

@Resolver(() => DamItem)
export class DamItemsResolver {
    constructor(private readonly damItemsService: DamItemsService) {}

    @Query(() => PaginatedDamItems)
    async damItemsList(@Args() args: DamItemsArgs): Promise<PaginatedDamItems> {
        const [damItems, totalCount] = await this.damItemsService.findAndCount(args);
        return new PaginatedDamItems(damItems, totalCount);
    }

    @Query(() => Number)
    async damItemListPosition(
        @Args("id", { type: () => ID }) id: string,
        @Args("type", { type: () => DamItemTypeLiteral }) type: DamItemTypeLiteral,
        @Args("args", { type: () => DamItemPositionInput }) args: DamItemPositionInput,
    ): Promise<number> {
        return this.damItemsService.getDamItemPosition(id, type, args);
    }
}
