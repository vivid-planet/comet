import { BaseEntity, Embeddable, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { v4 as uuid } from "uuid";

@Embeddable()
@ObjectType()
@InputType("ContentScopeOnEntiyInput")
export class ContentScopeOnEntiy {
    @Field(() => MyScopeEntity)
    @ManyToOne(() => MyScopeEntity, { index: true, ref: true })
    scopeEntity!: Ref<MyScopeEntity>;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}

@InputType("MyScopeEntityInput")
export class MyScopeEntity extends BaseEntity<MyScopeEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();
}
