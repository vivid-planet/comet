import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudGenerator, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Collection, Embeddable, Embedded, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { v4 } from "uuid";

import { FormBuilderBlock } from "../blocks/form-builder.block";
import { FormBuilderInterface } from "../types";
import { FormRequest } from "./form-request.entity";

@Embeddable()
@ObjectType("")
@InputType("FormBuilderContentScopeInput")
export class FormBuilderContentScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}

@Entity()
@ObjectType()
@RootBlockEntity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class FormBuilder extends BaseEntity<FormBuilder, "id"> implements FormBuilderInterface<FormRequest> {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @Field(() => ID)
    @PrimaryKey({ columnType: "uuid" })
    id: string = v4();

    @Embedded(() => FormBuilderContentScope)
    @Field(() => FormBuilderContentScope)
    scope: FormBuilderContentScope;

    @Field(() => Date)
    @Property({ columnType: "timestamp with time zone" })
    createdAt: Date = new Date();

    @Field(() => Date)
    @Property({ columnType: "timestamp with time zone", onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Field(() => String)
    @Property({ columnType: "text" })
    name: string;

    @RootBlock(FormBuilderBlock)
    @Field(() => RootBlockDataScalar(FormBuilderBlock))
    @Property({ customType: new RootBlockType(FormBuilderBlock) })
    blocks: BlockDataInterface;

    @Field(() => [FormRequest])
    @OneToMany(() => FormRequest, (request) => request.form)
    requests = new Collection<FormRequest>(this);

    @Field(() => String, { nullable: true })
    @Property({ columnType: "text", nullable: true })
    submitButtonText?: string;
}
