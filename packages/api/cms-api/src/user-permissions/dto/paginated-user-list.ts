import { ArgsType, Field, InputType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

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

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
enum UserSortField {
    name = "name",
    email = "email",
    status = "status",
}
/* eslint-enable @typescript-eslint/naming-convention */
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
export class FindUsersArgs extends OffsetBasedPaginationArgs {
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
}
