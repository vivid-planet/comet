import { ArgsType, Field, ID, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { SortInput } from "../../../index";
import { FileCategory } from "./file-type.enum";

@InputType()
class FileFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;

    @Field(() => FileCategory, { nullable: true, description: "Filter by file category. Is overruled by mimetypes." })
    @IsOptional()
    @IsEnum(FileCategory)
    category?: FileCategory;

    @Field(() => [String], { nullable: true, description: "Filter by mimetype. Overrules category." })
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

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    showArchived?: boolean;

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
