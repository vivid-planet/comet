import { BlockDataInterface } from "@comet/blocks-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { DocumentInterface } from "../../document/dto/document-interface";
import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum";

@Entity({ abstract: true })
@ObjectType("RedirectBase", { isAbstract: true }) // ObjectType must be defined in base class! (The name "RedirectBase" is not used (we have no concrete type of RedirectBase))
export abstract class RedirectBase extends BaseEntity<RedirectBase, "id"> implements DocumentInterface {
    static tableName = "Redirect";
    [OptionalProps]?: "createdAt" | "updatedAt" | "active";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Enum(() => RedirectSourceTypeValues)
    @Field(() => RedirectSourceTypeValues)
    sourceType: RedirectSourceTypeValues;

    @Property({
        columnType: "text",
    })
    @Field()
    source: string;

    /* TO BE OVERWRITTEN IN APP
    @Property({ customType: new RootBlockType(linkBlock) })
    @Field(() => GraphQLJSONObject)
    target: BlockDataInterface;
    */
    abstract target: BlockDataInterface;

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    comment?: string;

    @Property({ default: true })
    @Field()
    active: boolean;

    @Enum(() => RedirectGenerationType)
    @Field(() => RedirectGenerationType)
    generationType: RedirectGenerationType;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
