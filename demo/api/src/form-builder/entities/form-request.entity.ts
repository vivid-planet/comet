import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { v4 } from "uuid";

import { FormRequestInterface } from "../types";
import { FormBuilder } from "./form-builder.entity";

@ObjectType()
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: "disablePermissionCheck" })
export class FormRequest extends BaseEntity<FormRequest, "id"> implements FormRequestInterface<FormBuilder> {
    [OptionalProps]?: "createdAt";

    @Field(() => ID)
    @PrimaryKey({ columnType: "uuid" })
    id: string = v4();

    @Field(() => Date)
    @Property({ type: "Date", columnType: "timestamp with time zone" })
    createdAt: Date = new Date();

    @Field(() => FormBuilder)
    @ManyToOne(() => FormBuilder)
    form: Ref<FormBuilder>;

    @Property({ type: "json" })
    @Field(() => GraphQLJSONObject)
    submitData: Record<string, unknown>;
}
