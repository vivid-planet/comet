import { BlockDataInterface, createOneOfBlock, ExternalLinkBlock } from "@comet/blocks-api";
import { Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { RootBlockType } from "../../blocks/root-block-type";
import { DocumentInterface } from "../../document/dto/document-interface";
import { InternalLinkBlock } from "../../page-tree/blocks/internal-link.block";
import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum";

export interface RedirectInterface {
    [OptionalProps]?: "createdAt" | "updatedAt" | "active";
    id: string;
    sourceType: RedirectSourceTypeValues;
    source: string;
    target: BlockDataInterface;
    comment?: string;
    active: boolean;
    generationType: RedirectGenerationType;
    createdAt: Date;
    updatedAt: Date;
}

// TODO how to inject custom targets here and still make sure internal/external always exist
const DefaultLinkBlock = createOneOfBlock(
    { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock }, allowEmpty: false },
    "RedirectsLink",
);

@Entity({ abstract: true })
/*
@ObjectType({
    implements: () => [DocumentInterface],
    isAbstract: true,
})
*/
export class RedirectBaseEntity /*extends BaseEntity<RedirectBase, "id">*/ implements RedirectInterface, DocumentInterface {
    //static tableName = "Redirect";
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

    @Property({ customType: new RootBlockType(DefaultLinkBlock) }) //TODO is defining a default here useful?
    @Field(() => GraphQLJSONObject)
    target: BlockDataInterface;

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
