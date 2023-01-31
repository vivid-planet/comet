import { Type } from "@nestjs/common";
import { Args, createUnionType, Field, Int, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { DamItemsService } from "./dam-items.service";
import { DamItemsArgs } from "./dto/dam-items.args";
import { FileInterface } from "./entities/file.entity";
import { FolderInterface } from "./entities/folder.entity";

export type DamItemInterface = FileInterface | FolderInterface;

export function createDamItemsResolver({ File, Folder }: { File: Type<FileInterface>; Folder: Type<FolderInterface> }): Type<unknown> {
    const DamItem = createUnionType({
        name: "DamItem",
        types: () => [File, Folder] as const,
    });

    @ObjectType()
    class PaginatedDamItems {
        @Field(() => [DamItem])
        nodes: DamItemInterface[];

        @Field(() => Int)
        totalCount: number;

        constructor(nodes: DamItemInterface[], totalCount: number) {
            this.nodes = nodes;
            this.totalCount = totalCount;
        }
    }

    @Resolver(() => DamItem)
    class DamItemsResolver {
        constructor(private readonly damItemsService: DamItemsService) {}

        @Query(() => PaginatedDamItems)
        async damItemsList(@Args() args: DamItemsArgs): Promise<PaginatedDamItems> {
            const [damItems, totalCount] = await this.damItemsService.findAndCount(args);
            return new PaginatedDamItems(damItems, totalCount);
        }
    }

    return DamItemsResolver;
}
