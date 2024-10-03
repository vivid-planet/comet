import { ArgsType, Field, InputType, OmitType, PartialType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { StringFilter } from "../../common/filter/string.filter";
import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { SortDirection } from "../../common/sorting/sort-direction.enum";

@InputType()
class UserFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    name?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    email?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    status?: StringFilter;

    @Field(() => [UserFilter], { nullable: true })
    @Type(() => UserFilter)
    @ValidateNested({ each: true })
    and?: UserFilter[];

    @Field(() => [UserFilter], { nullable: true })
    @Type(() => UserFilter)
    @ValidateNested({ each: true })
    or?: UserFilter[];
}

enum UserSortField {
    name = "name",
    email = "email",
    status = "status",
}
registerEnumType(UserSortField, {
    name: "UserSortField",
});

@InputType()
class UserSort {
    @Field(() => UserSortField)
    @IsEnum(UserSortField)
    field: UserSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}

@ArgsType()
export class FindUsersResolverArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => UserFilter, { nullable: true })
    @ValidateNested()
    @Type(() => UserFilter)
    filter?: UserFilter;

    @Field(() => [UserSort], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => UserSort)
    sort?: UserSort[];

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    includeUsersWithoutPermissions?: boolean;
}

export class FindUsersArgs extends OmitType(PartialType(FindUsersResolverArgs), ["includeUsersWithoutPermissions"]) {}
