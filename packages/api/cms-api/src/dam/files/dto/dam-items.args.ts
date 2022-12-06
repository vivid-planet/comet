import { ArgsType, Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive, IsString, IsUUID, ValidateIf, ValidateNested } from "class-validator";

import { SortArgs } from "../../../common/sorting/sort.args";
import { DamItem } from "../dam-items.resolver";

// const DamItemCursorType = new GraphQLScalarType({
//     name: "DamItemCursorType",
// });

@ObjectType()
export class DamItemCursor {
    @Field(() => String)
    id: string;

    @Field(() => String)
    type: "file" | "folder";
}

@InputType()
export class DamItemCursorInput {
    @Field(() => String)
    @IsString()
    id: string;

    @Field(() => String)
    @IsString()
    type: "file" | "folder";
}

@ArgsType()
class DamItemCursorBasedPaginationArgs {
    @Field(() => Int, { nullable: true })
    @ValidateIf(({ after, first }) => first || after)
    // TODO: readd
    // @IsPropertyNotDefined("last", { message })
    @IsPositive()
    first?: number;

    @Field(() => DamItemCursorInput, { nullable: true })
    @Type(() => DamItemCursorInput)
    @ValidateIf(({ first }) => first)
    @ValidateNested()
    after?: DamItemCursorInput;

    @Field(() => Int, { nullable: true })
    @ValidateIf(({ before, last }) => last || before)
    // TODO: readd
    // @IsPropertyNotDefined("first", { message })
    @IsPositive()
    last?: number;

    @Field(() => DamItemCursorInput, { nullable: true })
    @Type(() => DamItemCursorInput)
    @ValidateIf(({ last }) => last)
    @ValidateNested()
    before?: DamItemCursorInput;
}

@InputType()
export class DamItemFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    mimetypes?: string[];
}

@ArgsType()
export class DamItemsArgs extends IntersectionType(DamItemCursorBasedPaginationArgs, SortArgs) {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    folderId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    includeArchived?: boolean;

    @Field(() => DamItemFilterInput, { nullable: true })
    @Type(() => DamItemFilterInput)
    @IsOptional()
    @ValidateNested()
    filter?: DamItemFilterInput;
}

@ObjectType({ isAbstract: true })
export abstract class DamItemEdge {
    @Field(() => DamItemCursor)
    cursor: DamItemCursor;

    @Field(() => DamItem)
    node: typeof DamItem;
}

@ObjectType()
class DamItemPageInfo {
    @Field(() => DamItemCursor, { nullable: true })
    startCursor: DamItemCursor | null;

    @Field(() => DamItemCursor, { nullable: true })
    endCursor: DamItemCursor | null;

    @Field(() => Boolean)
    hasPreviousPage: boolean;

    @Field(() => Boolean)
    hasNextPage: boolean;
}

@ObjectType()
export class PaginatedDamItems {
    @Field(() => [DamItemEdge], { nullable: true })
    edges: DamItemEdge[];

    @Field(() => DamItemPageInfo)
    pageInfo: DamItemPageInfo;

    constructor(edges: DamItemEdge[], pageInfo: DamItemPageInfo) {
        this.edges = edges;
        this.pageInfo = pageInfo;
    }
}
