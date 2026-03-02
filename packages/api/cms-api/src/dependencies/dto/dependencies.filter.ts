import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { BooleanFilter } from "../../common/filter/boolean.filter";
import { StringFilter } from "../../common/filter/string.filter";
import { IsUndefinable } from "../../common/validators/is-undefinable";

@InputType()
export class DependencyFilter {
    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    targetGraphqlObjectType?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    targetId?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootColumnName?: string;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsOptional()
    name?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsOptional()
    secondaryInformation?: StringFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    @IsOptional()
    visible?: BooleanFilter;

    @Field(() => [DependencyFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => DependencyFilter)
    @IsOptional()
    and?: DependencyFilter[];

    @Field(() => [DependencyFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => DependencyFilter)
    @IsOptional()
    or?: DependencyFilter[];
}

@InputType()
export class DependentFilter {
    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootGraphqlObjectType?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootId?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootColumnName?: string;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsOptional()
    name?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsOptional()
    secondaryInformation?: StringFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    @IsOptional()
    visible?: BooleanFilter;

    @Field(() => [DependentFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => DependentFilter)
    @IsOptional()
    and?: DependentFilter[];

    @Field(() => [DependentFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => DependentFilter)
    @IsOptional()
    or?: DependentFilter[];
}
