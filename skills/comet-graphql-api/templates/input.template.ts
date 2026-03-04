import { Field, InputType, ID } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { IsNullable, IsSlug, PartialType } from "@comet/cms-api";
// For block fields also import:
// import { BlockInputInterface, RootBlockInputScalar, isBlockInputInterface } from "@comet/cms-api";
// import { Transform } from "class-transformer";
// import { MyBlock } from "@comet/cms-api"; // or wherever the block is defined

// Import enums from the entity:
// import { MyEnum } from "../entities/{{entity-name}}.entity";

// Import nested input types for OneToMany relationships:
// import { {{EntityName}}Nested{{RelatedEntityName}}Input } from "./{{entity-name}}-nested-{{related-entity-name}}.input";

@InputType()
export class {{EntityName}}Input {
    // --- Scalar fields ---
    // Required string:
    // @IsNotEmpty()
    // @IsString()
    // @Field()
    // title: string;

    // Optional (nullable) string:
    // @IsNullable()
    // @IsString()
    // @Field({ nullable: true, defaultValue: null })
    // description?: string;

    // Slug string (unique identifier):
    // @IsNotEmpty()
    // @IsString()
    // @IsSlug()
    // @Field()
    // slug: string;

    // Required number:
    // @IsNotEmpty()
    // @IsNumber()
    // @Field()
    // price: number;

    // Optional (nullable) number:
    // @IsNullable()
    // @IsNumber()
    // @Field({ nullable: true, defaultValue: null })
    // price?: number;

    // Required boolean:
    // @IsNotEmpty()
    // @IsBoolean()
    // @Field({ defaultValue: true })
    // inStock: boolean;

    // Required enum:
    // @IsNotEmpty()
    // @IsEnum(MyEnum)
    // @Field(() => MyEnum)
    // status: MyEnum;

    // Array of enum values:
    // @IsEnum(MyEnum, { each: true })
    // @Field(() => [MyEnum], { defaultValue: [] })
    // additionalTypes: MyEnum[];

    // LocalDate (date-only) field:
    // @IsNullable()
    // @IsDateString()
    // @Field(() => GraphQLLocalDate, { nullable: true, defaultValue: null })
    // availableSince?: string;
    // (also import: import { GraphQLLocalDate } from "graphql-scalars";)

    // DateTime field:
    // @IsNullable()
    // @IsDate()
    // @Field({ nullable: true, defaultValue: null })
    // lastCheckedAt?: Date;

    // Block field (e.g. DamImageBlock):
    // @IsNotEmpty()
    // @Field(() => RootBlockInputScalar(DamImageBlock))
    // @Transform(({ value }) => (isBlockInputInterface(value) ? value : DamImageBlock.blockInputFactory(value)), { toClassOnly: true })
    // @ValidateNested()
    // image: BlockInputInterface;

    // --- Relationship fields ---

    // ManyToOne (nullable):
    // @IsNullable()
    // @Field(() => ID, { nullable: true, defaultValue: null })
    // @IsUUID()
    // category?: string;

    // ManyToOne (required):
    // @IsNotEmpty()
    // @Field(() => ID)
    // @IsUUID()
    // category: string;

    // ManyToMany (IDs array):
    // @Field(() => [ID], { defaultValue: [] })
    // @IsArray()
    // @IsUUID(undefined, { each: true })
    // tags: string[];

    // OneToMany (nested inputs array):
    // @Field(() => [{{EntityName}}Nested{{RelatedEntityName}}Input], { defaultValue: [] })
    // @IsArray()
    // @Type(() => {{EntityName}}Nested{{RelatedEntityName}}Input)
    // @ValidateNested({ each: true })
    // variants: {{EntityName}}Nested{{RelatedEntityName}}Input[];

    // OneToOne (nested input, nullable):
    // @IsNullable()
    // @Field(() => {{EntityName}}Nested{{RelatedEntityName}}Input, { nullable: true })
    // @Type(() => {{EntityName}}Nested{{RelatedEntityName}}Input)
    // @ValidateNested()
    // statistics?: {{EntityName}}Nested{{RelatedEntityName}}Input;

    // FileUpload (ManyToOne via ID string, not UUID):
    // @IsNullable()
    // @Field(() => ID, { nullable: true, defaultValue: null })
    // @IsString()
    // priceList?: string;

    // FileUpload ManyToMany (IDs array, string not UUID):
    // @Field(() => [ID], { defaultValue: [] })
    // @IsArray()
    // @IsString({ each: true })
    // datasheets: string[];
}

@InputType()
export class {{EntityName}}UpdateInput extends PartialType({{EntityName}}Input) {}
