import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Field, InputType } from "@nestjs/graphql";
import {
    // Import only the filter types you actually use:
    BooleanFilter,
    DateFilter,
    DateTimeFilter,
    IdFilter,
    ManyToManyFilter,
    ManyToOneFilter,
    NumberFilter,
    OneToManyFilter,
    StringFilter,
    createEnumFilter,
    createEnumsFilter,
} from "@comet/cms-api";
// Import any enums used in enum filter classes:
// import { MyEnum } from "../entities/{{entity-name}}.entity";

// Declare one filter class per enum field (single value):
// @InputType()
// class MyEnumEnumFilter extends createEnumFilter(MyEnum) {}

// Declare one filter class per enum array field:
// @InputType()
// class MyEnumEnumsFilter extends createEnumsFilter(MyEnum) {}

@InputType()
export class {{EntityName}}Filter {
    @Field(() => IdFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => IdFilter)
    id?: IdFilter;

    // Add one block per filterable field. Examples:

    // string field:
    // @Field(() => StringFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => StringFilter)
    // title?: StringFilter;

    // number field:
    // @Field(() => NumberFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => NumberFilter)
    // price?: NumberFilter;

    // boolean field:
    // @Field(() => BooleanFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => BooleanFilter)
    // inStock?: BooleanFilter;

    // Date (LocalDate) field:
    // @Field(() => DateFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => DateFilter)
    // availableSince?: DateFilter;

    // Date (DateTime) field:
    // @Field(() => DateTimeFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => DateTimeFilter)
    // lastCheckedAt?: DateTimeFilter;

    // single-value enum field:
    // @Field(() => MyEnumEnumFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => MyEnumEnumFilter)
    // status?: MyEnumEnumFilter;

    // array enum field:
    // @Field(() => MyEnumEnumsFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => MyEnumEnumsFilter)
    // additionalTypes?: MyEnumEnumsFilter;

    // ManyToOne relation:
    // @Field(() => ManyToOneFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => ManyToOneFilter)
    // category?: ManyToOneFilter;

    // ManyToMany relation:
    // @Field(() => ManyToManyFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => ManyToManyFilter)
    // tags?: ManyToManyFilter;

    // OneToMany relation:
    // @Field(() => OneToManyFilter, { nullable: true })
    // @ValidateNested()
    // @IsOptional()
    // @Type(() => OneToManyFilter)
    // variants?: OneToManyFilter;

    // Always include createdAt / updatedAt:
    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => DateTimeFilter)
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => DateTimeFilter)
    updatedAt?: DateTimeFilter;

    // Always include and/or for compound filters:
    @Field(() => [{{EntityName}}Filter], { nullable: true })
    @Type(() => {{EntityName}}Filter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: {{EntityName}}Filter[];

    @Field(() => [{{EntityName}}Filter], { nullable: true })
    @Type(() => {{EntityName}}Filter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: {{EntityName}}Filter[];
}
