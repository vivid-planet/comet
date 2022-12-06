import { Args, createUnionType, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { PageInfo } from "../../common/pagination/cursor/page-info";
import { DamItemsService } from "./dam-items.service";
import { DamItemsArgs } from "./dto/dam-items.args";
import { File } from "./entities/file.entity";
import { Folder } from "./entities/folder.entity";

export const DamItem = createUnionType({
    name: "DamItem",
    types: () => [File, Folder] as const,
});

@ObjectType({ isAbstract: true })
export abstract class DamItemEdge {
    @Field(() => String)
    cursor: string;

    @Field(() => DamItem)
    node: typeof DamItem;
}

@ObjectType()
export class PaginatedDamItems {
    @Field(() => [DamItemEdge], { nullable: true })
    edges: DamItemEdge[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    constructor(edges: DamItemEdge[], pageInfo: PageInfo) {
        this.edges = edges;
        this.pageInfo = pageInfo;
    }
}

@Resolver(() => DamItem)
export class DamItemsResolver {
    constructor(private readonly damItemsService: DamItemsService) {}

    @Query(() => PaginatedDamItems)
    async damItemsList(@Args() args: DamItemsArgs): Promise<PaginatedDamItems> {
        return this.damItemsService.findPaginated(args);
    }
}
