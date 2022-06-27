import { ArgsType, Field, ID, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { SortInput } from "../../../index";

@InputType()
class FolderFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;
}

@ArgsType()
export class FolderArgs {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    includeArchived?: boolean;

    @Field(() => FolderFilterInput, { nullable: true })
    @Type(() => FolderFilterInput)
    @IsOptional()
    @ValidateNested()
    filter?: FolderFilterInput;

    @Field(() => SortInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => SortInput)
    sort?: SortInput;
}

@ArgsType()
export class FolderByNameAndParentIdArgs {
    @Field()
    @IsString()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}
