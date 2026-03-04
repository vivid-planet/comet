// Template for OneToMany or joined-ManyToMany nested input.
// File name: {{entity-name}}-nested-{{related-entity-name}}.input.ts
// This is used when the parent entity owns a OneToMany or a join table relationship.

import { Field, InputType, ID } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { IsNullable } from "@comet/cms-api";

@InputType()
export class {{EntityName}}Nested{{RelatedEntityName}}Input {
    // Add the scalar fields that can be set on the related entity when
    // creating/updating it inline from the parent. Do NOT include the
    // back-reference FK to the parent (it is set automatically by the resolver).

    // Example scalar:
    // @IsNotEmpty()
    // @IsString()
    // @Field()
    // hexCode: string;

    // Example enum:
    // @IsNotEmpty()
    // @IsEnum(MyEnum)
    // @Field(() => MyEnum)
    // status: MyEnum;

    // Example ManyToOne ID on the nested entity (e.g. join table → related entity):
    // @IsNotEmpty()
    // @IsUUID()
    // @Field(() => ID)
    // tag: string;
}
