import { ArgsType, Field, ID, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { SortInput } from "../../../index";

@InputType()
class FileFilterInput {
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
export class FileArgs {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    folderId?: string;

    @Field({ nullable: true, defaultValue: false })
    @IsOptional()
    @IsBoolean()
    includeArchived?: boolean;

    @Field(() => FileFilterInput, { nullable: true })
    @Type(() => FileFilterInput)
    @IsOptional()
    @ValidateNested()
    filter?: FileFilterInput;

    @Field(() => SortInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => SortInput)
    sort?: SortInput;
}
